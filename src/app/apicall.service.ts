import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApicallService {

  constructor(private readonly http: HttpClient) {

  }
  getApiReport(lat: number, lon: number) {
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat},${lon}?unitGroup=us&key=GHHNEYNUSTCG5WLFEWYV8K882&contentType=json`;
    return this.http.get(url);
  }
  getCityFromCoords(lat: number, lon: number) {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
    return this.http.get(url);
  }
}
