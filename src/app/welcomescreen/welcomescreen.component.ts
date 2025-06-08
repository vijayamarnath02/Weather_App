import { Component, OnInit } from '@angular/core';
import { IonContent } from "@ionic/angular/standalone";

@Component({
  selector: 'app-welcomescreen',
  templateUrl: './welcomescreen.component.html',
  styleUrls: ['./welcomescreen.component.scss'],
  standalone: true,
  imports: [IonContent,]
})
export class WelcomescreenComponent implements OnInit {

  constructor() { }

  ngOnInit() { }

}
