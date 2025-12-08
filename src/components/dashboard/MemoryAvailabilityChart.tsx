import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card } from '@gravity-ui/uikit';

interface MemoryAvailabilityChartProps {
  hallNumber: number;
  percentage: number;
  isWarning: boolean;
}

/**
 * Компонент круговой диаграммы доступности памяти для машинного зала
 * Отображает процент доступной памяти с цветовым индикатором
 */
const MemoryAvailabilityChart: React.FC<MemoryAvailabilityChartProps> = ({
  hallNumber,
  percentage,
  isWarning,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Данные для круговой диаграммы
  const data = [
    { name: 'Занято', value: percentage },
    { name: 'Доступно', value: 100 - percentage },
  ];

  // Цвета для диаграммы: зеленый для нормального состояния, оранжевый для предупреждения
  const COLORS = {
    normal: 'var(--g-color-text-positive, #4CAF50)',
    warning: '#FF9800',
    background: 'var(--g-color-base-generic-hover, #E0E0E0)',
  };

  const primaryColor = isWarning ? COLORS.warning : COLORS.normal;

  // Кастомный tooltip для отображения деталей при наведении
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: 'var(--g-color-base-background, rgba(255, 255, 255, 0.95))',
            padding: '10px',
            border: '1px solid var(--g-color-line-generic, #ccc)',
            borderRadius: '4px',
            zIndex: 9999,
            position: 'relative',
          }}
        >
          <p style={{ 
            margin: 0, 
            fontWeight: 'bold', 
            fontSize: '14px',
            color: 'var(--g-color-text-primary, #000000)'
          }}>
            {payload[0].name}: {payload[0].value}%
          </p>
          <p style={{ 
            margin: '4px 0 0 0', 
            fontSize: '12px', 
            color: 'var(--g-color-text-secondary, #666)'
          }}>
            Машинный зал №{hallNumber}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transition: 'transform 0.2s, box-shadow 0.2s',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        cursor: 'pointer',
      }}
    >
      <Card
        style={{
          padding: '20px',
          textAlign: 'center',
          minHeight: '280px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: isHovered
            ? '0 8px 16px rgba(0,0,0,0.15)'
            : '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
      <h3 style={{ 
        margin: '0 0 16px 0', 
        fontSize: '16px', 
        fontWeight: 500,
        color: 'var(--g-color-text-primary, #000000)'
      }}>
        Машинный зал №{hallNumber}
      </h3>

      <div style={{ position: 'relative', width: '100%', height: '200px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={isHovered ? 85 : 80}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              stroke="none"
              animationDuration={300}
            >
              <Cell fill={primaryColor} />
              <Cell fill={COLORS.background} />
            </Pie>
            <Tooltip 
              content={<CustomTooltip />} 
              wrapperStyle={{ zIndex: 9999 }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Процент в центре диаграммы */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: primaryColor,
              lineHeight: 1,
            }}
          >
            {percentage}%
          </div>
          <div
            style={{
              fontSize: '12px',
              color: 'var(--g-color-text-secondary, #666)',
              marginTop: '4px',
            }}
          >
            Занято
          </div>
        </div>
      </div>

      {/* Дополнительная информация */}
      <div
        style={{
          fontSize: '12px',
          color: 'var(--g-color-text-hint, #999)',
          marginTop: '8px',
          minHeight: '20px',
        }}
      >
        {isWarning && (
          <span style={{ color: COLORS.warning, fontWeight: 500 }}>
            ⚠ Низкая доступность памяти
          </span>
        )}
        {isHovered && !isWarning && (
          <span style={{ color: 'var(--g-color-text-secondary, #666)' }}>
            Доступно: {100 - percentage}%
          </span>
        )}
      </div>
      </Card>
    </div>
  );
};

export default MemoryAvailabilityChart;
