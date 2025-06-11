import { Component, CUSTOM_ELEMENTS_SCHEMA, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Geolocation } from '@capacitor/geolocation';
import {
  IonCard,
  IonCardContent,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonRow,
  IonText
} from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import {
  cloudOutline,
  eyeOutline,
  locationOutline,
  moonOutline,
  speedometerOutline,
  sunnyOutline,
  waterOutline
} from 'ionicons/icons';
import { catchError, map, of, Subject, takeUntil } from 'rxjs';
import { register } from 'swiper/element/bundle';
import { ApicallService } from '../apicall.service';

register();

@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.css'],
  standalone: true,
  imports: [
    IonCardContent,
    IonCard,
    IonText,
    IonCol,
    IonRow,
    IonGrid,
    IonIcon,
    IonContent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MainpageComponent implements OnInit, OnDestroy {
  private desubscribe$ = new Subject<void>();
  currentData: any;
  daysData: any;
  date = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  locationCoords: { latitude: number; longitude: number } | null = null;
  watchId: string | null = null;
  location: string = '';

  constructor(
    private readonly apiServices: ApicallService,
    private readonly router: Router
  ) {
    addIcons({
      waterOutline,
      speedometerOutline,
      cloudOutline,
      eyeOutline,
      sunnyOutline,
      moonOutline,
      locationOutline
    });
  }
  ngOnInit(): void {
    this.requestPermission(); // ask for permission
    this.getCurrentLocationAndLoadWeather(); // get location then call API
  }


  async requestPermission() {
    const permission = await Geolocation.requestPermissions();
    console.log('Permission result:', permission);
    if (permission.location === 'granted') {
      this.startWatchingLocation();
    }
  }

  async getCurrentLocationAndLoadWeather() {
    try {
      const position = await Geolocation.getCurrentPosition();

      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      this.locationCoords = { latitude: lat, longitude: lon };
      this.apiServices.getCityFromCoords(lat, lon)
        .pipe(
          takeUntil(this.desubscribe$),
          map((res: any) => {
            this.location = res.address.state_district;
            return res;
          }),
          catchError((error: any) => {
            console.error('Weather API error:', error);
            return of(null);
          })
        )
        .subscribe((data: any) => {
          if (!data) {
            console.log('No data received from weather API.');
          }
        });

      this.apiServices.getApiReport(lat, lon)
        .pipe(
          takeUntil(this.desubscribe$),
          map((res: any) => {
            this.currentData = res.currentConditions;
            this.daysData = res.days;
            return res;
          }),
          catchError((error) => {
            console.error('Weather API error:', error);
            return of(null);
          })
        )
        .subscribe((data: any) => {
          if (!data) {
            console.log('No data received from weather API.');
          }
        });

    } catch (error) {
      console.error('Location error:', error);
    }
  }


  startWatchingLocation() {
    Geolocation.watchPosition(
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
      (position, err) => {
        if (err) {
          console.error('Location error:', err);
          return;
        }

        if (position) {
          this.locationCoords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          console.log('Live Location:', this.locationCoords);
        }
      }
    );
  }

  selectDate(item: any) {
    localStorage.setItem("hours", JSON.stringify(item.hours));
    localStorage.setItem("date", JSON.stringify(item.datetime));
    this.navigator();
  }

  navigator(): void {
    this.router.navigate(['/time']);
  }

  toCelsius(temp: number): string {
    return temp ? ((temp - 32) * 5 / 9).toFixed(1) : '';
  }

  ngOnDestroy(): void {
    this.desubscribe$.next();
    this.desubscribe$.complete();
    if (this.watchId) {
      Geolocation.clearWatch({ id: this.watchId });
    }
  }
}
