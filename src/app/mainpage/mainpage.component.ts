import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonCol, IonContent, IonGrid, IonIcon, IonRow, IonText } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { locationOutline } from 'ionicons/icons';
import { catchError, map, of, Subject, takeUntil } from 'rxjs';
import { ApicallService } from '../apicall.service';

@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.css'],
  standalone: true,
  imports: [IonText, IonCol, IonRow, IonGrid, IonIcon, IonContent,]
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
  constructor(private readonly apiServices: ApicallService) {
    addIcons({ locationOutline });
  }

  ngOnInit() {
    this.apiServices.getApiReport()
      .pipe(
        takeUntil(this.desubscribe$),
        map((res: any) => {
          this.currentData = res.currentConditions;
          this.daysData = res.days;
          console.log(this.currentData);
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

  ngOnDestroy(): void {
    this.desubscribe$.next();      // emits value to unsubscribe
    this.desubscribe$.complete();

  }
}

