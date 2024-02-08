import { Component, OnInit } from "@angular/core";
import { Forecast } from "../services/weather/weather.interfaces";
import { WeatherService } from "../services/weather/weather.service";
import { ColDef } from "ag-grid-community";
import { Chart } from "angular-highcharts";

interface tableRow {
  date: string;
  lowTemperature: number;
  highTemperature: number;
  lowHumidity: number;
  highHumidity: number;
}

interface weatherLineData {
  date: string;
  low: number;
  high: number;
}

@Component({
  selector: "app-weather-charts",
  templateUrl: "./weather-charts.component.html",
  styleUrls: ["./weather-charts.component.css"],
})
export class WeatherChartsComponent implements OnInit {
  themeClass = "ag-theme-quartz";
  selectedDate: string;
  maxDate: string;
  weatherData: Forecast[] | undefined;
  errorMessage: string | null = null;
  rowData: tableRow[] = [];
  temperatureLineData: weatherLineData[] = [];
  humidityLineData: weatherLineData[] = [];

  temperatureChart: Chart | undefined;
  humidityChart: Chart | undefined;
  colDefs: ColDef[] = [
    { field: "date", flex: 1 },
    { field: "lowTemperature", flex: 1 },
    { field: "highTemperature", flex: 1 },
    { field: "lowHumidity", flex: 1 },
    { field: "highHumidity", flex: 1 },
  ];

  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    minWidth: 150,
    flex: 1,
    cellStyle: { textAlign: "center" },
  };

  activeTab: string = "lineCharts"; // Default to line charts tab

  constructor(private weatherService: WeatherService) {
    this.selectedDate = "2021-09-04";
    this.maxDate = new Date().toISOString().split('T')[0];
  }

  setActiveTab(tabName: string): void {
    this.activeTab = tabName;
  }

  ngOnInit(): void {
    this.fetchDataAndRenderCharts();
  }

  fetchDataAndRenderCharts(): void {
    const formatDate = new Date(this.selectedDate);

    this.weatherService.getWeatherData(formatDate).subscribe({
      next: (data) => {
        this.weatherData = data;
        console.log(data);

        this.transformDataForTable();
        this.transformDataForTemperatureLine();
        this.transformDataForHumidityLine();
      },
      error: (error) => {
        this.errorMessage = error.message;
        console.error("There was an error!", this.errorMessage);
        alert("Fail to retrieve data :(")
        this.weatherData = undefined;
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

  private transformDataForTemperatureLine(): void {
    if (this.weatherData) {
      this.temperatureLineData = this.weatherData.map(
        (forecast: Forecast): weatherLineData => ({
          date: forecast.date,
          low: forecast.temperature.low,
          high: forecast.temperature.high,
        })
      );
    }

    this.temperatureChart = new Chart({
      chart: {
        type: "line",
      },
      title: {
        text: "30-day Temperature",
      },
      credits: {
        enabled: false,
      },
      xAxis: {
        type: "category",
      },
      yAxis: {
        title: {
          text: "Temperature (°C)",
        },
      },
      series: [
        {
          name: "Low",
          data: this.temperatureLineData.map((temp) => [temp.date, temp.low]),
        } as any,
        {
          name: "High",
          data: this.temperatureLineData.map((temp) => [temp.date, temp.high]),
        } as any,
      ],
    });
  }

  private transformDataForHumidityLine(): void {
    if (this.weatherData) {
      this.temperatureLineData = this.weatherData.map(
        (forecast: Forecast): weatherLineData => ({
          date: forecast.date,
          low: forecast.relative_humidity.low,
          high: forecast.relative_humidity.high,
        })
      );
    }

    this.humidityChart = new Chart({
      chart: {
        type: "line",
      },
      title: {
        text: "30-day Relative Humidity",
      },
      credits: {
        enabled: false,
      },
      xAxis: {
        type: "category",
      },
      yAxis: {
        max: 100,
        title: {
          text: "Humidity",
        },
      },
      series: [
        {
          name: "Low",
          data: this.temperatureLineData.map((temp) => [temp.date, temp.low]),
        } as any,
        {
          name: "High",
          data: this.temperatureLineData.map((temp) => [temp.date, temp.high]),
        } as any,
      ],
    });
  }
}
