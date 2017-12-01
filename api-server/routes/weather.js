const express = require('express');
const router = express.Router();
const weather = require("../models/weather.js");
const weather_api = require("../middleware/weather_api.js");
const validators = require("../middleware/validators.js");

//recieving 5 days weather forecast by city name and date in format: YYYY-MM-DD
router.get('/recieve/:city/:date', async ( req, res, next ) => {
	try {

		let city = req.params.city;
		let date = validators.ValidateDate( req.params.date );
		let	res_weather = null;
		let requst_to_foreign_api = false;

		let	is_city_exist = await weather.CheckExistCityInDB( city ); 
		     

		if ( !is_city_exist ) { 
			let json = await weather_api.CityFiveDayForecastRequest( city );
			requst_to_foreign_api = true;
			await weather.CreateCity( json );
			res_weather = await weather.FindWeather( city, date );
		}else{
			res_weather = await weather.FindWeather( city, date );
			if( !res_weather ){
				let json = await  weather_api.CityFiveDayForecastRequest( city );
				requst_to_foreign_api = true;
				await weather.UpdateCityWeather( json );
				res_weather = await weather.FindWeather( city, date );
			}
		}	

		if ( !res_weather ) {
			throw {name: 'weather_unable'};
		}else{
			res.statusCode = 200;
			res.json({
				items: res_weather ,
				requst_to_foreign_api: requst_to_foreign_api
			})
		}

	} catch (err) {
		switch(err.name) {
			case "weather_unable":
				res.statusCode = 500;
				res.json({
					items: { message: "Unable to get weather" } 
				})	
				return;			
				break;
			case "invalid_date":
				res.statusCode = 415;
				res.json({
					items: { 
						message: "Invalid date, please send string in following format: YYYY-MM-DD, also MM must be less than 12 and DD according to calendar" 
					} 
				})
				return;				
				break;
			case "wrong_city":
				res.statusCode = 404;
				res.json({
					items: { 
						message: "City not found!" 
					} 
				})
				return;				
				break;								
		}
		next(err) 
	}
});

//recieving 5 days weather forecast by coordinates and date in format: YYYY-MM-DD
router.get('/recieve/:lat/:lon/:date', async ( req, res, next ) => {
	try {

		let lat = req.params.lat;
		let lon = req.params.lon;
		let date = validators.ValidateDate( req.params.date );
		let	res_weather = null;
		let requst_to_foreign_api = false;

		let json = await  weather_api.CoordFiveDayForecastRequest( lat, lon );
		let	is_city_exist = await weather.CheckExistCityInDB( json.city.name );
		requst_to_foreign_api = true;        

		if ( !is_city_exist ) { 
			let json = await  weather_api.CoordFiveDayForecastRequest( lat, lon );
			requst_to_foreign_api = true;
			await weather.CreateCoord( json );
			res_weather = await weather.FindWeather( json.city.name, date );
		}else{
			res_weather = await weather.FindWeather( json.city.name, date );
			if( !res_weather ){
				let json = await  weather_api.CoordFiveDayForecastRequest( lat, lon );
				requst_to_foreign_api = true;
				await weather.UpdateCoordWeather( json );
				res_weather = await weather.FindWeather( json.city.name, date );
			}
		}	

		if ( !res_weather ) {
			throw {name: 'weather_unable'};
		}else{
			res.statusCode = 200;
			res.json({
				items: res_weather,
				requst_to_foreign_api: requst_to_foreign_api 
			})
		}

	} catch (err) {
		switch(err.name) {
			case "weather_unable":
				res.statusCode = 500;
				res.json({
					items: { message: "Unable to get weather" } 
				})	
				return;			
				break;
			case "invalid_date":
				res.statusCode = 415;
				res.json({
					items: { 
						message: "Invalid date, please send string in following format: YYYY-MM-DD, also MM must be less than 12 and DD according to calendar" 
					} 
				})
				return;				
				break;
			case "wrong_coords":
				res.statusCode = 404;
				res.json({
					items: { 
						message: "Coords not found!" 
					} 
				})
				return;				
				break;								
		}
		next(err) 
	}
});

module.exports = router;