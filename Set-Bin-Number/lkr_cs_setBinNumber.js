/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
 
define(['N/currentRecord', 'N/url', 'N/https', 'N/ui/dialog'], 
function(currentRecord, url, https, dialog){
	function pageInit(){
		// Placeholder to allow setBinNumber
		log.debug('Enter', 'pageInit');
	}
	
	function setBinNumber(){
		log.debug('Enter', 'setBinNumber');
		
		// Get Item Fulfillment record
		var rec = currentRecord.get()
		
		// Get number of items
		var itemCount = rec.getLineCount({
			sublistId : 'item'
		});
		
		log.debug('itemCount', itemCount);
		
		// Loop through items
		for(var itemIter = 0; itemIter < itemCount; itemIter++){
			log.debug('itemIter', '===== ' + itemIter + ' =====');
			
			// Check if Fulfill = T
			var isFulfill = rec.getSublistValue({
				sublistId : 'item',
				fieldId   : 'itemreceive',
				line      : itemIter
			});
			
			log.debug('isFulfill', isFulfill);
			
			if(isFulfill){
				
				// Get values from fulfillment line
				var item = rec.getSublistValue({
					sublistId : 'item',
					fieldId   : 'item',
					line      : itemIter
				});
						
				var location = rec.getSublistValue({
					sublistId : 'item',
					fieldId   : 'location',
					line      : itemIter
				});
			
				var quantity = rec.getSublistValue({
					sublistId : 'item',
					fieldId   : 'quantity',
					line      : itemIter
				});
				
				// Create JSON object to be passed to the suitelet
				var itemJSON = {
					'item'     : item,
					'location' : location,
					'quantity' : quantity
				}
				log.debug('itemJSON', itemJSON);
				
				var postData = JSON.stringify(itemJSON);
				log.debug('postData', postData);
				
				// Create suitelet URL
				var suiteletUrl = url.resolveScript({
					scriptId     : 'customscript_nsas_sl_set_bin_number',
					deploymentId : 'customdeploy_nsas_sl_set_bin_number'
				});
				
				log.debug('suiteletUrl', suiteletUrl);
				
				// Call suitelet to locate bins to set to Bin Numbers column
				var binString = https.post({
					url  : suiteletUrl,
					body : postData
				});
				
				log.debug('binString.body', binString.body);
				
				if(binString.body != '0'){
					// Set binString to Bin Numbers column
					rec.selectLine({
						sublistId : 'item',
						line      : itemIter
					})
					
					rec.setCurrentSublistValue({
						sublistId : 'item',
						fieldId   : 'binnumbers',
						value     : binString.body
					});	
					
					rec.commitLine({
						sublistId : 'item'
					});
				}
				else{
					dialog.alert({
						title   : 'Alert',
						message : 'The item has no bins assigned.'
					});
				}
			} // END if(isFulfill)
			else{
				// Ignore line if Fulfill is not checked
			}
		} // END for loop
	} // END function setBinNumber()
	
	return{
		pageInit     : pageInit,
		setBinNumber : setBinNumber
	};
});
