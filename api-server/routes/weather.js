const express = require('express');
const router = express.Router();
const weather = require("../models/weather.js");
const weather_api = require("../middleware/weather_api.js");


// five days weather, by city name and date( NOTICE: date given in number format, like: 86400000)
router.get('/recieve/:city/:date', async ( req, res, next ) => {
	try {

		let city = req.params.city;
		let date = req.params.date;
		let	res_weather = null;

		let	is_city_exist = await weather.CheckExistCity( city );        

		if ( !is_city_exist ) { 
			let json = await  weather_api.FiveDayForecastRequest( city );
			await weather.CreateCity( json );
			res_weather = await weather.FindWeather( city, date );
		}else{
			res_weather = await weather.FindWeather( city, date );
			console.log("res_weather == true");
			if( !res_weather ){
				console.log("res_weather == false");
				let json = await  weather_api.FiveDayForecastRequest( city );
				await weather.UpdateCityWeather( json );
				res_weather = await weather.FindWeather( city, date );
			}
		}	

		console.log("res_weather");
		console.log(res_weather);


		if ( !res_weather ) {
			throw {name: 'weather_unable'};
		}else{
			res.json({
				status: 200,
				body: res_weather 
			})
		}

	} catch (err) {
		switch(err.name) {
			case "weather_unable":
				res.json({
					status: 500,
					body: { message: 'Unable to get weather' } 
				})				
				break;
		}
		next(err) 
	}
});
 

module.exports = router;