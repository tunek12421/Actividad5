import React from 'react';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonIcon,
  IonItem,
  IonLabel
} from '@ionic/react';
import { sunny, rainy, cloudy, snow, thunderstorm, partlySunny } from 'ionicons/icons';
import { ForecastData } from '../types/weather';

interface ForecastCardProps {
  forecastData: ForecastData | null;
}

const ForecastCard: React.FC<ForecastCardProps> = ({ forecastData }) => {
  const getWeatherIcon = (weatherMain: string) => {
    switch (weatherMain.toLowerCase()) {
      case 'clear': return sunny;
      case 'clouds': return cloudy;
      case 'rain': case 'drizzle': return rainy;
      case 'snow': return snow;
      case 'thunderstorm': return thunderstorm;
      case 'mist': case 'fog': case 'haze': return partlySunny;
      default: return sunny;
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
                <IonIcon 
                  icon={getWeatherIcon(day.weather.main)} 
                  style={{ fontSize: '1.5rem', color: '#3880ff' }} 
                />
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