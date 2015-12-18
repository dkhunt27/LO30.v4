'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.factory(
  'alertService',
  [
    'toaster',
    'externalLibService',
    function (toaster, externalLibService) {

      var _ = externalLibService._;

      var alertTitleDataRetrievalSuccessful = "Data Retrieval Successful";
      var alertTitleDataRetrievalUnsuccessful = "Data Retrieval Unsuccessful";
      var alertMessageTemplateRetrievalSuccessful = "Retrieved <%=retrievedType%>, Length: <%=retrievedLength%>";
      var alertMessageTemplateRetrievalUnsuccessful = "Received following error trying to retrieve <%=retrievedType%>. Error:<%=retrievedError%>";
      var alertMessageTemplateRetrievalUnsuccessfulWarning = "Received following warning trying to retrieve <%=retrievedType%>. Warning:<%=retrievedWarning%>";
      var alertMessage;

      var errorRetrieval = function (retrievedType, retrievedError) {
        if (typeof retrievedError === "object") {
          retrievedError = JSON.stringify(retrievedError, null, 2);
        }

        alertMessage = _.template(alertMessageTemplateRetrievalUnsuccessful)({ retrievedType: retrievedType, retrievedError: retrievedError });
        error(alertMessage, alertTitleDataRetrievalUnsuccessful)
      };

      var error = function (body, title) {
        if (typeof body === "object") {
          body = JSON.stringify(body, null, 2);
        }

        toaster.pop("error", title, body, 5000);
        console.error(title + ":" + body);
      };

      var info = function (body, title) {
        toaster.pop("info", title, body, 5000);
        console.log(title + ":" + body);
      };

      var successRetrieval = function (retrievedType, retrievedLength) {
        alertMessage = _.template(alertMessageTemplateRetrievalSuccessful)({ retrievedType: retrievedType, retrievedLength: retrievedLength });
        success(alertMessage, alertTitleDataRetrievalSuccessful)
      };

      var success = function (body, title) {
        toaster.pop("success", title, body, 5000);
        console.log(title + ":" + body);
      };

      var warningRetrieval = function (retrievedType, retrievedWarning) {
        if (typeof retrievedWarning === "object") {
          retrievedWarning = JSON.stringify(retrievedWarning, null, 2);
        }

        alertMessage = _.template(alertMessageTemplateRetrievalUnsuccessfulWarning)({ retrievedType: retrievedType, retrievedWarning: retrievedWarning });
        warning(alertMessage, alertTitleDataRetrievalUnsuccessful)
      };
      var warning = function (body, title) {
        toaster.pop("warning", title, body, 5000);
        console.warn(title + ":" + body);
      };

      return {
        errorRetrieval: errorRetrieval,
        error: error,
        info: info,
        successRetrieval: successRetrieval,
        success: success,
        warningRetrieval: warningRetrieval,
        warning: warning
      };
    }
  ]
);
