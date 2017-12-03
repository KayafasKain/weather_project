const express = require('express');
const router = express.Router();
const weather = require("../models/weather.js");
const weather_api = require("../middleware/weather_api.js");
const validators = require("../middleware/validators.js");

//recieving 5 days weather forecast by city name and date in format: YYYY-MM-DD
router.get('/recieve/:city/:date', async ( req, res, next ) => {
	try {

		let city = req.params.city;
		//validating provided date
		let date = validators.ValidateDate( req.params.date );
		//these variable stands for storing server response and validating some issues
		let	res_weather = null;
		//these variable stands for representing data origin: was it taken directly from foreign API, or from local DB
		let requst_to_foreign_api = false;
		//checking if city exist in our DB
		let	is_city_exist = await weather.CheckExistCityInDB( city ); 
		     

		if ( !is_city_exist ) { 
			//If city NOT exist we making request to weather API and creating record in our DB
			let json = await weather_api.CityFiveDayForecastRequest( city );
			requst_to_foreign_api = true;
			await weather.CreateCity( json );
			//Finding weather in our DB
			res_weather = await weather.FindWeather( city, date );
		}else{
			//Finding weather in our DB
			res_weather = await weather.FindWeather( city, date );
			if( !res_weather ){
				//If weather for provided date not found, we making request to weather API
				let json = await  weather_api.CityFiveDayForecastRequest( city );
				requst_to_foreign_api = true;
				//Updating our database
				await weather.UpdateCityWeather( json );
				//Finding weather in our DB
				res_weather = await weather.FindWeather( city, date );
			}
		}	

		if ( !res_weather ) {
			throw {name: 'weather_unable'};
		}else{
			res.statusCode = 200;
			res.json({
				items: res_weather.list,
				city: res_weather.city,
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

		let city = "";
		let lat = req.params.lat;
		let lon = req.params.lon;
		//validating provided date
		let date = validators.ValidateDate( req.params.date );
		//these variable stands for storing server response and validating some issues
		let	res_weather = null;
		//these variable stands for representing data origin: was it taken directly from foreign API, or from local DB
		let requst_to_foreign_api = false;

		//finding city name by provided coordinates
		let json = await  weather_api.CoordFiveDayForecastRequest( lat, lon );
		//checking if city exist in our DB
		let	is_city_exist = await weather.CheckExistCityInDB( json.city.name );
		city = json.city.name;
		requst_to_foreign_api = true;        

		if ( !is_city_exist ) { 
			//If city NOT exist we making request to weather API and creating record in our DB
			let json = await  weather_api.CoordFiveDayForecastRequest( lat, lon );
			requst_to_foreign_api = true;
			await weather.CreateCoord( json );
			//Finding weather in our DB
			res_weather = await weather.FindWeather( json.city.name, date );
		}else{
			//Finding weather in our DB
			res_weather = await weather.FindWeather( json.city.name, date );
			if( !res_weather ){
				//If city NOT exist we making request to weather API and creating record in our DB
				let json = await  weather_api.CoordFiveDayForecastRequest( lat, lon );
				requst_to_foreign_api = true;
				//Updating our database
				await weather.UpdateCoordWeather( json );
				//Finding weather in our DB
				res_weather = await weather.FindWeather( json.city.name, date );
			}
		}	

		if ( !res_weather ) {
			throw {name: 'weather_unable'};
		}else{
			res.statusCode = 200;
			res.json({
				items: res_weather.list,
				city: res_weather.city,
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