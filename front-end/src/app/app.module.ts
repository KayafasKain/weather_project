import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { InterceptorService } from 'ng2-interceptors';
import { XHRBackend, RequestOptions } from '@angular/http';
import { ServerURLInterceptor } from './ServerURLInterceptor';
import { HttpModule } from '@angular/http';
import { WeatherApiService } from './weather-api.service';
import { FormsModule } from '@angular/forms';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { WeatherComponent } from './weather/weather.component';

export function interceptorFactory(xhrBackend: XHRBackend, requestOptions: RequestOptions, serverURLInterceptor:ServerURLInterceptor){
  let service = new InterceptorService(xhrBackend, requestOptions);
  service.addInterceptor(serverURLInterceptor);
  return service;
}


@NgModule({
  declarations: [
    AppComponent,
    WeatherComponent
  ],
  imports: [

    BrowserModule,
    MatInputModule,
    MatProgressSpinnerModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    MatFormFieldModule,
    MatButtonModule, 
    MatTabsModule,
    FormsModule,
    HttpModule
  ],
  providers: [
  	ServerURLInterceptor,
  	{ 
  		provide: InterceptorService,
  		useFactory: interceptorFactory,
  		deps: [XHRBackend, RequestOptions, ServerURLInterceptor]
  	},
  	WeatherApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
