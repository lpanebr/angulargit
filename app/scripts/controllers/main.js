'use strict';

angular.module('angulargitApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    var profile = window.profileInfo;
    var people = window.peopleInfo;



    if((profile !== undefined) && (people !== undefined)){
      //tmp container showing user informations
      $('#welcome').hide();
      $('#authOn').fadeIn('slow');
      $('#authOff').hide('slow');


      //show tmp profile information
      $('#profile').append($('<h2>'+profile.displayName+'</ph2>'));
      $('#profile').append($('<p>'+
        '<a href="'+profile.url+'" target="_blank"><img src=\"'+profile.image.url+'\"></a>'+
        '<span><strong>'+profile.displayName+'</strong></span></p>'+
        '<p><span><strong>Skills: </strong>'+profile.skills+'</span>'+
        '</p>'));
      if (profile.cover && profile.coverPhoto){
        $('#profile').append($('<p><img src=\"'+profile.cover.coverPhoto.url+'\"></p>'));
      }

      //show tmp circles information
      $('#visiblePeople').append('<h2>In your circles (<span class="count">'+people.totalItems+'</span>)</h2>');
      for (var personIndex in people.items){
        var person = people.items[personIndex];
        $('#visiblePeople').append('<img src="'+person.image.url+'">');
      }
    }else{
      $('#authOn').hide();
      $('#welcome').hide();
      $('#authOff').fadeIn('slow');
    }
  });
