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
  private DAYS = 30;
  constructor(private http: HttpClient) {}

  // fetch weather forecast one time
  fetchWeatherForecast(inputDate: Date): Observable<WeatherApiResp> {
    const apiUrl = `${this.baseUrl}?date=${
      inputDate.toISOString().split("T")[0]
    }`;
    return this.http.get<WeatherApiResp>(apiUrl);
  }

  // fetch weather forecast multiple times
  fetchMultipleWeatherForecast(
    startDate: Date,
    days: number = this.DAYS
  ): Observable<WeatherApiResp[]> {
    let requests: Observable<WeatherApiResp>[] = [];
    // fetch 4 days at a time, repeating until the number of days is reached
    for (let i = 0; i < Math.ceil(days / 4); i++) {
      requests.push(this.fetchWeatherForecast(startDate));
      startDate.setDate(startDate.getDate() + 4);
    }

    return forkJoin(requests);
  }

  // Transforms weather forecast data to a flatten array
  transformWeatherForecast(
    results: WeatherApiResp[],
    inputDate: Date
  ): Forecast[] | undefined {
    return results
      .flatMap((result) => result.items[0]?.forecasts)
      .filter((forecast) => new Date(forecast?.date) <= inputDate);
  }

  // get 30 day weather forecast given input date
  getWeatherData(
    inputDate: Date,
    days: number = this.DAYS
  ): Observable<Forecast[] | undefined> {
    inputDate = inputDate ?? new Date();
    let startDate: Date = new Date(inputDate);
    startDate.setDate(startDate.getDate() - days);

    return this.fetchMultipleWeatherForecast(startDate, days).pipe(
      map((results) => this.transformWeatherForecast(results, inputDate))
    );
  }
}
