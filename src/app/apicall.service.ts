import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApicallService {

  constructor(private readonly http: HttpClient) {

  }
  getApiReport() {
    return this.http.get('https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/13.0810%2C80.2357?unitGroup=us&key=GHHNEYNUSTCG5WLFEWYV8K882&contentType=json');
  }
}
