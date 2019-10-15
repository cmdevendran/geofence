import { Component } from '@angular/core';
import {  ViewChild, ElementRef, NgZone } from '@angular/core';
import { Platform } from '@ionic/angular'

import {  OnInit } from '@angular/core';
import { MapsAPILoader,MouseEvent } from '@agm/core';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';




@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit{
  title: string = 'AGM project';
  latitude: number;
  longitude: number;
  zoom: number;
  address: string;
  private geoCoder;

  @ViewChild('search', {static : false})
   public searchElementRef: ElementRef;
 
  constructor( private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private androidPermissions: AndroidPermissions,
    private plt : Platform) {}


 
  ngOnInit() {
    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {

      if(this.plt.ready().then((readySource) => {
        this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
          result => console.log('Has permission?',result.hasPermission),
          err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
        );
        
        this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION]);
        console.log("Platform ready", readySource);
        this.setCurrentLocation();

      }))
      
      //this.setCurrentLocation();
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

}
