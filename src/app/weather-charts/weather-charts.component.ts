import { Component, OnInit } from '@angular/core';
import { WeatherData } from '../services/weather/weather.interfaces'
import { WeatherService } from '../services/weather/weather.service';
@Component({
  selector: 'app-weather-charts',
  templateUrl: './weather-charts.component.html',
  styleUrls: ['./weather-charts.component.css'],
})

export class WeatherChartsComponent implements OnInit {
  weatherData: WeatherData | null = null;
  errorMessage: string | null = null;
  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    this.weatherService.getWeatherData().subscribe({
      next: (data) => {
        this.weatherData = data;
        console.log(this.weatherData);
      },
      error: (error) => {
        this.errorMessage = error.message;
        console.error('There was an error!', this.errorMessage);
      }
    });
  }
}