import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Geolocation, PermissionStatus } from '@capacitor/geolocation';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonRow,
  IonSpinner,
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
  warningOutline,
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
    IonContent,
    IonButton,
    IonSpinner,
    CommonModule
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
  locationPermissionStatus: 'granted' | 'denied' | 'prompt' | 'unknown' = 'unknown';
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private readonly apiServices: ApicallService,
    private readonly router: Router,
  ) {
    addIcons({ locationOutline, warningOutline, waterOutline, speedometerOutline, cloudOutline, eyeOutline, sunnyOutline, moonOutline });
  }

  async ngOnInit(): Promise<void> {
    try {
      this.isLoading = true;
      const permissionStatus = await this.requestPermission();

      if (permissionStatus?.location === 'granted') {
        await this.getCurrentLocationAndLoadWeather();
      } else {
        this.locationPermissionStatus = 'denied';
        this.errorMessage = 'Location permission is required for accurate weather data.';
      }
    } catch (error) {
      console.error('Initialization error:', error);
      this.errorMessage = 'Failed to initialize location services.';
    } finally {
      this.isLoading = false;
    }

  }

  async requestPermission(): Promise<PermissionStatus | null> {
    try {
      const status = await Geolocation.checkPermissions();

      if (status.location !== 'granted') {
        this.locationPermissionStatus = 'prompt';
        const permission = await Geolocation.requestPermissions();
        this.locationPermissionStatus = permission.location === 'granted' ? 'granted' : 'denied';
        return permission;
      }

      this.locationPermissionStatus = 'granted';
      return status;
    } catch (error) {
      console.error('Permission request error:', error);
      this.locationPermissionStatus = 'denied';
      return null;
    }
  }

  async getCurrentLocationAndLoadWeather(): Promise<void> {
    try {
      this.isLoading = true;
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000
      });

      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      this.locationCoords = { latitude: lat, longitude: lon };
      this.apiServices.getCityFromCoords(lat, lon)
        .pipe(
          takeUntil(this.desubscribe$),
          map((res: any) => {
            console.log(res.results[0].
              components.state_district
              , "")
            const city =
              res.results[0].
                components.state_district;

            this.location = city.toUpperCase();

            console.log(this.location, city, 'Ans');
            return res;
          }),
          catchError((error: any) => {
            this.errorMessage = 'Failed to get location name.';
            return of(null);
          })
        )
        .subscribe();

      // Load weather data
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
            this.errorMessage = 'Failed to load weather data.';
            return of(null);
          })
        )
        .subscribe();

    } catch (error) {
      console.error('Location error:', error);
      this.errorMessage = 'Failed to get your current location.';
    } finally {
      this.isLoading = false;
    }
  }


  selectDate(item: any) {
    this.apiServices.setData(item.hours);
    this.apiServices.setDate(item.datetime);
    this.navigator();
  }

  navigator(): void {
    this.router.navigate(['/time']);
  }

  toCelsius(temp: number): string {
    return temp ? ((temp - 32) * 5 / 9).toFixed(1) : '';
  }

  async retryLocation() {
    this.errorMessage = null;
    await this.ngOnInit();
  }
  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    const weekday = date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
    return `${day}/${month}/${year}(${weekday})`;

  }
  ngOnDestroy(): void {
    this.desubscribe$.next();
    this.desubscribe$.complete();
    if (this.watchId) {
      Geolocation.clearWatch({ id: this.watchId });
    }
  }
}