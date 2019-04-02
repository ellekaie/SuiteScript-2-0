/**
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 */
 
define(['N/search'], 
function(search){
	function beforeLoad(context){
		var rec  = context.newRecord;
		var form = context.form;
		
		// Get Posting Period
		var fldPeriod = rec.getValue({
			fieldId : 'postingperiod'
		});
		
		// Check if Posting Period is closed
		var closedLookup = search.lookupFields({
			type    : search.Type.ACCOUNTING_PERIOD,
			id      : fldPeriod,
			columns : 'closed'
		});
		
		var isClosed = closedLookup.closed;
		
		log.debug('Check Accounting Period', 'Period: ' + fldPeriod + ' | Closed: ' + isClosed);
		
		// Remove Edit button if Accounting Period is closed
		if (isClosed){
			form.removeButton('edit');
		}
	}
	
	return {
		beforeLoad : beforeLoad
	};
});
