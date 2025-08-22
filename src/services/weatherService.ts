import { WeatherData, ForecastData, HourlyForecastData, WeatherError } from '../types/weather';

const API_KEY = 'd20c676dd73fff2eb007d52e78ab32fb';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export class WeatherService {
  static async getWeatherByCity(city: string): Promise<WeatherData> {
    try {
      const response = await fetch(
        `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=es`
      );
      
      if (!response.ok) {
        const errorData: WeatherError = await response.json();
        throw new Error(errorData.message || 'Ciudad no encontrada');
      }
      
      const data: WeatherData = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error de conexión. Verifica tu internet.');
    }
  }

  static async getWeatherByCoords(lat: number, lon: number): Promise<WeatherData> {
    try {
      const response = await fetch(
        `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=es`
      );
      
      if (!response.ok) {
        const errorData: WeatherError = await response.json();
        throw new Error(errorData.message || 'No se pudo obtener el clima para esta ubicación');
      }
      
      const data: WeatherData = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error de conexión. Verifica tu internet.');
    }
  }

  static async getForecastByCity(city: string): Promise<ForecastData> {
    try {
      const response = await fetch(
        `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=es`
      );
      
      if (!response.ok) {
        const errorData: WeatherError = await response.json();
        throw new Error(errorData.message || 'No se pudo obtener el pronóstico');
      }
      
      const data: ForecastData = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error de conexión. Verifica tu internet.');
    }
  }

  static async getHourlyForecastByCity(city: string): Promise<HourlyForecastData> {
    try {
      const response = await fetch(
        `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=es`
      );
      
      if (!response.ok) {
        const errorData: WeatherError = await response.json();
        throw new Error(errorData.message || 'No se pudo obtener el pronóstico por horas');
      }
      
      const data: HourlyForecastData = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error de conexión. Verifica tu internet.');
    }
  }

  static async getHourlyForecastByCoords(lat: number, lon: number): Promise<HourlyForecastData> {
    try {
      const response = await fetch(
        `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=es`
      );
      
      if (!response.ok) {
        const errorData: WeatherError = await response.json();
        throw new Error(errorData.message || 'No se pudo obtener el pronóstico por horas');
      }
      
      const data: HourlyForecastData = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error de conexión. Verifica tu internet.');
    }
  }
}