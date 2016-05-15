
//express setup
var express = require('express');
var app = express();
var path = require('path');
module.exports = app;

//node https requried to make requests to the api 
var https = require('https');

//DB setup. Need tp romisify to add multiple documents asynchronously 
var models = require('../db');
var mongoose = require('mongoose');
var Promise = require('bluebird');
var Airport = Promise.promisifyAll(models.Airport);


//get path of root, indexfile, public folder, node modules, bower componets, and front-end files 
var rootPath = path.join(__dirname, '../../');
var indexPath = path.join(rootPath, './server/views/index.html');
var publicPath = path.join(rootPath, './public');
var npmPath = path.join(rootPath, './node_modules');
var bowerPath = path.join(rootPath, './bower_components');
var browserPath = path.join(rootPath, './browser');

//statically serve up all the files 
app.use(express.static(publicPath));
app.use(express.static(npmPath));
app.use(express.static(browserPath));
app.use(express.static(bowerPath));


//************************************************************************************************************************************//
//BEGINNING OF NODE HTTPS REQUEST FROM API//

//when app is started, all the airports are fetched from API and stored to DB 
https.get("https://airport.api.aero/airport?user_key=9a914e1c977ec018ca059bcf6462a9a6", function(res) {
    var response = "";

    res.setEncoding('utf8');

    //response comes in chunks, need to store it as one string 
    res.on('data', function(d) {
        response += d;

    });

    //the response ends 
    res.on('end', function() {
        //the response needs some string manipulation to convert into JSON string
        response = response.replace("callback(", "");
        response = response.substring(0, response.length - 1);

        //convert into JSON string into JSON
        var airportObj = JSON.parse(response);

        //Filter out non-US airports
        var airportArrUS = filter_US(airportObj.airports);

        //clear DB to avoid duplicates 
        removeAirports();

        //seed airports aysnchronously 
        seedAirports(airportArrUS);

        console.log("End received!");
    });

}).on('error', function(e) {
    console.error('this is the error', e);
});

//helper functions to filter out US airports, clear the DB, and seed the DB
function filter_US(arrAirport) {
    var filteredArr = arrAirport.filter(function(airport){
    	return airport.country === "United States";
    })
   return filteredArr;
}

function removeAirports(){
	var removeUsers = Airport.remove({});
    return Promise.all([
        removeUsers
    ]);
}

function seedAirports(airportArr) {
	return Airport.createAsync(airportArr);
}

//END of requesting data from api and storing to DB
//************************************************************************************************************************************//



//Beginning of Express functionality 
//Express middleware
app.use(function(req, res, next) {
    console.log('Request Type:', req.method);
    next();
});


//main view of app 
app.get('/', function(req, res) {
    res.sendFile(indexPath);
});

//returns all the airports from the DB
app.get('/api/airports',function(req,res,next){
	Airport.find({})
		.then(function(airports){
			res.send(airports);
		})
		.then(next,null)
})


app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});

// Error catching endware
app.use(function(err, req, res, next) {
    console.error(err)
    console.error(err.stack);
    res.status(err.status || 500).send(err.message || 'Internal server error.');
});