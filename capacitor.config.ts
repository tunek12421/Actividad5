import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tunek.weatherapp',
  appName: 'Weather App',
  webDir: 'dist',
  android: {
    allowMixedContent: true,
    captureInput: true
  }
};

export default config;
