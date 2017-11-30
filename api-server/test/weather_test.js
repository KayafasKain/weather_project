process.env.NODE_ENV = 'test';

const mongoose = require("mongoose");
const config = require('../config.json');

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app.js');
const should = chai.should();
chai.use(chaiHttp);

var now_date = new Date()
const date = now_date.getFullYear() + "-" + (now_date.getMonth() + 1) + "-" + now_date.getDate()


describe('/GET (POSTIVE) weather in ' + config['Tests'].city + ' ' + date + '', () => {
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

describe('/GET (NEGATIVE, wrong date) weather in ' + config['Tests'].city + ' ' + config['Tests'].wrong_date + '', () => {
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

describe('/GET (NEGATIVE, wrong city) weather in ' + config['Tests'].wrong_city + ' ' + date + '', () => {
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

