/**
 *@NApiVersion 2.0
 *@NScriptType UserEventScript
 */
 
define(['N/record', 'N/search'], 
function (record, search){
	function afterSubmit(context){
		// Only run if Invoice is approved
		if(context.type == context.UserEventType.APPROVE){
			// Initialize variables		
			var recInv = context.newRecord;
			var idInv = recInv.id;
				
			// Create Related Records search to access Deposit Application
			var searchRelRec = search.create({
				type    : search.Type.TRANSACTION,
				filters : 
				[
					['internalidnumber', 'equalto', recInv.id],
					'AND',
					['applyingtransaction.type', 'anyof', 'DepAppl']
				],
				columns :
				[
					search.createColumn({
						name  : 'internalid',
						join  : 'applyingTransaction',
						label : 'Internal ID'
					})
				]
			});
			
			try{
				var idDepApp = null;
				
				// Run Related Records search
				searchRelRec.run().each(function(result){
					idDepApp = result.getValue({
						name : 'internalid',
						join : 'applyingTransaction'
					});
				});
				
				log.debug({
					title   : 'Deposit Application ID',
					details : idDepApp
				});
				
				// Execute only if there is a Deposit Application
				if (idDepApp != null){
					// Load Deposit Application record
					var recDepApp = record.load({
						type : record.Type.DEPOSIT_APPLICATION,
						id   : idDepApp
					})
					
					// Get value of Invoice Date
					var dateInv = recInv.getValue({
						fieldId : 'trandate'
					});
					
					// Copy Invoice Date to Deposit Application
					recDepApp.setValue({
						fieldId : 'trandate',
						value   : dateInv
					});
					
					recDepApp.save();
				}
			}
			catch(e){
				log.error({
					title   : 'Error',
					details : e.message
				})
			}
		}
	}
	
	return {
		afterSubmit : afterSubmit
	};
});
