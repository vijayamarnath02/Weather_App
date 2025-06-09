import { Component, OnInit } from '@angular/core';
import { IonCard, IonCardContent, IonCol, IonContent, IonGrid, IonHeader, IonRow, IonText, IonTitle, IonToolbar } from "@ionic/angular/standalone";

@Component({
  selector: 'app-timeview',
  templateUrl: './timeview.component.html',
  styleUrls: ['./timeview.component.css'],
  standalone: true,
  imports: [IonTitle, IonToolbar, IonHeader, IonText, IonCol, IonRow, IonGrid, IonCardContent, IonCard, IonContent]
})
export class TimeviewComponent implements OnInit {
  hours: any;
  date: any;
  constructor() { }

  ngOnInit() {
    this.hours = localStorage.getItem("hours")
    this.hours = JSON.parse(this.hours)
    this.date = localStorage.getItem("date");
    this.date = JSON.parse(this.date)
  }
  toCelsius(temp: number): string {
    return ((temp - 32) * 5 / 9).toFixed(1);
  }
}
