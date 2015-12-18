'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.factory("dataServiceResponseHandler",
  [
    "$q",
    "alertService",
    function ($q, alertService) {
     
      var errMsg;
      var reponseListMustBePopulated = function (result, retrievedType) {
        var deferred = $q.defer();

        if (result) {
          if (result.length) {
            if (result.length > 0) {
              alertService.successRetrieval(retrievedType, result.length);
              deferred.resolve(result);
            } else {
              // results not successful; expected there to be a populated list
              errMsg = "List is empty; must be populated";
              alertService.errorRetrieval(retrievedType, "List is empty; must be populated");
              deferred.reject({ errMsg: errMsg, result: result });
            }
          } else {

            // results not successful; expected there to be a list
            alertService.errorRetrieval(retrievedType, result.reason);
            deferred.reject({ errMsg: result.reason, result: result });
          }
        } else {
          // results not successful; expected there to be results
          errMsg = "Results are empty; must be populated list";
          alertService.errorRetrieval(retrievedType, errMsg);
          deferred.reject({ errMsg: errMsg, result: result });
        }
      
        return deferred.promise;
      };

      return {
        reponseListMustBePopulated: reponseListMustBePopulated
      };
    }
  ]
);

