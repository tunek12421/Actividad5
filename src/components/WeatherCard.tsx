import React, { useState } from 'react';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonInput,
  IonItem,
  IonLoading,
  IonToast,
  IonIcon
} from '@ionic/react';
import { search, water, location, eye, speedometer, navigate } from 'ionicons/icons';
import { WeatherService } from '../services/weatherService';
import { WeatherData, ForecastData, HourlyForecastData } from '../types/weather';
import ForecastCard from './ForecastCard';
import RecentSearches from './RecentSearches';
import HourlyChart from './HourlyChart';
import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';

const WeatherCard: React.FC = () => {
  const [city, setCity] = useState<string>('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [hourlyData, setHourlyData] = useState<HourlyForecastData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [showToast, setShowToast] = useState<boolean>(false);
  const [geoLoading, setGeoLoading] = useState<boolean>(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load recent searches from localStorage on component mount
  React.useEffect(() => {
    const saved = localStorage.getItem('weather-recent-searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage whenever recentSearches changes
  React.useEffect(() => {
    localStorage.setItem('weather-recent-searches', JSON.stringify(recentSearches));
  }, [recentSearches]);

  const addToRecentSearches = (cityName: string) => {
    setRecentSearches(prev => {
      const filtered = prev.filter(item => item.toLowerCase() !== cityName.toLowerCase());
      return [cityName, ...filtered].slice(0, 5); // Keep only 5 recent searches
    });
  };

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

  const handleSearch = async () => {
    if (!city.trim()) {
      setError('Por favor ingresa el nombre de una ciudad');
      setShowToast(true);
      return;
    }

    setLoading(true);
    setError('');
    setWeatherData(null);
    setForecastData(null);
    setHourlyData(null);

    try {
      const [weatherData, forecastData, hourlyData] = await Promise.all([
        WeatherService.getWeatherByCity(city),
        WeatherService.getForecastByCity(city),
        WeatherService.getHourlyForecastByCity(city)
      ]);
      setWeatherData(weatherData);
      setForecastData(forecastData);
      setHourlyData(hourlyData);
      addToRecentSearches(city);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleGeolocation = async () => {
    setGeoLoading(true);
    setError('');
    setWeatherData(null);

    try {
      let latitude: number;
      let longitude: number;

      // Check if we're running on a native platform
      if (Capacitor.isNativePlatform()) {
        // Use Capacitor Geolocation for native platforms
        const permissions = await Geolocation.checkPermissions();
        
        if (permissions.location !== 'granted') {
          const requestPermissions = await Geolocation.requestPermissions();
          if (requestPermissions.location !== 'granted') {
            setError('Se requieren permisos de ubicación para esta función');
            setShowToast(true);
            setGeoLoading(false);
            return;
          }
        }

        const position = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 10000,
        });

        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
      } else {
        // Use browser geolocation API for web
        if (!navigator.geolocation) {
          setError('Geolocalización no disponible en este navegador');
          setShowToast(true);
          setGeoLoading(false);
          return;
        }

        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000
          });
        });

        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
      }

      // Get weather data using coordinates
      const data = await WeatherService.getWeatherByCoords(latitude, longitude);
      setWeatherData(data);
      setCity(data.name);
      addToRecentSearches(data.name);
      
      // Get forecast and hourly data for the located city
      try {
        const [forecast, hourlyForecast] = await Promise.all([
          WeatherService.getForecastByCity(data.name),
          WeatherService.getHourlyForecastByCity(data.name)
        ]);
        setForecastData(forecast);
        setHourlyData(hourlyForecast);
      } catch (forecastErr) {
        console.warn('Could not get forecast for current location');
      }
    } catch (err) {
      console.error('Geolocation error:', err);
      if (err instanceof GeolocationPositionError) {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError('Permisos de ubicación denegados. Permite el acceso a la ubicación.');
            break;
          case err.POSITION_UNAVAILABLE:
            setError('Ubicación no disponible. Verifica que el GPS esté activado.');
            break;
          case err.TIMEOUT:
            setError('Tiempo de espera agotado. Intenta de nuevo.');
            break;
          default:
            setError('Error al obtener la ubicación.');
            break;
        }
      } else {
        setError('Error al obtener la ubicación. Verifica que el GPS esté activado.');
      }
      setShowToast(true);
    } finally {
      setGeoLoading(false);
    }
  };

  const handleRecentSearchSelect = (selectedCity: string) => {
    setCity(selectedCity);
    // Trigger search automatically
    handleSearchForCity(selectedCity);
  };

  const handleSearchForCity = async (cityName: string) => {
    setLoading(true);
    setError('');
    setWeatherData(null);
    setForecastData(null);
    setHourlyData(null);

    try {
      const [weatherData, forecastData, hourlyData] = await Promise.all([
        WeatherService.getWeatherByCity(cityName),
        WeatherService.getForecastByCity(cityName),
        WeatherService.getHourlyForecastByCity(cityName)
      ]);
      setWeatherData(weatherData);
      setForecastData(forecastData);
      setHourlyData(hourlyData);
      addToRecentSearches(cityName);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const removeFromRecentSearches = (cityToRemove: string) => {
    setRecentSearches(prev => prev.filter(city => city !== cityToRemove));
  };

  return (
    <div>
      <RecentSearches 
        searches={recentSearches}
        onSearchSelect={handleRecentSearchSelect}
        onSearchRemove={removeFromRecentSearches}
      />
      
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Consulta del Clima</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <IonItem>
            <IonInput
              label="Ciudad"
              value={city}
              placeholder="Ej: Madrid, Londres, Nueva York"
              onIonInput={(e) => setCity(e.detail.value!)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </IonItem>
          <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
            <IonButton
              expand="block"
              onClick={handleSearch}
              disabled={loading || geoLoading}
            >
              <IonIcon icon={search} slot="start" />
              Buscar
            </IonButton>
            <IonButton
              fill="outline"
              onClick={handleGeolocation}
              disabled={loading || geoLoading}
            >
              <IonIcon icon={location} slot="icon-only" />
            </IonButton>
          </div>
        </IonCardContent>
      </IonCard>

      {weatherData && (
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>
              {weatherData.name}, {weatherData.sys.country}
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '4rem', margin: '20px 0' }}>
                {getWeatherEmoji(weatherData.weather[0].main, weatherData.weather[0].description)}
              </div>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', margin: '16px 0' }}>
                {Math.round(weatherData.main.temp)}°C
              </div>
              <div className="weather-description" style={{ fontSize: '1.2rem', marginBottom: '16px', textTransform: 'capitalize' }}>
                {weatherData.weather[0].description}
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '24px' }}>
                <div className="weather-details-grid" style={{ textAlign: 'center', padding: '12px', borderRadius: '8px' }}>
                  <div className="weather-detail-label" style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Sensación térmica</div>
                  <div className="weather-detail-value" style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{Math.round(weatherData.main.feels_like)}°C</div>
                </div>
                <div className="weather-details-grid" style={{ textAlign: 'center', padding: '12px', borderRadius: '8px' }}>
                  <div className="weather-detail-label" style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
                    <IonIcon icon={water} style={{ marginRight: '4px' }} />
                    Humedad
                  </div>
                  <div className="weather-detail-value" style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{weatherData.main.humidity}%</div>
                </div>
                <div className="weather-details-grid" style={{ textAlign: 'center', padding: '12px', borderRadius: '8px' }}>
                  <div className="weather-detail-label" style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
                    <IonIcon icon={eye} style={{ marginRight: '4px' }} />
                    Visibilidad
                  </div>
                  <div className="weather-detail-value" style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{(weatherData.visibility / 1000).toFixed(1)} km</div>
                </div>
                <div className="weather-details-grid" style={{ textAlign: 'center', padding: '12px', borderRadius: '8px' }}>
                  <div className="weather-detail-label" style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
                    <IonIcon icon={speedometer} style={{ marginRight: '4px' }} />
                    Presión
                  </div>
                  <div className="weather-detail-value" style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{weatherData.main.pressure} hPa</div>
                </div>
              </div>
              
              {weatherData.wind && (
                <div className="weather-details-grid" style={{ textAlign: 'center', padding: '12px', borderRadius: '8px', marginTop: '16px' }}>
                  <div className="weather-detail-label" style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
                    <IonIcon icon={navigate} style={{ marginRight: '4px' }} />
                    Viento
                  </div>
                  <div className="weather-detail-value" style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                    {weatherData.wind.speed} m/s
                    {weatherData.wind.deg && ` • ${weatherData.wind.deg}°`}
                  </div>
                </div>
              )}
            </div>
          </IonCardContent>
        </IonCard>
      )}

      <HourlyChart hourlyData={hourlyData} />

      <ForecastCard forecastData={forecastData} />

      <IonLoading 
        isOpen={loading || geoLoading} 
        message={geoLoading ? "Obteniendo ubicación..." : "Consultando clima..."} 
        cssClass="custom-loading"
      />
      
      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={error}
        duration={3000}
        color="danger"
      />
    </div>
  );
};

export default WeatherCard;