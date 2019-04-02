/**
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 */
 
define(['N/format'], 
function(format){
	function beforeSubmit(context){
		var rec = context.newRecord;
		
		var now = new Date();
	
		var newDate = format.format({
			value    : now,
			type     : format.Type.DATETIME,
			timezone : format.Timezone.AMERICA_PHOENIX
		});
		
		log.debug({
			title   : 'newDate',
			details : newDate
		})
	}
	
	return {
		beforeSubmit : beforeSubmit
	};
});
