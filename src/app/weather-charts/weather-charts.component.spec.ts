import { ComponentFixture, TestBed } from "@angular/core/testing";
import { WeatherChartsComponent } from "./weather-charts.component";
import { FormsModule } from "@angular/forms";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { By } from "@angular/platform-browser";
import { WeatherService } from "../services/weather/weather.service";
import { of } from "rxjs";
import { Forecast } from "../services/weather/weather.interfaces";
import { AgGridAngular } from "ag-grid-angular";
import { ChartModule } from "angular-highcharts";

// Mock WeatherService
class MockWeatherService {
  getWeatherData(date: Date) {
    const mockData: Forecast[] = [
      {
        temperature: {
          low: 23,
          high: 32,
        },
        date: "2024-01-10",
        forecast: "Afternoon thundery showers",
        relative_humidity: {
          low: 65,
          high: 95,
        },
        wind: {
          speed: {
            low: 15,
            high: 25,
          },
          direction: "NE",
        },
        timestamp: "2024-01-10T00:00:00+08:00",
      },
    ];
    return of(mockData);
  }
}

describe("WeatherChartsComponent", () => {
  let component: WeatherChartsComponent;
  let fixture: ComponentFixture<WeatherChartsComponent>;
  let mockWeatherService: MockWeatherService;

  beforeEach(async () => {
    mockWeatherService = new MockWeatherService();

    await TestBed.configureTestingModule({
      declarations: [WeatherChartsComponent],
      imports: [
        FormsModule,
        HttpClientTestingModule,
        AgGridAngular,
        ChartModule,
      ],
      providers: [{ provide: WeatherService, useValue: mockWeatherService }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeatherChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should fetch weather data on init", () => {
    spyOn(component, "fetchDataAndRenderCharts");
    component.ngOnInit();
    expect(component.fetchDataAndRenderCharts).toHaveBeenCalled();
  });

  it("should call fetchDataAndRenderCharts when search button is clicked", () => {
    spyOn(component, "fetchDataAndRenderCharts");
    fixture.debugElement
      .query(By.css("#searchBtn"))
      .triggerEventHandler("click", null);
    expect(component.fetchDataAndRenderCharts).toHaveBeenCalled();
  });

  it("should display the chart or table after data is fetched", () => {
    // Trigger data fetching and chart/table generation
    component.fetchDataAndRenderCharts();
    fixture.detectChanges(); // Update view with the fetched data

    const temperatureChartElement = fixture.debugElement.query(
      By.css("#temperatureChart")
    );
    const humidityChartElement = fixture.debugElement.query(
      By.css("#humidityChart")
    );
    const weatherTableElement = fixture.debugElement.query(
      By.css("#weatherTable")
    );
    expect(temperatureChartElement).not.toBeNull();
    expect(humidityChartElement).not.toBeNull();
    expect(weatherTableElement).not.toBeNull();
  });

  it("should display loading spinner when weatherData is undefined", () => {
    component.weatherData = undefined;
    fixture.detectChanges();
    const spinner = fixture.debugElement.query(By.css("#loadingSpinner"));
    expect(spinner).not.toBeNull();
  });

  it("should display no data message when weatherData is null", () => {
    component.weatherData = null;
    fixture.detectChanges();
    const message = fixture.debugElement.query(By.css("#noDataMsg"))
      .nativeElement.textContent;
    expect(message.trim()).toBe("Sorry, No Weather Forecast Data Available.");
  });

  it("should change active tab when tab button is clicked", () => {
    component.setActiveTab("tableChart");
    fixture.detectChanges();
    const activeTab = fixture.debugElement.query(
      By.css("#tableTab")
    ).nativeElement;
    expect(activeTab.textContent).toContain("Table");
  });
});
