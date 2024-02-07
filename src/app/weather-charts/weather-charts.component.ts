import { Component, OnInit } from '@angular/core';
import { Forecast } from '../services/weather/weather.interfaces'
import { WeatherService } from '../services/weather/weather.service';
import { ColDef } from 'ag-grid-community';

@Component({
  selector: 'app-weather-charts',
  templateUrl: './weather-charts.component.html',
  styleUrls: ['./weather-charts.component.css'],
})

export class WeatherChartsComponent implements OnInit {
  weatherData: Forecast[] | null = null;
  errorMessage: string | null = null;
  colDefs: ColDef[] = [
    { field: "make" },
    { field: "model" },
    { field: "price" },
    { field: "electric" }
  ];
  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    // TODO: should bu user input
    const tmpDate =  new Date('2023-10-04')
    this.weatherService.getWeatherData(tmpDate).subscribe({
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