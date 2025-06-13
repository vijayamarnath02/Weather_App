import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApicallService {
  private dataSubject = new BehaviorSubject<any>([]);
  private date = new BehaviorSubject<any>('');
  constructor(private readonly http: HttpClient) {

  }
  getApiReport(lat: number, lon: number) {
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat},${lon}?unitGroup=us&key=GHHNEYNUSTCG5WLFEWYV8K882&contentType=json`;
    return this.http.get(url);
  }
  getCityFromCoords(lat: number, lon: number) {
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=486dc1f72c8a4cf28b547e960b9717bf`
    return this.http.get(url);
  }
  data$ = this.dataSubject.asObservable();
  date$ = this.date.asObservable();
  getData(): string {
    return this.dataSubject.value;
  }
  setData(newValue: any) {
    this.dataSubject.next(newValue);
  }
  setDate(newValue: any) {
    this.date.next(newValue);
  }

}
