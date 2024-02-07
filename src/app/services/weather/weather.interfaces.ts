
interface WeatherData {
  items: WeatherItem[];
  api_info: ApiInfo;
}

interface WeatherItem {
  update_timestamp: string;
  timestamp: string;
  forecasts: Forecast[];
}

interface Forecast {
  temperature: {
    low: number;
    high: number;
  };
  date: string;
  forecast: string;
  relative_humidity: {
    low: number;
    high: number;
  };
  wind: {
    speed: {
      low: number;
      high: number;
    };
    direction: string;
  };
  timestamp: string;
}

interface ApiInfo {
  status: string;
}

export { WeatherData, WeatherItem, Forecast, ApiInfo };