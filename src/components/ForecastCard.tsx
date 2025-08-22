import React from 'react';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonItem,
  IonLabel
} from '@ionic/react';
import { ForecastData } from '../types/weather';

interface ForecastCardProps {
  forecastData: ForecastData | null;
}

const ForecastCard: React.FC<ForecastCardProps> = ({ forecastData }) => {
  const getWeatherEmoji = (weatherMain: string, description: string) => {
    const weather = weatherMain.toLowerCase();
    const desc = description.toLowerCase();
    
    switch (weather) {
      case 'clear':
        return '☀️';
      case 'clouds':
        if (desc.includes('few clouds')) return '🌤️';
        if (desc.includes('scattered clouds')) return '⛅';
        if (desc.includes('broken clouds') || desc.includes('overcast')) return '☁️';
        return '☁️';
      case 'rain':
        if (desc.includes('light rain')) return '🌦️';
        if (desc.includes('moderate rain')) return '🌧️';
        if (desc.includes('heavy rain') || desc.includes('very heavy rain')) return '⛈️';
        if (desc.includes('shower')) return '🌦️';
        return '🌧️';
      case 'drizzle':
        return '🌦️';
      case 'snow':
        if (desc.includes('light snow')) return '🌨️';
        if (desc.includes('heavy snow')) return '❄️';
        if (desc.includes('sleet')) return '🌨️';
        return '🌨️';
      case 'thunderstorm':
        if (desc.includes('light thunderstorm')) return '⛈️';
        if (desc.includes('heavy thunderstorm')) return '⛈️';
        if (desc.includes('ragged thunderstorm')) return '⛈️';
        return '⛈️';
      case 'mist':
        return '🌫️';
      case 'fog':
        return '🌫️';
      case 'haze':
        return '😶‍🌫️';
      case 'dust':
        return '💨';
      case 'sand':
        return '💨';
      case 'ash':
        return '🌋';
      case 'squall':
        return '💨';
      case 'tornado':
        return '🌪️';
      default:
        return '🌤️';
    }
  };

  const getDailyForecast = (forecast: ForecastData) => {
    const dailyData: { [key: string]: any } = {};
    
    forecast.list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const dayKey = date.toDateString();
      
      if (!dailyData[dayKey]) {
        dailyData[dayKey] = {
          date: date,
          temps: [item.main.temp],
          weather: item.weather[0],
          items: [item]
        };
      } else {
        dailyData[dayKey].temps.push(item.main.temp);
        dailyData[dayKey].items.push(item);
      }
    });

    return Object.values(dailyData).slice(0, 5).map((day: any) => ({
      ...day,
      maxTemp: Math.max(...day.temps),
      minTemp: Math.min(...day.temps)
    }));
  };

  const formatDay = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Hoy';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Mañana';
    } else {
      return date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' });
    }
  };

  if (!forecastData) {
    return null;
  }

  const dailyForecast = getDailyForecast(forecastData);

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Pronóstico de 5 días</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        {dailyForecast.map((day, index) => (
          <IonItem key={index} style={{ '--padding-start': '0px' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              width: '100%',
              padding: '8px 0'
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>
                  {formatDay(day.date)}
                </div>
                <div className="weather-description" style={{ fontSize: '0.85rem', textTransform: 'capitalize' }}>
                  {day.weather.description}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ fontSize: '1.5rem' }}>
                  {getWeatherEmoji(day.weather.main, day.weather.description)}
                </div>
                <div style={{ textAlign: 'right', minWidth: '60px' }}>
                  <div style={{ fontWeight: 'bold' }}>
                    {Math.round(day.maxTemp)}°
                  </div>
                  <div className="weather-detail-label" style={{ fontSize: '0.9rem' }}>
                    {Math.round(day.minTemp)}°
                  </div>
                </div>
              </div>
            </div>
          </IonItem>
        ))}
      </IonCardContent>
    </IonCard>
  );
};

export default ForecastCard;