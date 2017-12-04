const mongoose     = require('mongoose');
const Schema       = mongoose.Schema;

var weather   = new Schema({
	city: {
		name: String,
		coord: {
			lat: Number,
			lon: Number
		},
		list: [
			{  
				dt: Number,
				main: {  
					temp: Number,
					temp_min: Number,
					temp_max: Number,
					pressure: Number,
					sea_level: Number,
					grnd_level: Number,
					humidity: Number,
					temp_kf: Number
				},
				weather: [  
					{  
						id: Number,
						main: String,
						description: String,
						icon: String
					}
				],
				clouds: {  
					all: Number
				},
				wind: {  
					speed: Number,
					deg: Number
				},
				sys: {  
					pod: String
				},
				dt_txt: String
			}
		]		
	}

},
{ 
	collection: 'weather' 
});
weather.index({"city.name": 1}, {unique: true});
var Weather = module.exports = mongoose.model('weather', weather);


//These function help us to avoid duplicating cities and not nessesery API requests
module.exports.CheckExistCityInDB = async ( name ) => {

	let city = await Weather.findOne({ 
			"city.name": name 
	});
	if( city ){
		return true;
	}else{
		return false;
	}
}

//These function help us to avoid duplicating cities (by coordinates) and not nessesery API requests
module.exports.CheckExistCoordInDB = async ( lat, lon ) => {

	let city = await Weather.findOne({ 
			"city.coord.lat": lat,
			"city.coord.lon": lon 
	});

	if( city ){
		return true;
	}else{
		return false;
	}
}

//These function is creating city record in DB, if nessesery
module.exports.CreateCity = async ( json ) => {

	save_object = 	{
						city: {
							name: json.city.name,
							coord: json.city.coord,
							list: json.list
						}
					}	

	weather_obj = new Weather( save_object );	

	await weather_obj.save();
}

//These function is creating city( by coord ) record in DB, if nessesery
module.exports.CreateCoord = async( json ) => {

	save_object = 	{
						city: {
							name: json.city.name,
							coord: json.city.coord,
							list: json.list
						}
					}	



	weather_obj = new Weather( save_object );	

	await weather_obj.save();
}

//These function is updating list of weather for particular city, if new data is avaliable
module.exports.UpdateCityWeather = async ( json ) => {

	let up_to_date = await Weather.findOne({ "city.name": json.city.name });

	let old_date = up_to_date.city.list[0].dt_txt.match(/^([0-9]+)-([0-9]+)-([0-9]+)/)
	let new_date = json.list[0].dt_txt.match(/^([0-9]+)-([0-9]+)-([0-9]+)/)

	if(
			old_date[0] < new_date[0]   ||
			old_date[1] < new_date[1]   ||
			( 
				old_date[1] == new_date[1] &&
				old_date[2] < new_date[2] 
			) 
		){

		await Weather.update({ "city.name": json.city.name }, { $set: { "city.list": json.list }});
	}	
}  

//These function is updating list of weather for particular coordinates, if new data is avaliable
module.exports.UpdateCoordWeather = async ( json ) => {

	let up_to_date = await Weather.findOne({ 
		"city.coord.lat": json.city.coord.lat,
		"city.coord.lon": json.city.coord.lon  
	});

	let old_date = up_to_date.city.list[0].dt_txt.match(/^([0-9]+)-([0-9]+)-([0-9]+)/)
	let new_date = json.list[0].dt_txt.match(/^([0-9]+)-([0-9]+)-([0-9]+)/)

	if(
			old_date[0] < new_date[0]   ||
			old_date[1] < new_date[1]   ||
			( 
				old_date[1] == new_date[1] &&
				old_date[2] < new_date[2] 
			) 
		){

		await Weather.update({ 
			"city.coord.lat": json.city.coord.lat,
			"city.coord.lon": json.city.coord.lon 
		}, 
		{ $set: 
			{ "city.list": json.list }
		});
	}	
} 

//These function is searching for weather by city name, retunrs array of weather for specified date
module.exports.FindWeather = async ( name, date ) => {  
	
	let city_object = await Weather.findOne({ 
			"city.name": name 
	});

	let aggregate = await Weather.aggregate([
		{ "$match": { "city.name": name } },
		{ "$project": { 
			"city.list": { 
					"$filter": { 
						"input": "$city.list", 
						"as": "obj", 
						"cond": { 
							$eq: [ { "$substr": [ "$$obj.dt_txt", 0, 10 ] } , date ] 
								
					}
				}
			}
		}}
	]);

	if( !aggregate[0] ){
		
		throw { name: 'wrong_city'};
	}

	if( aggregate[0].city.list.length == 0){
		return false;
	}else{
		return {
			list: aggregate[0].city.list,
			city: {
				name: city_object.city.name,
				coord: city_object.city.coord
			}
		}
	}

}

//These function is searching for weather by city coordinates, retunrs array of weather for specified date
module.exports.FindCoordWeather = async ( lat, lon, date ) => {  

	let city_object = await Weather.findOne({ 
			"city.coord.lat": lat,
			"city.coord.lon": lon 
	});

	console.log("==================================");
	console.log(city_object);

	let aggregate = await Weather.aggregate([
		{ "$match": { 
			"city.coord.lat": lat,
			"city.coord.lon": lon 
		} },
		{ "$project": { 
			"city.list": { 
					"$filter": { 
						"input": "$city.list", 
						"as": "obj", 
						"cond": { 
							$eq: [ { "$substr": [ "$$obj.dt_txt", 0, 10 ] } , date ] 
								
					}
				}
			}
		}}
	]);
	
	if( !aggregate[0] ){
		throw { name: 'wrong_coords'};
	}

	if( aggregate[0].city.list.length == 0){
		return false;
	}else{
		return {
			list: aggregate[0].city.list,
			city: {
				name: city_object.city.name,
				coord: city_object.city.coord
			}
		}
	}

}
