/**
 *@NApiVersion 2.0
 *@NScriptType ClientScript
 */
 
define(['N/record'], 
function(record) {	
	function pageInit(context){
		var recInvD     = context.currentRecord;
		
		console.log(recInvD);
		
		var sublInvAsgn = recInvD.getSublist({
			sublistId : 'inventoryassignment'
		});
		
		console.log(sublInvAsgn);
		
		var colStatus   = sublInvAsgn.getColumn({
			fieldId : 'inventorystatus'
		});     
		
		console.log(colStatus);
		
		alert(colStatus);
	}
	
	function validateLine(context) {
		if(context.sublistId == 'inventoryassignment'){
			// Get Inventory Detail record
			var recInvD = context.currentRecord;
			
			// Get value of Status
			var idStatus = recInvD.getCurrentSublistValue({
				sublistId : 'inventoryassignment',
				fieldId   : 'inventorystatus'
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
			if(isInvAvail){
				// Allow user to enter line
				return true;
			}
			// If Make Inventory Available is unchecked
			else{
				alert('Status is not available for inventory.');
				return false;
			}
		}
		return true;
	}
	
	return {
		pageInit     : pageInit,
		validateLine : validateLine
	};
});
