/**
 *@NApiVersion 2.0
 *@NScriptType Suitelet
 */
 
define(['N/url'], 
function(url){
	function onRequest(context){
		var urlAPP = url.resolveDomain({
			hostType  : url.HostType.APPLICATION,
			accountId : 'TSTDRV123456'
		});
		
		var urlREST = url.resolveDomain({
			hostType  : url.HostType.RESTLET,
			accountId : 'TSTDRV123456'
		});
		
		var urlWS = url.resolveDomain({
			hostType  : url.HostType.SUITETALK,
			accountId : 'TSTDRV123456'
		});
	}
	
	return {
		onRequest : onRequest
	};
});
