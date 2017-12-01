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

	constructor( private weatherApiService: WeatherApiService ) { 
		//dates array stands for storing dates, which are awaliable for forecast
			this.dates = [];
		//weather array contains weather for current day
			this.weather = [];
		//Iniciating weather city as Kiev	
			this.current_city_name = "Kiev"

		//Initiating array of dates, in order to supply user interface
			let now_date = new Date();	
			let myDate = new Date(now_date.getFullYear(),(now_date.getMonth()),now_date.getDate(),0,0,0);		
			for( let i = 0; i < 5; i++ ) { 

				let newDate = new Date(myDate.getTime() + 1000 * 60 * 60 * (24 * (i+1)));
				let day = "";

				if( (""+newDate.getUTCDate()).length < 2 ) {
					day += "0" + newDate.getUTCDate(); 
				}else{
					day = ""+newDate.getUTCDate();
				}

				this.dates.push(newDate.getFullYear() + "-" + (newDate.getUTCMonth()+1) + "-" + day);
			}

		//Set current date, as default	
			this.selected_date = this.dates[0];	
		//Recieve initial data for first tab
			this.getWeatherByCity( this.current_city_name );

	}

// tabChanget function need to react on swtichig different tabs	
	tabChanged( tab_object ) {
		this.selected_date = this.dates[tab_object.index];
		this.getWeatherByCity( this.current_city_name );
	}

// getWeatherByCity function makes request to server in order to recieve weather by city name and date
	getWeatherByCity( name ) {

		this.weatherApiService.getWeatherCity( name, this.selected_date )
			.then((res:any) => {
		this.weather = res.items;
		this.changeDisplayDate( this.weather );
		}).catch((err:any) => {
			console.log(err);
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
		this.current_city_name = "Kiev"
	}

}
