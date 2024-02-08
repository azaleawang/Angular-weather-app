import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, forkJoin } from "rxjs";
import { Forecast, WeatherApiResp } from "./weather.interfaces";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class WeatherService {
  private baseUrl =
    "https://api.data.gov.sg/v1/environment/4-day-weather-forecast";
  constructor(private http: HttpClient) {}

  getWeatherData(inputDate: Date): Observable<Forecast[] | undefined> {
    const DAYS = 30;
    // If inputDate is null, then assign it the current date
    inputDate = inputDate ?? new Date();

    let startDate: Date = new Date(inputDate);
    startDate.setDate(inputDate.getDate() - DAYS);

    const requests = [];
    for (let i = 0; i < Math.ceil(DAYS / 4); i++) {
      const dateString = startDate.toISOString().split("T")[0];
      const apiUrl = `${this.baseUrl}?date=${dateString}`;
      requests.push(this.http.get<WeatherApiResp>(apiUrl));
      startDate.setDate(startDate.getDate() + 4);
    }

    return forkJoin(requests).pipe(
      map((results) => {
        console.log(results);
        const flattenForecastData = results
          .flatMap((data) => data.items[0]?.forecasts)
          .filter((forecast) => new Date(forecast?.date) <= inputDate);

        return flattenForecastData;
      })
    );
  }
}
