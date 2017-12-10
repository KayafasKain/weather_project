import { Component, OnInit } from '@angular/core';
import { WeatherApiService } from '../weather-api.service';



@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit {

	weather: any[];
	dates: any[];
	selected_date: string;
	current_city_name: string;
	error: any;
	requst_to_foreign_api: boolean;
	geolocation_permission: boolean;
	coords: any;
	spinner: {};

	constructor( private weatherApiService: WeatherApiService ) { 
		//dates array stands for storing dates, which are awaliable for forecast
			this.dates = [];
		//weather array contains weather for current day
			this.weather = [];
		//Iniciating weather city as Kiev	
			this.current_city_name = "Kiev";
		//Iniciating error-monitor variable
			this.error = { message: false };
		//These variable stands for displaying origin of data displayed on a page
			this.requst_to_foreign_api = false;
		//Variable which is checking geolocation permissions	
			this.geolocation_permission = false;
		//Coordinates, for coord search
			this.coords = [ 0, 0 ];	
		//These object is reuired to control the spinner
			this.spinner = {
				color: 'primary',
				mode: 'indeterminate',
				value: 50
			}	

		//Initiating array of dates, in order to supply user interface	
			
			for( let i = 0; i < 5; i++ ) { 
				let d = new Date();
				d.setUTCDate( d.getUTCDate() + i );
				this.dates.push( d.toISOString().slice(0, 10) );
			}

		//Set current date, as default	
			this.selected_date = this.dates[0];	
		//Recieve initial data for first tab
			this.getWeatherByCity( this.current_city_name );
		//Checking geolocation permissions
			this.checkGeoLocation();

	}

// tabChanget function need to react on swtichig different tabs	
	tabChanged( tab_object ) {
		this.selected_date = this.dates[tab_object.index];
		this.getWeatherByCity( this.current_city_name );
	}

// getWeatherByCity function makes request to server in order to recieve weather by city name and date
	getWeatherByCity( name ) {
		this.weather = [];
		this.weatherApiService.getWeatherCity( name, this.selected_date )
			.then((res:any) => {
				this.weather = res.items;

				this.requst_to_foreign_api = res.requst_to_foreign_api;
				this.coords = [ res.city.coord.lat, res.city.coord.lon ];
				this.error.message = false;
				this.changeDisplayDate( this.weather );
		}).catch((err:any) => {
			let temp =  JSON.parse(err._body)
			this.error.message = temp.items.message;
			this.weather = [];
		});
	}


//checking geolocation permissions
	checkGeoLocation(){

		this.getPreciseLocation().then(( coords ) => {
			this.geolocation_permission = true;
			console.log("true========");
		}).catch((err:any) => {
			this.geolocation_permission = false;
			console.log("false=========");
		});

		console.log(this.geolocation_permission);

	}

//get current coordinates
	getPreciseLocation() {
		return new Promise(function (resolve, reject) {
			navigator.geolocation.getCurrentPosition(function (position) {
				resolve([position.coords.latitude, position.coords.longitude]);
			});
		});
	}

//get weather by coordinates lat and lon 
	 	getWeatherByCoords() {
		this.checkGeoLocation();

		this.getPreciseLocation().then(( coords ) => {

			this.weather = [];
			this.weatherApiService.getWeatherCoords( this.coords[0], this.coords[1], this.selected_date )
				.then((res:any) => {
					this.weather = res.items;

					this.requst_to_foreign_api = res.requst_to_foreign_api;
					this.current_city_name = res.city.name;
					this.coords = [ res.city.coord.lat, res.city.coord.lon ];

					this.error.message = false;
					this.changeDisplayDate( this.weather );
			}).catch((err:any) => {
				let temp =  JSON.parse(err._body)
				this.error.message = temp.items.message;
				this.weather = [];
				this.getWeatherByCity( this.current_city_name );
			});
		});

	}


// Changing display date by removing date, and leaving time
	changeDisplayDate( weather_array ) {
		for(let i = 0; i < weather_array.length; i++ ){
			weather_array[i].dt_txt = weather_array[i].dt_txt.match(/\s([0-9]+:[0-9]+:[0-9]+)/)[0];
		}
		this.weather = weather_array;
	}	

	ngOnInit() {
		this.current_city_name = "Kiev";
	}

}
