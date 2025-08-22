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
import { search, thermometer, water, location, sunny, rainy, cloudy, snow, thunderstorm, partlySunny, eye, speedometer, navigate } from 'ionicons/icons';
import { WeatherService } from '../services/weatherService';
import { WeatherData, ForecastData } from '../types/weather';
import ForecastCard from './ForecastCard';
import RecentSearches from './RecentSearches';
import { Geolocation } from '@capacitor/geolocation';

const WeatherCard: React.FC = () => {
  const [city, setCity] = useState<string>('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
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

    try {
      const [weatherData, forecastData] = await Promise.all([
        WeatherService.getWeatherByCity(city),
        WeatherService.getForecastByCity(city)
      ]);
      setWeatherData(weatherData);
      setForecastData(forecastData);
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
      // Check permissions first
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

      // Get current position using Capacitor Geolocation
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
      });

      const { latitude, longitude } = position.coords;
      const data = await WeatherService.getWeatherByCoords(latitude, longitude);
      setWeatherData(data);
      setCity(data.name);
      addToRecentSearches(data.name);
      
      // Get forecast for the located city
      try {
        const forecast = await WeatherService.getForecastByCity(data.name);
        setForecastData(forecast);
      } catch (forecastErr) {
        console.warn('Could not get forecast for current location');
      }
    } catch (err) {
      console.error('Geolocation error:', err);
      setError('Error al obtener la ubicación. Verifica que el GPS esté activado.');
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

    try {
      const [weatherData, forecastData] = await Promise.all([
        WeatherService.getWeatherByCity(cityName),
        WeatherService.getForecastByCity(cityName)
      ]);
      setWeatherData(weatherData);
      setForecastData(forecastData);
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
                <IonIcon icon={getWeatherIcon(weatherData.weather[0].main)} style={{ color: '#3880ff' }} />
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