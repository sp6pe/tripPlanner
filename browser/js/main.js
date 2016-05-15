 'use strict'

//instantiate angular app 
 var app = angular.module('airportDistance', ['mgcrea.ngStrap', 'ngAnimate']);

 //gets all the airport information from the db 
 app.factory('AirportFactory', function($http) {

     var AirportFactory = {};

     AirportFactory.fetchAll = function() {
         return $http.get('/api/airports')
             .then(function(response) {

                 return response.data;
             });
     };

     return AirportFactory;

 });




 


