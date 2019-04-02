/**
 *@NApiVersion 2.0
 *@NScriptType Suitelet
 */

define(['N/config', 'N/runtime'], 
function(config, runtime) {
    function execute(context){
		var cl = config.load({
			type: config.Type.FEATURES
		});
		
		var feature = cl.getValue({
			fieldId: 'advancedbillofmaterials'
		})
		
		log.debug('Feature', feature)
	}
	
	return{
		execute : execute
	}
});
