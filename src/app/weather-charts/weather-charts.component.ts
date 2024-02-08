import { Component, OnInit } from "@angular/core";
import { Forecast } from "../services/weather/weather.interfaces";
import { WeatherService } from "../services/weather/weather.service";
import { ColDef } from "ag-grid-community";

interface tableRow {
  date: string;
  lowTemperature: number;
  highTemperature: number;
  lowHumidity: number;
  highHumidity: number;
}

@Component({
  selector: "app-weather-charts",
  templateUrl: "./weather-charts.component.html",
  styleUrls: ["./weather-charts.component.css"],
})
export class WeatherChartsComponent {
  themeClass = "ag-theme-quartz";
  selectedDate: string;
  weatherData: Forecast[] | undefined;
  errorMessage: string | null = null;
  rowData: tableRow[] | undefined;

  colDefs: ColDef[] = [
    { field: "date" },
    { field: "lowTemperature" },
    { field: "highTemperature" },
    { field: "lowHumidity" },
    { field: "highHumidity" },
  ];

  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
  };

  constructor(private weatherService: WeatherService) {
    this.selectedDate = "2021-09-04";
  }

  onDateChange(): void {
    console.log("Selected date:", this.selectedDate);
  }
  submitDate(): void {
    // TODO: should bu user input
    const formatDate = new Date(this.selectedDate);
    console.log(formatDate);

    this.weatherService.getWeatherData(formatDate).subscribe({
      next: (data) => {
        this.weatherData = data;
        console.log(data);

        this.transformDataForTable();
        // this.transformDataForChart();
      },
      error: (error) => {
        this.errorMessage = error.message;
        console.error("There was an error!", this.errorMessage);
      },
    });
  }
  private transformDataForTable(): void {
    if (this.weatherData) {
      this.rowData = this.weatherData.map(
        (forecast: Forecast): tableRow => ({
          date: forecast.date,
          lowTemperature: forecast.temperature.low,
          highTemperature: forecast.temperature.high,
          lowHumidity: forecast.relative_humidity.low,
          highHumidity: forecast.relative_humidity.high,
        })
      );
    }
  }
}
