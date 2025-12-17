import React from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Legend, CartesianGrid, Tooltip } from 'recharts';
import { Card } from '@gravity-ui/uikit';
import { TemperatureData } from '../../types/models';

interface TemperatureChartProps {
  temperatures?: TemperatureData[] | null;
}

const TemperatureChart: React.FC<TemperatureChartProps> = ({
  temperatures
}) => {
  const prepareChartData = () => {
    if (!temperatures || temperatures.length === 0) {
      return [];
    }

    const sortedTemperatures = [...temperatures].sort((a, b) => 
      new Date(a.timeStamp).getTime() - new Date(b.timeStamp).getTime()
    );

    return sortedTemperatures.map(temp => {
      const date = new Date(temp.timeStamp);
      const time = date.toLocaleTimeString('ru-RU', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });

      return {
        time,
        'Температура спереди (°C)': temp.frontTemperature,
        'Температура сзади (°C)': temp.backTemperature,
        fullTime: date.toLocaleString('ru-RU')
      };
    });
  };

  const data = prepareChartData();

  const getTemperatureRange = () => {
    if (!data || data.length === 0) {
      return { min: 0, max: 100 };
    }

    const allTemps = data.flatMap(item => [
      item['Температура спереди (°C)'],
      item['Температура сзади (°C)']
    ]).filter(temp => temp !== null && temp !== undefined);

    if (allTemps.length === 0) {
      return { min: 0, max: 100 };
    }

    const min = Math.min(...allTemps);
    const max = Math.max(...allTemps);
    const padding = (max - min) * 0.1 || 5; // 10% отступ или минимум 5 градусов

    return {
      min: Math.max(0, Math.floor(min - padding)),
      max: Math.ceil(max + padding)
    };
  };

  // Кастомный tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: 'var(--g-color-base-background, rgba(255, 255, 255, 0.95))',
          padding: '12px',
          border: '1px solid var(--g-color-line-generic, #ccc)',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          fontSize: '12px'
        }}>
          <p style={{ margin: '0 0 8px 0', fontWeight: 'bold', color: '#333' }}>
            Время: {label}
          </p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ 
              margin: '4px 0', 
              color: entry.color,
              fontWeight: '500'
            }}>
              {entry.name}: {entry.value}°C
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (!data || data.length === 0) {
    return (
      <Card style={{ padding: '20px', minHeight: '350px' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '300px',
          color: '#666',
          fontSize: '14px'
        }}>
          Данные о температуре отсутствуют
        </div>
      </Card>
    );
  }

  const tempRange = getTemperatureRange();

  return (
    <Card style={{ padding: '20px', maxHeight: '300px' }}>
      <h3 style={{ 
        margin: '0 0 16px 0', 
        fontSize: '16px', 
        fontWeight: 500,
        color: 'var(--g-color-text-primary, #333)'
      }}>
        График температуры
      </h3>
      <div style={{ width: '100%', height: '300px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            data={data} 
            margin={{ top: 20, right: 30, left: 40, bottom: 60 }}
          >
            {/* Сетка для лучшей читаемости */}
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="var(--g-color-line-generic, #e5e7eb)"
              opacity={0.5}
            />
            
            {/* Ось X (время) */}
            <XAxis 
              dataKey="time" 
              axisLine={{ stroke: 'var(--g-color-line-generic, #d1d5db)', strokeWidth: 1 }}
              tickLine={{ stroke: 'var(--g-color-line-generic, #d1d5db)', strokeWidth: 1 }}
              tick={{ fontSize: 11, fill: 'var(--g-color-text-secondary, #666)' }}
              interval="preserveStartEnd"
              angle={-45}
              textAnchor="end"
              height={60}
            />
            
            {/* Ось Y (температура) */}
            <YAxis 
              domain={[tempRange.min, tempRange.max]}
              axisLine={{ stroke: 'var(--g-color-line-generic, #d1d5db)', strokeWidth: 1 }}
              tickLine={{ stroke: 'var(--g-color-line-generic, #d1d5db)', strokeWidth: 1 }}
              tick={{ fontSize: 11, fill: 'var(--g-color-text-secondary, #666)' }}
              label={{ 
                value: 'Температура (°C)', 
                angle: -90, 
                position: 'insideLeft',
                style: { 
                  textAnchor: 'middle',
                  fontSize: '12px',
                  fill: 'var(--g-color-text-secondary, #666)'
                }
              }}
              tickFormatter={(value) => `${value}°C`}
            />
            
            {/* Tooltip при наведении */}
            <Tooltip content={<CustomTooltip />} />
            
            {/* Легенда */}
            <Legend 
              wrapperStyle={{ 
                paddingTop: '16px',
                fontSize: '12px'
              }}
              iconType="line"
            />
            
            {/* Линия температуры спереди */}
            <Line
              type="monotone"
              dataKey="Температура спереди (°C)"
              stroke="#FF6B9D"
              strokeWidth={2}
              dot={{ fill: '#FF6B9D', strokeWidth: 0, r: 3 }}
              activeDot={{ r: 5, fill: '#FF6B9D', strokeWidth: 2, stroke: '#fff' }}
              connectNulls={false}
            />
            
            {/* Линия температуры сзади */}
            <Line
              type="monotone"
              dataKey="Температура сзади (°C)"
              stroke="#4FC3F7"
              strokeWidth={2}
              dot={{ fill: '#4FC3F7', strokeWidth: 0, r: 3 }}
              activeDot={{ r: 5, fill: '#4FC3F7', strokeWidth: 2, stroke: '#fff' }}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default TemperatureChart;