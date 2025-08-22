import React, { useEffect, useRef } from 'react';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle
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

  // Get next 24 hours of data (8 data points, each 3 hours apart)
  const next24Hours = hourlyData.list.slice(0, 8);

  // Prepare data for chart
  const labels = next24Hours.map(item => {
    const date = new Date(item.dt * 1000);
    return date.getHours() + ':00';
  });

  const temperatures = next24Hours.map(item => Math.round(item.main.temp));
  const feelsLike = next24Hours.map(item => Math.round(item.main.feels_like));

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
        <IonCardTitle>Temperatura por Horas (Próximas 24h)</IonCardTitle>
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