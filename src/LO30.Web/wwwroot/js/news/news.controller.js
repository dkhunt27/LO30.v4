'use strict';

angular.module('lo30NgApp')
  .controller('newsController', function ($log, $sce) {

    var vm = this;

    var a0 = "<h3>Stats</h3>";
    a0 = a0 + "Stats updated thru 11/6.";

    var a1 = "<h3>2016-2017 Registration</h3>";
    a1 = a1 + "It's that time of year to begin the registration process for this fall<br/>";
    a1 = a1 + "Please read the Registration Cover Letter, complete the Registration Form, and mail it with your check to league (address info on the form) by July 1st, 2016.<br/>";

    var a2 = "<h3>Board Members</h3>";
    a2 = a2 + "Your 2016-2017 Board Members are:<br/>";
    a2 = a2 + "<br/>";
    a2 = a2 + "<h4><b>President:</b> Steve Crandall</h4>";
    a2 = a2 + "<br/>";
    a2 = a2 + "<h4>Pete Howard -- Hunt's Ace</h4>";
    a2 = a2 + "<h4>Gary Cutsy -- DPKZ</h4>";
    a2 = a2 + "<h4>Bob Toaso -- Bill Brown</h4>";
    a2 = a2 + "<h4>Tony Zaschak -- Zaschak</h4>";
    a2 = a2 + "<h4>Greg Panaretos -- LAB/PSI</h4>";
    a2 = a2 + "<h4>Nick Niemiec -- Glover</h4>";
    a2 = a2 + "<h4>Scott Green -- D&G</h4>";
    a2 = a2 + "<h4>Jim Weak -- Villanova</h4>";
    a2 = a2 + "<br/>";
    a2 = a2 + "<h5>Mike Hermann (Volunteer Treasurer)</h5>";
    a2 = a2 + "<h5>Dan Hunt (Volunteer Secretary/Web Admin)</h5>";

    var a3 = "<h3>Season Opener 9/8 </h3>";
    a2 = a2 + "<br/>";
    a3 = a3 + "<h4>Rink A 8:30	Hunt's Ace vs Villanova</h4>";
    a3 = a3 + "<h4>Rink B 9:00	DPKZ vs LAB/PSI</h4>";
    a3 = a3 + "<h4>Rink A 9:30	Bill Brown vs Glover</h4>";
    a3 = a3 + "<h4>Rink B 10:00	D&G vs Zas Ent</h4>";

    var a4 = "<h3>Socks</h3>";
    a4 = a4 + "The sox we have used the last two seasons belong to the League. When you pack your bag this week, plz include any sox you might have from last year or the year before. If you are on the same team, those are your sox this year. If you are on a different team, give those sox to your Board Member -- he will get them back to where they belong.<br/>";

    var a5 = "<h3>New Site</h3>";
    a5 = a5 + "Updated the site.  Will be rolling out more functionality over the coming months.";

    var a6 = "<h3>Site Updated</h3>";
    a6 = a6 + "Added Last 5 and Streak to Standings. Updated GWG calculation.";

    var a7 = "<h3>Site Updated</h3>";
    a7 = a7 + "Added line statistics.";

    vm.news = [{
      "class": "chat-message right",
      "image": "img/board/dan.png",
      "author": "Dan Hunt",
      "date": "Wed Nov 9 2016",
      "content": $sce.trustAsHtml(a0)
    }, {
      "class": "chat-message left",
      "image": "img/board/dan.png",
      "author": "Dan Hunt",
      "date": "Fri Nov 11 2016",
      "content": $sce.trustAsHtml(a7)
    }, {
      "class": "chat-message right",
      "image": "img/board/dan.png",
      "author": "Dan Hunt",
      "date": "Wed Nov 2 2016",
      "content": $sce.trustAsHtml(a6)
    }, {
      "class": "chat-message left",
      "image": "img/board/dan.png",
      "author": "Dan Hunt",
      "date": "Sun Sept 11 2016",
      "content": $sce.trustAsHtml(a5)
    },{
      "class": "chat-message right",
      "image": "img/board/steve.png",
      "author": "Steve Crandall",
      "date": "Mon Sept 5 2016",
      "content": $sce.trustAsHtml(a4)
    }, {
      "class": "chat-message left",
      "image": "img/board/dan.png",
      "author": "Dan Hunt",
      "date": "Sun Sept 4 2016",
      "content": $sce.trustAsHtml(a3)
    }, {
      "class": "chat-message right",
      "image": "img/board/dan.png",
      "author": "Dan Hunt",
      "date": "Mon Aug 22 2016",
      "content": $sce.trustAsHtml(a2)
    },
      {
        "class": "chat-message left",
        "image": "img/board/mike.png",
        "author": "Mike Hermann",
        "date": "Wed Jun 1 2016",
        "content": $sce.trustAsHtml(a1)
      }
    ];


    vm.$onInit = function () {


    };

  }
);