import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class CareWeatherService {
  async forecast(latitude: number, longitude: number) {
    const { data } = await axios.get('https://api.open-meteo.com/v1/forecast', {
      timeout: 10000,
      params: {
        latitude,
        longitude,
        daily: 'precipitation_sum,temperature_2m_max',
        timezone: 'Asia/Bangkok',
        forecast_days: 7,
      },
    });
    const daily = data?.daily;
    if (
      !Array.isArray(daily?.time) ||
      !Array.isArray(daily?.precipitation_sum) ||
      !Array.isArray(daily?.temperature_2m_max)
    ) {
      throw new Error('Invalid weather response');
    }
    const forecast = new Map<string, { rain: number; temperature: number }>();
    daily.time.forEach((date: string, index: number) => {
      const rain = daily.precipitation_sum[index];
      const temperature = daily.temperature_2m_max[index];
      if (
        typeof rain === 'number' &&
        Number.isFinite(rain) &&
        typeof temperature === 'number' &&
        Number.isFinite(temperature)
      ) {
        forecast.set(date, { rain, temperature });
      }
    });
    if (!forecast.size)
      throw new Error('Weather response has no usable daily forecast');
    return forecast;
  }
}
