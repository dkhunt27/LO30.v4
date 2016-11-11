(function() {
  'use strict';

  angular
    .module('lo30NgApp')

    //.constant("constScheduleTeamFeedBaseUrl", "localhost:24176")
    .constant("constScheduleTeamFeedBaseUrl", "livoniaover30hockey.com")
    //.constant("constScheduleTeamFeedBaseUrl", "lo30v4.azurewebsites.net")

    .config(['$compileProvider',
      function($compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|webcal):/);
      }
    ])

    .run(['$rootScope', '$urlRouter', '$location', '$state', function ($rootScope, $urlRouter, $location, $state) {
      $rootScope.$on('$locationChangeSuccess', function (e, newUrl, oldUrl) {

        if ($state.current.data && $state.current.data.pageTitle) {
          document.title = $state.current.data.pageTitle + "-LO30";
        } else {
          document.title = "LO30";
        }

        // Prevent $urlRouter's default handler from firing
        e.preventDefault();

        /** 
         * provide conditions on when to 
         * sync change in $location.path() with state reload.
         * I use $location and $state as examples, but
         * You can do any logic
         * before syncing OR stop syncing all together.
         */

        if ($state.current.name !== 'main.exampleState' || newUrl === 'http://some.url' || oldUrl !=='https://another.url') {
          // your stuff
          $urlRouter.sync();
        } else {
          // don't sync
        }
      });
      // Configures $urlRouter's listener *after* your custom listener
      $urlRouter.listen();
    }])

})();
