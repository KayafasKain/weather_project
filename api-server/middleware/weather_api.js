
const express = require('express');
const config = require('../config.json');
var fetch = require("node-fetch");


module.exports.CityFiveDayForecastRequest = async ( city ) => {
	const city_url =  "api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid="+ config['security'].appid;
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

module.exports.CoordFiveDayForecastRequest = async ( lat, lon ) => {
	const coord_url =  "api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid="+ config['security'].appid;
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

