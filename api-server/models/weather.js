var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

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
var Weather = module.exports = mongoose.model('weather', weather);


module.exports.CheckExistCityInDB = async ( name ) => {

	let town = await Weather.findOne({ 
			"city.name": name 
	});
	if( town ){
		return true;
	}else{
		return false;
	}
}

module.exports.CheckExistCoordInDB = async ( lat, lon ) => {

	let town = await Weather.findOne({ 
			"city.coord.lat": lat,
			"city.coord.lon": lon 
	});

	if( town ){
		return true;
	}else{
		return false;
	}
}

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

module.exports.FindWeather = async ( name, date ) => {  

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
		return aggregate[0].city.list;
	}

}

module.exports.FindCoordWeather = async ( lat, lon, date ) => {  

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
		return aggregate[0].city.list;
	}

}
