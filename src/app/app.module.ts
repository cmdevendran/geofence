import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';


import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {AgmCoreModule} from '@agm/core';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';

//import {Geolocation} from '@ionic-native/geolocation';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import {Geofence} from '@ionic-native/geofence/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, 
    HttpClientModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDw75EM8_xI-smSgmzn0iX89rSNNFtaNQM',
      
      libraries: ['places']}),
      IonicModule.forRoot(), AppRoutingModule],
  providers: [
    StatusBar,
   // Geolocation,
    
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    HttpClient,
    AndroidPermissions,
    LocationAccuracy,
    Geolocation,
    Geofence
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
