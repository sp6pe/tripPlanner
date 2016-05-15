
//chai expect testing library 
var expect = require('chai').expect;

//requirements foe testing models
var mongoose = require('mongoose');

require('../server/db');
var Airport = mongoose.model('Airport');

//make connection to a test DB
var dbURI = 'mongodb://localhost:27017/airportTest';
var clearDB = require('mocha-mongoose')(dbURI);

//requirement for testing routes 
var supertest = require('supertest');
var app = require('../server/app/app.js');
var agent = supertest.agent(app);



describe('Airport', function () {

    beforeEach('Establish DB connection', function (done) {
        if (mongoose.connection.db) return done();
        mongoose.connect(dbURI, done);
        console.log(dbURI);
    });

    afterEach('Clear test database', function (done) {
        clearDB(done);
    });

    it('should exist', function () {
        expect(Airport).to.be.a('function');
    });

    describe('Airport', function() {
      var airport;


      it('is created and has code, name, and country', function(done) {
        var airport = new Airport({
          code: 'BWI',
          name: 'Baltimore',
          country: 'United Sates'
        });

        airport.save().then(function(savedAirport) {
          expect(savedAirport.code).to.equal('BWI');
          expect(savedAirport.name).to.equal('Baltimore');
          expect(savedAirport.country).to.equal('United Sates');
          done();
        })
        .then(null, done);
      });

    });

    describe('Airport Route', function(){

      xit ('should find no airports', function(done) {
			agent
				.get('/api/airports')
				.expect('Content-Type', /json/)
                .expect(200)
                .expect(function (res) {
                   // res.body is the JSON return object
                   expect(res.body).to.be.an.instanceOf(Array);
                   expect(res.body).to.have.length(0);
                })
                .end(done);
		})

         xit('should find and return airport', function (done) {

             var airport = new Airport({
		          code: 'DCA',
		          name: 'DC',
		          country: 'United Sates'
		        });

           	airport.save().then(function () {

               	agent
                   	.get('/api/aiports')
                   	.expect(200)
                   	.expect(function (res) {
                       	expect(res.body).to.be.an.instanceOf(Array);
                       	expect(res.body[0].code).to.equal('DCA');
                       	expect(res.body[0].name).to.equal('DC');
                       	expect(res.body).to.have.length(1);

                   	})
                   	.end(done);

           	}).then(null, done);

       	});

    })

});

