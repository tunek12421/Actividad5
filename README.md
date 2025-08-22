# Weather App - Actividad 5

Aplicación móvil híbrida que consume la API de OpenWeatherMap para mostrar información meteorológica. Proyecto desarrollado como parte de la actividad académica para demostrar el consumo de APIs externas y manejo de datos JSON en aplicaciones móviles.

## Objetivo de la Actividad

Desarrollar una aplicación que se conecte a una API externa pública, realice peticiones HTTP y muestre los datos en la interfaz de usuario.

## Acceso a la Aplicación

### Web Application (Vercel)
**[Probar en navegador](https://actividad5-opal.vercel.app/)**

### Android APK
**[Descargar APK](https://github.com/tunek12421/Actividad5/actions/runs/17156354665/artifacts/3828527552)**

#### Instalación en Android:
1. Descargar el archivo ZIP desde el enlace
2. Extraer el archivo `weather-app-debug.apk`
3. Configurar Android: Ajustes > Seguridad > Permitir "Fuentes desconocidas"
4. Instalar el APK
5. Ejecutar la aplicación

## Cumplimiento de Requisitos

### Consumo de API Externa
- Integración con OpenWeatherMap API para obtener datos meteorológicos
- Peticiones HTTP realizadas mediante fetch API
- Manejo de respuestas JSON estructuradas

### Interfaz de Usuario
- Campo de entrada para nombre de ciudad
- Botón de búsqueda para ejecutar consultas
- Visualización de temperatura actual
- Descripción textual de condiciones climáticas

### Manejo de Errores
- Validación de ciudades no encontradas
- Manejo de errores de conectividad
- Notificaciones de error mediante toast messages
- Validación de campos vacíos

## Funcionalidades Implementadas

### Funcionalidades Requeridas
- **Búsqueda por ciudad**: Permite ingresar nombre de ciudad y obtener datos climáticos
- **Visualización de datos**: Muestra temperatura y descripción del clima
- **Manejo de errores**: Implementa casos de error para ciudades inexistentes y problemas de red

### Funcionalidades Adicionales
- **Geolocalización**: Obtención de clima basado en ubicación GPS del dispositivo
- **Pronóstico extendido**: Datos meteorológicos de 5 días
- **Historial de búsquedas**: Almacenamiento local de consultas recientes
- **Información detallada**: Humedad, presión atmosférica, velocidad del viento, visibilidad
- **Temas dinámicos**: Modo claro y oscuro con persistencia de configuración

## Instrucciones de Uso

### Búsqueda Básica de Clima
1. Ejecutar la aplicación
2. Ingresar nombre de ciudad en el campo de texto
3. Presionar botón "Buscar" o tecla Enter
4. Visualizar temperatura y descripción del clima

### Funcionalidades Avanzadas
1. **Ubicación GPS**: Presionar icono de ubicación para obtener clima local
2. **Historial**: Seleccionar ciudades recientes desde los chips superiores
3. **Pronóstico**: Revisar datos meteorológicos de los próximos 5 días
4. **Temas**: Alternar entre modo claro y oscuro usando el icono superior

## Tecnologías Implementadas

### Framework y Lenguajes
- **Ionic React**: Framework híbrido para aplicaciones móviles multiplataforma
- **TypeScript**: Lenguaje de programación tipado para desarrollo robusto
- **HTML/CSS**: Estructura y estilos de la interfaz de usuario

### Herramientas de Desarrollo
- **Vite**: Build tool para compilación y optimización
- **Capacitor**: Plataforma para deployment nativo en Android/iOS
- **Node.js**: Entorno de ejecución para desarrollo

### APIs y Servicios
- **OpenWeatherMap API**: Servicio externo para datos meteorológicos
- **Fetch API**: Cliente HTTP para peticiones a servicios web
- **Geolocation API**: Servicios de ubicación GPS del dispositivo

### Almacenamiento y Estado
- **LocalStorage**: Persistencia de datos en el cliente
- **React Hooks**: Manejo de estado y efectos en componentes

## Requisitos del Sistema

### Para Ejecución Web
- Navegador web moderno con soporte ES2020
- Conexión a Internet activa

### Para Android APK
- Android 6.0 (API Level 23) o superior
- Conexión a Internet para consultas meteorológicas
- Permisos de ubicación (opcional para GPS)
- Aproximadamente 4MB de espacio libre

## Información Técnica

### Instalación para Desarrollo
```bash
git clone https://github.com/tunek12421/Actividad5.git
cd Actividad5
npm install
npm start
```

### Compilación de APK
```bash
npm run build
npx cap sync android
cd android && ./gradlew assembleDebug
```

### Configuración de API
La aplicación incluye una API key funcional de OpenWeatherMap. Para configurar una clave personalizada:
1. Registrarse en OpenWeatherMap API
2. Editar el archivo `src/services/weatherService.ts`
3. Reemplazar la variable API_KEY con la clave personal

## Estructura del Proyecto

```
src/
├── components/
│   ├── WeatherCard.tsx         # Componente principal de búsqueda
│   ├── ForecastCard.tsx        # Componente de pronóstico extendido
│   └── RecentSearches.tsx      # Componente de historial de búsquedas
├── services/
│   └── weatherService.ts       # Servicio para consumo de API
├── types/
│   └── weather.ts              # Definiciones TypeScript
├── App.tsx                     # Componente raíz de la aplicación
└── main.tsx                    # Punto de entrada principal
```

## Recursos de Soporte

- **Repositorio GitHub**: [https://github.com/tunek12421/Actividad5](https://github.com/tunek12421/Actividad5)
- **Aplicación Web**: [https://actividad5-opal.vercel.app/](https://actividad5-opal.vercel.app/)
- **Issues y Bugs**: [GitHub Issues](https://github.com/tunek12421/Actividad5/issues)
