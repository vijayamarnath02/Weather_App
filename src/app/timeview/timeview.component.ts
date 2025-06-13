import { Component, OnInit } from '@angular/core';
import { IonBackButton, IonButtons, IonCard, IonCardContent, IonCol, IonContent, IonGrid, IonHeader, IonRow, IonText, IonTitle, IonToolbar } from "@ionic/angular/standalone";
import { ApicallService } from '../apicall.service';

@Component({
  selector: 'app-timeview',
  templateUrl: './timeview.component.html',
  styleUrls: ['./timeview.component.css'],
  standalone: true,
  imports: [IonBackButton, IonButtons, IonTitle, IonToolbar, IonHeader, IonText, IonCol, IonRow, IonGrid, IonCardContent, IonCard, IonContent]
})
export class TimeviewComponent implements OnInit {
  hours: any;
  date: any;
  constructor(private readonly apiServices: ApicallService) { }

  ngOnInit() {
    this.getDataUseingRxjs();
  }
  getDataUseingRxjs() {
    this.apiServices.data$.subscribe(data => {
      this.hours = data;
    });
    this.apiServices.date$.subscribe((date) => {
      this.date = date;
    })
  }
  toCelsius(temp: number): string {
    return ((temp - 32) * 5 / 9).toFixed(1);
  }
}
