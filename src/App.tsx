import React, { useState, useEffect } from 'react';
import {
  IonApp,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonIcon,
  setupIonicReact
} from '@ionic/react';
import { moon, sunny } from 'ionicons/icons';
import WeatherCard from './components/WeatherCard';

import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import './theme.css';

setupIonicReact();

const App: React.FC = () => {
  const [isDark, setIsDark] = useState(false);

  // Load theme preference from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('weather-app-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const useDark = savedTheme ? savedTheme === 'dark' : prefersDark;
    
    setIsDark(useDark);
    document.body.classList.toggle('dark', useDark);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    document.body.classList.toggle('dark', newTheme);
    localStorage.setItem('weather-app-theme', newTheme ? 'dark' : 'light');
  };

  return (
  <IonApp>
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Weather App</IonTitle>
          <IonButton 
            fill="clear" 
            slot="end" 
            onClick={toggleTheme}
          >
            <IonIcon icon={isDark ? sunny : moon} />
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <WeatherCard />
      </IonContent>
    </IonPage>
  </IonApp>
  );
};

export default App;