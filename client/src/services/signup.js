angular.module('nibblr')

.service('signUp', function($http){
  // TODO

  this.postRSVP = function(body, callback) {
    $http({
    url: 'http://localhost:3000/rsvp?',
    method: 'POST',
    dataType: 'json',
    data: body, // all that will be needed is {event_id: event_id}
    }).then(function successCallback(response) {
      if (callback) {
        callback(response);
      }
    }, function errorCallback(response) {
      console.log('=( error')
    });
  }

});