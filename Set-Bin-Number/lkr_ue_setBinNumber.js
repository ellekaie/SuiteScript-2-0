/**
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 */
 
define(['N/runtime'], 
function(runtime){
	function beforeLoad(context){
		var type = context.type;
		
		if(type == context.UserEventType.CREATE || type == context.UserEventType.EDIT || type == context.UserEventType.COPY){
			var form = context.form;
		
			var scriptObj = runtime.getCurrentScript();
			var clientScriptId = scriptObj.getParameter({
				name : 'custscript_client_script_file_id'
			});
			log.debug('clientScriptId', clientScriptId);
			
			form.clientScriptFileId = clientScriptId;
			
			form.addButton({
				id           : 'custpage_setBinNumber',
				label        : 'Set Bin Number',
				functionName : 'setBinNumber'
			});
		}
	}
	
	return {
		beforeLoad : beforeLoad
	};
});
