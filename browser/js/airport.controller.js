app.controller('airportCtrl', function($scope, AirportFactory) {

    //boolean for show/hiding travel distance and time 
 	$scope.showtrip = false;


    //need access to the variables in multiple functions 
     var directionsService = new google.maps.DirectionsService;
     var directionsDisplay = new google.maps.DirectionsRenderer;

     //from google maps api docs 
     function initMap() {
         var map = new google.maps.Map(document.getElementById('map-canvas'), {
             zoom: 4,
             center: { lat: 40.705189, lng: -100.009209 },
             styles: [{
                stylers: [
                    { hue: "#c1b5ad" },
                    { saturation: -20 }
                ]
            }, {
                featureType: "road",
                elementType: "geometry",
                stylers: [
                    { lightness: 100 },
                    { visibility: "simplified" }
                ]
            }, {
                featureType: "road",
                elementType: "labels",
                stylers: [
                    { visibility: "off" }
                ]
            }]
         });
         directionsDisplay.setMap(map);
     }
     
     initMap(); // intialize the map 

     //get all airports from factory, and set to scope 
     AirportFactory.fetchAll()
         .then(function(airports) {
             $scope.airports = airports;
             //add column to array of results to display airport name and code 
             $scope.airports.forEach(function(el) {
                 el["displayName"] = el.name + ' (' + el.code + ')'
             })
         })

     //calculates and plots routes when submit button is clicked 
     $scope.submittedAirports = function() {

   		calculateAndDisplayRoute($scope.selectedAirportOne, $scope.selectedAirportTwo);

     }

     function calculateAndDisplayRoute(aiportOne, airportTwo) {
 		 var start = new google.maps.LatLng(aiportOne.lat, aiportOne.lng);
         var end = new google.maps.LatLng(airportTwo.lat, airportTwo.lng);

         //callback function from google maps api docs
         directionsService.route({
             origin: start,
             destination: end,
             travelMode: google.maps.TravelMode.DRIVING
         }, function(response, status) {
            //if directions exist 
             if (status === google.maps.DirectionsStatus.OK) {
                // set response to scope
             	$scope.response = response; 
                // change display boolean to true
             	$scope.showtrip = true; 
                // need to manually digest scope
             	$scope.$digest(); 
                //put markers on map and display route, from google maps api docs 
                directionsDisplay.setDirections(response); 
             } else {//error handling 
                 window.alert("There are no driving directions between these airports"); 
             }
         });
     }




 });

