# Weather App 🌤️

Aplicación móvil híbrida para consultar el clima mundial con funcionalidades avanzadas.

## 📱 Descargar APK

**[⬇️ Descargar Weather App v1.0.0](https://github.com/tunek12421/Actividad5/actions/runs/17155748248/artifacts/3828334043)**

### Instalación en Android:
1. Descarga el archivo ZIP desde el enlace de arriba
2. Descomprime el archivo `weather-app-debug.apk`
3. En Android: Configuración → Seguridad → Permitir "Fuentes desconocidas"
4. Instala el APK
5. ¡Disfruta tu app del clima!

## ✨ Funcionalidades Principales

### 🔍 Búsqueda de Clima
- Busca el clima de cualquier ciudad del mundo
- Resultados en tiempo real con API de OpenWeatherMap
- Manejo de errores para ciudades no encontradas

### 📍 Ubicación Actual
- Presiona el ícono de ubicación para obtener el clima actual
- Solicita permisos de ubicación automáticamente
- GPS integrado con servicios nativos de Android

### 📊 Pronóstico Extendido
- Pronóstico meteorológico de 5 días
- Temperaturas máximas y mínimas
- Descripción detallada del clima

### 🕐 Historial de Búsquedas
- Acceso rápido a ciudades consultadas recientemente
- Chips interactivos para búsquedas frecuentes
- Almacenamiento local automático

### 📋 Información Detallada
- Temperatura y sensación térmica
- Humedad relativa
- Presión atmosférica
- Velocidad y dirección del viento
- Visibilidad actual

### 🌙 Tema Personalizable
- Modo claro y oscuro
- Cambio automático según preferencias del sistema
- Toggle manual en la barra superior
- Configuración persistente

## 🎮 Cómo Usar la App

### Búsqueda Básica
1. Abre la aplicación
2. Escribe el nombre de una ciudad en el campo de búsqueda
3. Presiona "Buscar" o Enter
4. Ve los resultados instantáneamente

### Ubicación Actual  
1. Presiona el ícono 📍 junto al botón de búsqueda
2. Permite permisos de ubicación cuando se solicite
3. Espera mientras se obtiene tu ubicación
4. Ve el clima de tu área automáticamente

### Búsquedas Rápidas
1. Usa los chips de "Búsquedas Recientes" para acceso rápido
2. Elimina ciudades del historial presionando la ✕
3. El historial se guarda automáticamente

### Cambio de Tema
1. Presiona el ícono 🌙/☀️ en la esquina superior derecha
2. Alterna entre modo claro y oscuro
3. La configuración se guarda automáticamente

## 🛠️ Tecnologías Utilizadas

- **Ionic React** - Framework híbrido multiplataforma
- **Capacitor** - Bridge nativo para Android/iOS  
- **TypeScript** - Lenguaje tipado para mayor robustez
- **Vite** - Build tool moderno y rápido
- **OpenWeatherMap API** - Datos meteorológicos precisos
- **CSS Variables** - Theming dinámico
- **LocalStorage** - Persistencia de datos local

## ⚠️ Requisitos del Sistema

- Android 6.0 (API 23) o superior
- Conexión a Internet para consultas de clima
- Permisos de ubicación (opcional, para GPS)
- ~4MB de espacio de almacenamiento

## 🔧 Para Desarrolladores

### Instalación Local
```bash
git clone https://github.com/tunek12421/Actividad5.git
cd Actividad5
npm install
npm start
```

### Generar APK
```bash
npm run build
npx cap sync android
cd android && ./gradlew assembleDebug
```

### API Key
La app incluye una API key funcional. Para usar tu propia key:
1. Registrarse en [OpenWeatherMap](https://openweathermap.org/api)  
2. Editar `src/services/weatherService.ts`
3. Reemplazar la API_KEY existente

## 📞 Soporte

Para reportar bugs o sugerir mejoras:
- **Issues:** [GitHub Issues](https://github.com/tunek12421/Actividad5/issues)
- **Repositorio:** [GitHub Repo](https://github.com/tunek12421/Actividad5)

---

**Desarrollado con ❤️ usando Ionic React y Claude Code**
