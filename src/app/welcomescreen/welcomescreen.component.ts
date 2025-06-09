import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonButton, IonCol, IonContent, IonGrid, IonImg, IonRow, IonText } from "@ionic/angular/standalone";

@Component({
  selector: 'app-welcomescreen',
  templateUrl: './welcomescreen.component.html',
  styleUrls: ['./welcomescreen.component.css'],
  standalone: true,
  imports: [IonText, IonButton, IonImg, IonCol, IonRow, IonGrid, IonContent]
})
export class WelcomescreenComponent implements OnInit {

  constructor(private readonly router: Router) { }

  ngOnInit() { }
  navigator(): void {
    this.router.navigate(['/main-page'])
  }

}
