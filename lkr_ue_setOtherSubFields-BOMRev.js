/**
 *@NApiVersion 2.0
 *@NScriptType UserEventScript
 */
 
define(['N/record'], 
function(record) {
	// Other Sublist Fields on BOM Revision record
	var CUSTFLD_VENDOR = 'custrecord_lk_preferred_vendor';
	var CUSTFLD_PRICE  = 'custrecord_lk_preferred_vendor_price';
	
	function beforeSubmit(context) {
		// Set variables
		var recBOMrev = context.newRecord;
		var recOld = context.oldRecord;
		var itemId    = null;
		var preferred = null;
		
		// Get number of components
		var itemCount = recBOMrev.getLineCount({
			sublistId : 'component'
		});
		
		// Loop through components
		for(var itemIter = 0; itemIter < itemCount; itemIter++){
			// Get current item
			itemId = recBOMrev.getSublistValue({
				sublistId : 'component',
				fieldId   : 'item',
				line      : itemIter
			});
			
			log.debug({
				title   : '***** Line ' + itemIter + ' *****',
				details : 'Item ID: ' + itemId
			});
			
			// Get preferred vendor in item record
			preferred = getPreferred(itemId);
			
			// Set vendor
			if(preferred.vendor != null){
				recBOMrev.setSublistText({
					sublistId : 'component',
					fieldId   : CUSTFLD_VENDOR,
					line      : itemIter,
					text      : preferred.vendor
				});
				
				log.debug({
					title   : 'Preferred Vendor',
					details : preferred.vendor
				});
			}
			
			// Set price
			if(preferred.price != null){
				recBOMrev.setSublistText({
					sublistId : 'component',
					fieldId   : CUSTFLD_PRICE,
					line      : itemIter,
					text      : preferred.price
				});
				
				log.debug({
					title   : 'Preferred Vendor Price',
					details : preferred.price
				});
			}
			
			recBOMrev.setValue({
				fieldId : 'memo',
				value   : 'Test'
			});
		}
	}
	
	function getPreferred(itemId){
		// Set variables
		var isPreferred = null;
		var prefVendor  = null;
		var prefPrice   = null;
		
		// Load item record
		var recItem = record.load({
			type : record.Type.INVENTORY_ITEM,
			id   : itemId
		});
		
		// Get number of vendors
		var vendorCount = recItem.getLineCount({
			sublistId : 'itemvendor'
		});
		
		// Loop through vendors
		for(var vendIter = 0; vendIter < vendorCount; vendIter++){
			// Get preferred vendor
			isPreferred = recItem.getSublistValue({
				sublistId : 'itemvendor',
				fieldId   : 'preferredvendor',
				line      : vendIter
			});
						
			// If vendor is preferred
			if(isPreferred == true){
				// Get vendor
				prefVendor = recItem.getSublistText({
					sublistId : 'itemvendor',
					fieldId   : 'vendor',
					line      : vendIter
				});
				
				// Get price
				prefPrice = recItem.getValue({
					fieldId : 'lastpurchaseprice'
				});
				
				/*var prefPrice = recItem.getSublistText({
					sublistId : 'itemvendor',
					fieldId   : 'itemvendorprice',
					line      : vendIter
				});*/
				
				return {
					vendor : prefVendor,
					price  : prefPrice
				}
			}
		}
		
		log.debug({
			title   : 'function getPreferred(itemId)',
			details : 'No preferred vendor in the item record.'
		})
		
		return {
			vendor : null,
			price  : null
		}
	}
	
	return {
		beforeSubmit : beforeSubmit
	};
});
