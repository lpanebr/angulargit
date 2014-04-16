/*global $:false */
'use strict';

/* Google + Sign In (Issue #2)
*¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨
* Google API to sign-in in a web app using google users credentials
*
* Servers with permissions to access so far:
* - http://127.0.0.1:9000
* - http://localhost:9000
*
===================================================================*/

//Loading Google+ API Script
(function() {
  var po = document.createElement('script');
  po.type = 'text/javascript'; po.async = true;
  po.src = 'https://plus.google.com/js/client:plusone.js';
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(po, s);
})();

//Check if the user is sign-in
function onSignInCallback(authResult) {
  gapi.client.load('plus','v1', function(){
    if (authResult['access_token']) {
      //sign-in and out buttons
      $('#disconnect').show();
      $('#gConnect').hide();

      //tmp container showing user informations
      $('#welcome').fadeOut('slow', function(){
          $('#authOn').fadeIn('slow');
      });
      $('#authOff').hide('slow');


      //running profile and people functions
      profile();
      people();

      //updating user global status
      window.userLogged = true;

    } else if (authResult['error']) {
      //sign-in and out buttons
      $('#disconnect').hide();
      $('#gConnect').show();

      //tmp container showing user informations
      $('#authOn').hide('slow');
     $('#welcome').fadeOut('slow', function(){
          $('#authOff').fadeIn('slow');
      });

      //show why user is not connected
      console.log('There was an error: ' + authResult['error']);

      //updating user global status
      window.userLogged = false;
    }
  });
}

//Disconnect google user account from app and revoke access token
function disconnect(){
  $.ajax({
    type: 'GET',
    url: 'https://accounts.google.com/o/oauth2/revoke?token='+gapi.auth.getToken().access_token,
    async: false,
    contentType: 'application/json',
    dataType: 'jsonp',
    success: function(result) {
      //sign-in and out buttons
      $('#disconnect').hide();
      $('#gConnect').show();

      //tmp container showing user informations
      $('#welcome').fadeOut('slow');
      $('#authOn').fadeOut('slow', function(){
          $('#authOff').fadeIn('slow');
      });

      //clear profile and circles tmp area
      $('#profile').empty();
      $('#visiblePeople').empty();

      //log message
      console.log('revoke response: ' + result);

      //updating user global status
      window.userLogged = false;
    },
    error: function(e) {
      console.log(e);
    }
  });
}

//get user profile data
function profile(){
  //requesting paramns
  var request = gapi.client.plus.people.get({'userId':'me'});

  //making data request
  request.execute(function(profile){
    //debbug log
    //console.log(profile);

    //setting global user information to be used in $scope later;
    window.userName = profile.displayName;
    window.userImg = profile.image.url;
    window.userUrl = profile.url;

    //clean profile area
    $('#profile').empty();

    //check for errors
    if (profile.error){
      $('#profile').append(profile.error);
      return;
    }

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
  });
}

//get user circles data
function people() {
  //requesting paramns
  var request = gapi.client.plus.people.list({'userId':'me', 'collection':'visible'});

  //making data request
  request.execute(function(people){
    //debbug log
    //console.log(people);

    //clean circles area
    $('#visiblePeople').empty();

    //show tmp circles information
    $('#visiblePeople').append('<h2>In your circles (<span class="count">'+people.totalItems+'</span>)</h2>');
    for (var personIndex in people.items){
      var person = people.items[personIndex];
      $('#visiblePeople').append('<img src="'+person.image.url+'">');
    }
  });
}