import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatCheckboxModule } from '@angular/material';
import { MatFormFieldModule, MatNativeDateModule } from '@angular/material';
import { MatInputModule } from '@angular/material';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTabsModule } from '@angular/material/tabs';
import { MatGridListModule } from '@angular/material/grid-list';
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
    BrowserAnimationsModule,
    NoopAnimationsModule,
    MatFormFieldModule,
    MatButtonModule, 
    MatNativeDateModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatGridListModule,
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
