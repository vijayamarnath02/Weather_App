import { Component, CUSTOM_ELEMENTS_SCHEMA, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonCard, IonCardContent, IonCol, IonContent, IonGrid, IonIcon, IonRow, IonText } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { cloudOutline, eyeOutline, locationOutline, moonOutline, speedometerOutline, sunnyOutline, waterOutline } from 'ionicons/icons';
import { catchError, map, of, Subject, takeUntil } from 'rxjs';
import { register } from 'swiper/element/bundle';
import { ApicallService } from '../apicall.service';

register();
@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.css'],
  standalone: true,
  imports: [IonCardContent, IonCard, IonText, IonCol, IonRow, IonGrid, IonIcon, IonContent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MainpageComponent implements OnInit, OnDestroy {
  private desubscribe$ = new Subject<void>();
  currentData: any;
  daysData: any;
  date = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',   // or 'long' for full month name
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
  constructor(private readonly apiServices: ApicallService, private readonly router: Router) {
    addIcons({ waterOutline, speedometerOutline, cloudOutline, eyeOutline, sunnyOutline, moonOutline, locationOutline });
  }

  ngOnInit() {
    this.apiServices.getApiReport()
      .pipe(
        takeUntil(this.desubscribe$),
        map((res: any) => {
          this.currentData = res.currentConditions;
          this.daysData = res.days;
          return res;
        }),
        catchError((error) => {
          return of(null);
        })
      )
      .subscribe((data) => {
        if (data) {
          console.log('Mapped Data:', data);
        } else {
          console.log('No data due to error.');
        }
      });
  }
  selectDate(item: any) {
    localStorage.setItem("hours", item.hours);
    this.navigator();
  }
  navigator(): void {
    this.router.navigate(['/time'])
  }
  toCelsius(temp: number): string {
    return ((temp - 32) * 5 / 9).toFixed(1);
  }
  ngOnDestroy(): void {
    this.desubscribe$.next();      // emits value to unsubscribe
    this.desubscribe$.complete();

  }
}

