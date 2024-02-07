import { Component, OnInit } from '@angular/core';
import { Forecast } from '../services/weather/weather.interfaces'
import { WeatherService } from '../services/weather/weather.service';
import { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

interface tableRow {
  date: string;
  lowTemperature: number;
  highTemperature: number;
  lowHumidity: number;
  highHumidity: number;
}

@Component({
  selector: 'app-weather-charts',
  templateUrl: './weather-charts.component.html',
  styleUrls: ['./weather-charts.component.css'],
})

export class WeatherChartsComponent implements OnInit {
  themeClass = "ag-theme-quartz";
  weatherData: Forecast[] | undefined;
  errorMessage: string | null = null;
  tableRows: tableRow[] | undefined;
  colDefs: ColDef[] = [
    { field: "Date" },
    { field: "Lowest Temperature" },
    { field: "Highest Temperature" },
    { field: "Lowest Humidity" },
    { field: "Highest Humidity" },
  ];

  constructor(private weatherService: WeatherService) { }


  ngOnInit(): void {
    // TODO: should bu user input
    const tmpDate = new Date('2023-10-04')
    this.weatherService.getWeatherData(tmpDate).subscribe({
      next: (data) => {
        this.weatherData = data;
        console.log(this.weatherData);
        this.transformDataForTable();
        // this.transformDataForChart();
      },
      error: (error) => {
        this.errorMessage = error.message;
        console.error('There was an error!', this.errorMessage);
      }
    });
  }
  private transformDataForTable(): void {
    if (this.weatherData) {
      this.tableRows = this.weatherData.map((forecast: Forecast): tableRow => ({
        date: forecast.date,
        lowTemperature: forecast.temperature.low,
        highTemperature: forecast.temperature.high,
        lowHumidity: forecast.relative_humidity.low,
        highHumidity: forecast.relative_humidity.high,
      }));
    }
  }
}