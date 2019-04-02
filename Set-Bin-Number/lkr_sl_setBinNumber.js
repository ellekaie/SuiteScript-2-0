/**
 *@NApiVersion 2.x
 *@NScriptType Suitelet
 */
 
define(['N/search'], 
function(search){
	function onRequest(context){
		log.debug('onRequest', 'Enter');
		var request  = context.request;
		var response = context.response;
	   
		if(request.method == 'POST'){
			var fulfillLine = JSON.parse(request.body);
			
			// Load search
			log.debug('Load search');
			var binSrchObj = search.load({
				id   : 'customsearch_nsas_inventory_item_bin_sea',
				type : search.Type.ITEM
			});
			
			// Add dynamic filters
			var filterItem = search.createFilter({
				name     : 'internalidnumber',
				operator : 'equalto',
				values   : fulfillLine.item
			});
				
			var filterBinLoc = search.createFilter({
				name     : 'location',
				join     : 'binNumber',
				operator : 'anyof',
				values   : fulfillLine.location
			});
			
			binSrchObj.filters.push(filterBinLoc);
			binSrchObj.filters.push(filterItem);
			
			// Store value to be set on Bin Numbers column
			var binString = '';
			
			// Store quantity value
			var quantity = fulfillLine.quantity;
			log.debug('quantity');
			
			// Run search
			var binSrchObjCount = binSrchObj.runPaged().count;
			
			// If search is not empty
			if(binSrchObjCount != 0){
				
				binSrchObj.run().each(function(binSrchRes){
				log.debug('Enter each loop');
				
					// Get value of Bin On Hand Available column
					var binAvailable = binSrchRes.getValue({
						name  : 'binonhandavail'
					});
					
					// Get value of Bin Number column
					var binName = binSrchRes.getValue({
						name  : 'binnumber',
						join  : 'binNumber'
					});
					
					var rem = quantity - binAvailable;
					log.debug('rem = quantity - binAvailable', rem + ' | ' + quantity + ' | ' + binAvailable);
					
					if(rem >= 0){
						var binTempStr = binName + '(' + binAvailable + ')' + '\n';
						binString = binString.concat(binTempStr);
						quantity = rem;
						log.debug('if(rem >= 0)', binTempStr + ' | ' + binString + ' | ' + quantity);
						
						return true;
					}
					// If rem is negative
					else{
						var binTempStr = binName + '(' + quantity + ')';
						binString = binString.concat(binTempStr);
						log.debug('else', binTempStr + ' | ' + binString);
						
						return false;
					}
				}); // END run().each
				
				response.write(binString);
			}
			// If search is empty
			else{
				response.write('0');
			}
		}
	}
	
	return{
		onRequest : onRequest
	};
});
