# Weather App MVP

Aplicación móvil híbrida que consume la API de OpenWeatherMap para mostrar información del clima.

## Funcionalidades

✅ Consumo de API externa (OpenWeatherMap)  
✅ Petición HTTP con manejo de respuesta JSON  
✅ Interfaz para ingresar ciudad  
✅ Visualización de temperatura y descripción del clima  
✅ Manejo de errores (ciudad no encontrada, errores de red)  

## Configuración

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar API Key:**
   - Registrarse en [OpenWeatherMap](https://openweathermap.org/api)
   - Reemplazar `demo_key` en `src/services/weatherService.ts` con tu API key

3. **Ejecutar la aplicación:**
   ```bash
   npm start
   ```

## Estructura del Proyecto

```
src/
├── components/
│   └── WeatherCard.tsx      # Componente principal con UI
├── services/
│   └── weatherService.ts    # Servicio para API calls
├── types/
│   └── weather.ts          # Tipos TypeScript
├── App.tsx                 # Componente raíz
└── main.tsx               # Punto de entrada
```

## Tecnologías

- **Ionic React** - Framework híbrido
- **TypeScript** - Tipado estático
- **Vite** - Build tool
- **OpenWeatherMap API** - Datos meteorológicos

## Uso

1. Ingresa el nombre de una ciudad
2. Presiona "Buscar Clima"
3. Ve la temperatura actual y descripción del clima
4. Los errores se muestran en toast notifications# Actividad5
