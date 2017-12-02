process.env.NODE_ENV = 'test';

const mongoose = require("mongoose");
const config = require('../config.json');
const weather = require("../models/weather.js");

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app.js');
const should = chai.should();
chai.use(chaiHttp);

let now_date = new Date()

let day = "";

if( (""+now_date.getUTCDate()).length < 2 ) {
	day += "0" + now_date.getUTCDate(); 
}else{
	day = ""+now_date.getUTCDate();
}


const date = now_date.getFullYear() + "-" + (now_date.getMonth() + 1) + "-" + day


describe('Empty DB, before start...', () => {
    beforeEach((done) => {
        weather.remove({}, (err) => { 
           done();         
        });     
    });

	/*
	====================( Tests for city-date api )====================
	*/

	//Positive test for city-date api
	describe('', () => {
		it('It shall GET (POSTIVE) weather in ' + config['Tests'].city + ' by ' + date , ( done ) => {
		chai.request(server)
			.get( '/api/weather_api/recieve/' + config['Tests'].city + '/' + date )
			.end((err, res) => {
				res.should.have.status(200);
				res.should.be.json;
				res.body.items.should.be.a('array');
				done();
			});
		});
	});

	//Negative test (wrong date) for city-date api
	describe('', () => {
		it('It shall GET (NEGATIVE, wrong date) weather in ' +  '/api/weather_api/recieve/' + config['Tests'].city + '/' + config['Tests'].wrong_date , ( done ) => {
		chai.request(server)
			.get( '/api/weather_api/recieve/' + config['Tests'].city + '/' + config['Tests'].wrong_date )
			.end((err, res) => {
				res.should.have.status(415);
				res.should.be.json;
				res.body.items.message.should.be.equal('Invalid date, please send string in following format: YYYY-MM-DD, also MM must be less than 12 and DD according to calendar');
				done();
			});
		});
	});

	//Negative test (wrong city) for city-date api
	describe('', () => {
		it('It shall GET (NEGATIVE, wrong city) weather in ' + config['Tests'].wrong_city  + ' ' + date , ( done ) => {
		chai.request(server)
			.get( '/api/weather_api/recieve/' + config['Tests'].wrong_city + '/' + date )
			.end((err, res) => {
				res.should.have.status(404);
				res.should.be.json;
				res.body.items.message.should.be.equal('City not found!');
				done();
			});
		});
	});

	/*
	====================( Tests for coords-date api )====================
	*/

	//Positive test for coord-date api
	describe('', () => {
		it('It shall GET (POSTIVE) weather in lat: ' + config['Tests'].lat +  ' lon: ' + config['Tests'].lon  + ' by ' + date , ( done ) => {
		chai.request(server)
			.get( '/api/weather_api/recieve/'  + config['Tests'].lat + '/' + config['Tests'].lon + '/' + date )
			.end((err, res) => {
				res.should.have.status(200);
				res.should.be.json;
				res.body.items.should.be.a('array');
				done();
			});
		});
	});

	//Negative test (wrong date) for coord-date api
	describe('', () => {
		it('It shall GET (NEGATIVE, wrong date) weather in '  + config['Tests'].lat + '/' + config['Tests'].lon + '/' + config['Tests'].wrong_date , ( done ) => {
		chai.request(server)
			.get( '/api/weather_api/recieve/' + config['Tests'].lat + '/' + config['Tests'].lon + '/' + config['Tests'].wrong_date )
			.end((err, res) => {
				res.should.have.status(415);
				res.should.be.json;
				res.body.items.message.should.be.equal('Invalid date, please send string in following format: YYYY-MM-DD, also MM must be less than 12 and DD according to calendar');
				done();
			});
		});
	});

	//Negative test (wrong coord) for coord-date api
	describe('', () => {
		it('It shall GET (NEGATIVE, wrong coords) weather in lat: ' + config['Tests'].wrong_lat + ' lon: ' + config['Tests'].wrong_lon  +  ' ' + date , ( done ) => {
		chai.request(server)
			.get( '/api/weather_api/recieve/' + config['Tests'].wrong_lat + '/' + config['Tests'].wrong_lon + '/' + date )
			.end((err, res) => {
				res.should.have.status(404);
				res.should.be.json;
				res.body.items.message.should.be.equal('Coords not found!');
				done();
			});
		});
	});
});