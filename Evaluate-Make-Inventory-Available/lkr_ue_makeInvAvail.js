/**
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 */
 
define(['N/record'], 
function(record){
	function beforeSubmit(context){
		// Get Work Order Issue record
		var rec = context.newRecord;
		
		// Get number of Component subrecords
		var numComp = rec.getLineCount('component');

		// Loop through Component subrecords
		for(var iterComp = 0; iterComp < numComp; iterComp++){
			
			// Get Components subrecord
			var comp = rec.getSublistSubrecord({
				sublistId : 'component',
				fieldId   : 'componentinventorydetail',
				line      : iterComp
			});
			
			// Get number of Inventory lines
			var numInv = comp.getLineCount('inventoryassignment');
			
			// Loop through Inventory lines
			for(var iterInv = 0; iterInv < numInv; iterInv++){
				
				// Get Inventory Status 
				var idStatus = comp.getSublistValue({
					sublistId : 'inventoryassignment',
					fieldId   : 'inventorystatus',
					line      : iterInv
				});
				
				// Load Inventory Status record
				var recInvS = record.load({
					type : record.Type.INVENTORY_STATUS,
					id   : idStatus
				});
				
				// Get value of Make Inventory Available checkbox
				var isInvAvail = recInvS.getValue({
					fieldId : 'inventoryavailable'
				});
				
				// If Make Inventory Available is checked
				if(!isInvAvail){
					throw 'Status is not available for inventory.'
				}
			}
		}
	}
	
	return {
		beforeSubmit : beforeSubmit
	};
});
