/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 */
 
define(['N/cache', 'N/runtime'], 
function(cache, runtime){
	function beforeLoad(context){
		var request = context.request.parameters;
		
		// Only run if Cash Refund is created from Return Authorization
		if(context.type == context.UserEventType.CREATE && request.transform == 'rtnauth'){
			
			// Initialize variables
			var cacheRA = cache.getCache({
				name : 'cacheRetAuth'
			});
			var currentUser = runtime.getCurrentUser().name;
			var retAuthId   = request.id;
			
			log.debug('Initialization', 'retAuthId: ' + retAuthId + ' | currentUser: ' + currentUser)
			
			// Check if Return Authorization ID is already in cache
			var checkRetAuth = cacheRA.get({
				key : retAuthId
			});
			
			// If Return Authorization ID is not found in cache
			if(checkRetAuth == null){
				cacheRA.put({
					key   : retAuthId,
					value : currentUser
				});
				
				log.debug('Added to cache', 'retAuthId: ' + retAuthId + ' | currentUser: ' + currentUser)
			}
			else if(checkRetAuth != currentUser){
				throw 'Record is being edited by ' + checkRetAuth;
			}
			else{
				// Do nothing, Cash Refund is tagged under current user
			}
			
		}
	}
	
	function afterSubmit(context){
		var rec = context.newRecord;
		
		if(context.type == context.UserEventType.CREATE){
			
			// Initialize cache
			var cacheRA = cache.getCache({
				name : 'cacheRetAuth'
			});
			
			// Get value of Return Authorization ID in Created From field
			var createdFrom = rec.getValue({
				fieldId : 'createdfrom'
			})
			
			log.debug('createdFrom', createdFrom);
			
			// Check if Return Authorization ID is already in cache
			var checkRetAuth = cacheRA.get({
				key : createdFrom
			});
			
			if(checkRetAuth != null){	
				cacheRA.remove({
					key   : createdFrom
				});
				
				log.debug('Removed from cache', 'retAuthId: ' + createdFrom)
			}
			else{
				// Do nothing, Cash Refund is not created from Return Authorization
			}
		}
	}
	
	return {
		beforeLoad  : beforeLoad,
		afterSubmit : afterSubmit
	};
});
