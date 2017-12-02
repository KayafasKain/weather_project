import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { InterceptorService } from 'ng2-interceptors';

@Injectable()
export class WeatherApiService {

  constructor( private http: InterceptorService ) { }

	getWeatherCity( city, date ) {
		return this.http.get('/api/weather_api/recieve/' + city + '/' + date + '')
		.toPromise()
		.then((res:Response) => {
			return res.json();
		})
	}

	getWeatherCoords( lat, lon, date ) {
		return this.http.get('/api/weather_api/recieve/' + lat + '/' + lon + '/' + date + '')
		.toPromise()
		.then((res:Response) => {
			return res.json();
		})
	}	

}
