import { Component } from '@angular/core';
import {  ViewChild, ElementRef, NgZone } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Geofence } from '@ionic-native/geofence/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { v4 } from 'uuid'
//import {HttpClient} from ''

import {  OnInit } from '@angular/core';
import { MapsAPILoader,MouseEvent } from '@agm/core';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  title: string = 'AGM project';
  latitude: number;
  longitude: number;
  zoom: number;
  address: string;
  center = {
    lat: '1.2741007',
    lng: '103.84227420000002',
  };
  
  private geoCoder;
  @ViewChild('search', {static : false})
   public searchElementRef: ElementRef;

  constructor(private mapsAPILoader: MapsAPILoader,
    private http : HttpClient,
    private geofence : Geofence,
    private geolocation: Geolocation,
    private ngZone: NgZone) {
      this.mapsAPILoader.load().then(() => {
        console.log("Within maps");
        this.setCurrentLocation();
        this.pingLocation({ 'location': { lat: this.latitude, lng: this.longitude }});
        this.createGeofence()
        const watch = this.geolocation.watchPosition();



        this.geoCoder = new google.maps.Geocoder;
   
        let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
          types: ["address"]
        });
        autocomplete.addListener("place_changed", () => {
          this.ngZone.run(() => {
            //get the place result
            let place: google.maps.places.PlaceResult = autocomplete.getPlace();
   
            //verify result
            if (place.geometry === undefined || place.geometry === null) {
              return;
            }
   
            //set latitude, longitude and zoom
            this.latitude = place.geometry.location.lat();
            this.longitude = place.geometry.location.lng();
            this.zoom = 12;
          });
        });
      });

    }

    private createGeofence() {
      let fence = {
        id: v4('12345667777'), //any unique ID
        latitude : '1.2741007', 
        longitude : '103.84227420000002',        
        radius: 1000, //radius to edge of geofence in meters
        transitionType: 2,
      };
      this.geofence
        .addOrUpdate(fence)
        .then(
          () => console.log('Geofence added'),
          (err) => console.log('Geofence failed to add', err)
        );
      this.geofence.onTransitionReceived().subscribe((res) => {
        this.notify(this.center);
      });
    }

    notify(location) {
      console.log("within notify"+location)
      this.http
        .post('http://localhost:4000/notify', location)
        .subscribe((res) => {});
    } 
    // Get Current Location Coordinates
  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 8;
        this.getAddress(this.latitude, this.longitude);
      });
    }
  }
 
 
  markerDragEnd($event: MouseEvent) {
    console.log($event);
    this.latitude = $event.coords.lat;
    this.longitude = $event.coords.lng;
    this.getAddress(this.latitude, this.longitude);
  }
 
  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      console.log(results);
      console.log(status);
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          this.address = results[0].formatted_address;
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
 
    });
  }

  pingLocation(location) {
    this.http.post('http://localhost:4000/ping', location)
      .subscribe((res) => {});
  }


}
