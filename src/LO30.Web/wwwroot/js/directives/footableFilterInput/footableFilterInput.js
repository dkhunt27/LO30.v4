'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.directive('lo30FootableFilterInput',
  [
    function () {
      return {
        restrict: 'E',
        template: '<input id="filter" type="text" class="input-datatables-filter" />',
        scope: {
        },
        link: function (scope, element, attrs, controller) {

          var table = element.parents('table');

          e.preventDefault();

            //get the footable filter object
            var footableFilter = $('table').data('footable-filter');

            alert('about to filter table by "tech"');
            //filter by 'tech'
            footableFilter.filter('tech');

            //clear the filter
            if (confirm('clear filter now?')) {
                footableFilter.clearFilter();
            }
        }
      };
    }
  ]
);

