
const express = require('express');
const config = require('../config.json');
const fetch = require("node-fetch");

//These function stands for recieving json from api.openweathermap.org, by using city name as main parameter
module.exports.CityFiveDayForecastRequest = async ( city ) => {
	const city_url =  "api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid="+ config['Security'].appid + "&units=" + config['API_settings'].units;
	const response = await fetch("http://" + city_url );
	const json = await response.json();
	if( json.cod != 200 ){
		throw { name: 'wrong_city'};
	}

	if( !json ){
		return false;
	}else{
		return json;
	}

}

//These function stands for recieving json from api.openweathermap.org, by using lat and lon name as main parameters
module.exports.CoordFiveDayForecastRequest = async ( lat, lon ) => {
	const coord_url =  "api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid="+ config['Security'].appid + "&units=" + config['API_settings'].units;
	const response = await fetch("http://" + coord_url );
	const json = await response.json();

	if( json.cod != 200 || !json ){
		throw { name: 'wrong_coords'};
	}

	if( !json ){
		return false;
	}else{
		return json;
	}

}

