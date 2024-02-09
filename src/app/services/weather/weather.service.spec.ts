import { TestBed } from "@angular/core/testing";
import { WeatherService } from "./weather.service";
import { of } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Forecast, WeatherApiResp } from "./weather.interfaces";

describe("Weather Service", () => {
  let weatherService: WeatherService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  const inputDate = new Date("2024-01-20");
  const FORECASTS: Forecast[] = [
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
  const mockApiResponse: WeatherApiResp = {
    items: [
      {
        update_timestamp: "2024-01-09T17:30:51+08:00",
        timestamp: "2024-01-09T17:19:00+08:00",
        forecasts: FORECASTS,
      },
    ],
    api_info: {
      status: "healthy",
    },
  };

  beforeEach(() => {
    let httpClientSpyObj = jasmine.createSpyObj("HttpClient", ["get"]);
    TestBed.configureTestingModule({
      providers: [
        WeatherService,
        {
          provide: HttpClient,
          useValue: httpClientSpyObj,
        },
      ],
    });

    weatherService = TestBed.inject(WeatherService);
    httpClientSpy = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
  });

  describe("getWeatherForecast()", () => {
    it("should return expected array of weather forecasts", (done: DoneFn) => {
      httpClientSpy.get.and.returnValue(of(mockApiResponse));
      weatherService.getWeatherForecast(inputDate).subscribe({
        next: (data) => {
          expect(data).toEqual(mockApiResponse);
          done();
        },
        error: () => {
          done.fail;
        },
      });
      expect(httpClientSpy.get).toHaveBeenCalledTimes(1);
    });
  });

  describe("fetchMultipleWeatherForecast()", () => {
    it("should make the correct number of requests", (done: DoneFn) => {
      httpClientSpy.get.and.returnValue(of(mockApiResponse)); // Mock the HTTP response

      weatherService.fetchMultipleWeatherForecast(inputDate, 4).subscribe({
        next: (results) => {
          expect(results.length).toBe(1);
          expect(httpClientSpy.get).toHaveBeenCalledTimes(1);
          done();
        },
        error: done.fail,
      });
    });
  });

  describe("transformWeatherForecast()", () => {
    it("should transform API response to Forecast array", () => {
      const transformedData = weatherService.transformWeatherForecast(
        [mockApiResponse],
        new Date("2024-01-11")
      );
      expect(transformedData).toEqual(FORECASTS); // Assuming FORECASTS matches the transformation logic
    });
  });

  describe("getWeatherData()", () => {
    it("should fetch and transform weather data correctly", (done: DoneFn) => {
      httpClientSpy.get.and.returnValue(of(mockApiResponse)); // Mock the HTTP response for multiple periods

      weatherService.getWeatherData(inputDate, 4).subscribe({
        next: (data) => {
          expect(data).toEqual(FORECASTS); // The final data should match the transformed forecasts
          done();
        },
        error: done.fail,
      });

      expect(httpClientSpy.get.calls.count()).toEqual(1);
    });
  });
});
