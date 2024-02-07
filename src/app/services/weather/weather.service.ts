import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WeatherData } from './weather.interfaces';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private apiUrl =
    'https://api.data.gov.sg/v1/environment/4-day-weather-forecast?date=2019-12-24';

  constructor(private http: HttpClient) {}

  getWeatherData(): Observable<WeatherData> {
    return this.http.get<WeatherData>(this.apiUrl);
  }
}
