import React, { useEffect, useRef, useState } from 'react';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonSegment,
  IonSegmentButton,
  IonLabel
} from '@ionic/react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { HourlyForecastData } from '../types/weather';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface HourlyChartProps {
  hourlyData: HourlyForecastData | null;
}

const HourlyChart: React.FC<HourlyChartProps> = ({ hourlyData }) => {
  const chartRef = useRef<ChartJS<'line', number[], string>>(null);

  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  if (!hourlyData || !hourlyData.list.length) {
    return null;
  }

  // Target hours: 10am, 1pm, 4pm, 7pm, 10pm, 1am, 4am, 7am (next day)
  const targetHours = [10, 13, 16, 19, 22, 25, 28, 31]; // Using 24+ for next day hours
  
  // Function to find closest forecast for target hour
  const findClosestForecast = (targetHour: number) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Handle hours beyond 24 (next day)
    const actualHour = targetHour > 24 ? targetHour - 24 : targetHour;
    const daysToAdd = targetHour > 24 ? 1 : 0;
    
    const targetDate = new Date(today);
    targetDate.setDate(targetDate.getDate() + daysToAdd);
    targetDate.setHours(actualHour, 0, 0, 0);
    
    // If the target time is in the past for today, move to tomorrow
    if (targetDate.getTime() < now.getTime() && daysToAdd === 0) {
      targetDate.setDate(targetDate.getDate() + 1);
    }
    
    const targetTimestamp = targetDate.getTime() / 1000;
    
    // Find closest forecast to target time
    let closest = hourlyData.list[0];
    let minDiff = Math.abs(closest.dt - targetTimestamp);
    
    for (const forecast of hourlyData.list) {
      const diff = Math.abs(forecast.dt - targetTimestamp);
      if (diff < minDiff) {
        minDiff = diff;
        closest = forecast;
      }
    }
    
    return closest;
  };

  // Get forecasts for specific hours
  const selectedForecasts = targetHours.map(hour => findClosestForecast(hour));

  // Prepare data for chart
  const labels = targetHours.map(hour => {
    // Handle next day hours (25, 28, 31)
    const displayHour = hour > 24 ? hour - 24 : hour;
    
    switch (displayHour) {
      case 1:
        return '1:00 AM';
      case 4:
        return '4:00 AM';
      case 7:
        return '7:00 AM';
      case 10:
        return '10:00 AM';
      case 13:
        return '1:00 PM';
      case 16:
        return '4:00 PM';
      case 19:
        return '7:00 PM';
      case 22:
        return '10:00 PM';
      default:
        return displayHour + ':00';
    }
  });

  const temperatures = selectedForecasts.map(item => Math.round(item.main.temp));
  const feelsLike = selectedForecasts.map(item => Math.round(item.main.feels_like));

  const data = {
    labels,
    datasets: [
      {
        label: 'Temperatura',
        data: temperatures,
        borderColor: '#3880ff',
        backgroundColor: 'rgba(56, 128, 255, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#3880ff',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
      },
      {
        label: 'Sensación térmica',
        data: feelsLike,
        borderColor: '#ff6b6b',
        backgroundColor: 'rgba(255, 107, 107, 0.1)',
        fill: false,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 5,
        pointBackgroundColor: '#ff6b6b',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        borderDash: [5, 5],
      }
    ],
  };

  // Check if dark mode is active
  const isDark = document.body.classList.contains('dark');
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
          },
          color: isDark ? '#ffffff' : '#000000',
        },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#3880ff',
        borderWidth: 1,
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${context.parsed.y}°C`;
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Hora',
          font: {
            weight: 'bold',
          },
          color: isDark ? '#ffffff' : '#000000',
        },
        ticks: {
          color: isDark ? '#ffffff' : '#000000',
        },
        grid: {
          color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(128, 128, 128, 0.2)',
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Temperatura (°C)',
          font: {
            weight: 'bold',
          },
          color: isDark ? '#ffffff' : '#000000',
        },
        ticks: {
          color: isDark ? '#ffffff' : '#000000',
          callback: function(value: any) {
            return value + '°C';
          },
        },
        grid: {
          color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(128, 128, 128, 0.2)',
        },
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
    elements: {
      line: {
        borderWidth: 3,
      },
    },
  };

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Temperatura en Horas Específicas</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <div style={{ height: '300px', position: 'relative' }}>
          <Line ref={chartRef} data={data} options={options} />
        </div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          marginTop: '16px',
          fontSize: '0.85rem',
          color: '#666'
        }}>
          <span>Min: {Math.min(...temperatures)}°C</span>
          <span>Max: {Math.max(...temperatures)}°C</span>
          <span>Promedio: {Math.round(temperatures.reduce((a, b) => a + b) / temperatures.length)}°C</span>
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default HourlyChart;