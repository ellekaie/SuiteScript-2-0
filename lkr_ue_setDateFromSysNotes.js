/**
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 */
 
define(['N/record', 'N/search', 'N/format'], 
function(record, search, format){
	function afterSubmit(context){
		
		// Get Intercompany SO record
		var recId = context.newRecord.id;
		
		var recObj = record.load({
			type : record.Type.SALES_ORDER,
			id   : recId
		})
		
		// Get value of Paired Intercompany Transaction
		var fromPO = recObj.getValue({
			fieldId : 'intercotransaction'
		});
		
		log.debug('fromPO', fromPO);
		
		// Only execute during record creation and if created from Intercompany Purchase Order
		if(context.type == context.UserEventType.CREATE && fromPO != ''){
			
			// Create search to get creation date via System Notes
			var searchObj = search.create({
				type    : search.Type.SALES_ORDER,
				filters :
				[
					['internalidnumber', 'equalto', recId]
				],
				columns :
				[
					search.createColumn({
						name  : 'date',
						join  : 'systemNotes',
						label : 'Date'
					})
				]
			});
						
			// Limit result to 1 since search will return similar multiple dates
			var searchResult = searchObj.run().getRange(0, 1);
						
			// Get Date
			var dateFromSearch = searchResult[0].getValue({
				name : 'date',
				join : 'systemNotes'
			});
			log.debug('dateFromSearch', dateFromSearch);
			
			var dateToSet = format.parse({
				value : dateFromSearch,
				type  : format.Type.DATE
			});
			log.debug('dateToSet', dateToSet);
			
			// Set Date from System Notes
			recObj.setValue({
				fieldId : 'trandate',
				value   : dateToSet
			});
			
			// Save SO
			recObj.save();
		}
		else{
			//Do nothing
		}
	}
	
	return {
		afterSubmit : afterSubmit
	};
});
