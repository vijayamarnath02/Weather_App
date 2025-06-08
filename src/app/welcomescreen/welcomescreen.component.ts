import { Component, OnInit } from '@angular/core';
import { IonContent } from "@ionic/angular/standalone";

@Component({
  selector: 'app-welcomescreen',
  templateUrl: './welcomescreen.component.html',
  styleUrls: ['./welcomescreen.component.css'],
  standalone: true,
  imports: [IonContent,]
})
export class WelcomescreenComponent implements OnInit {

  constructor() { }

  ngOnInit() { }

}
