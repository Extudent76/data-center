import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card } from '@gravity-ui/uikit';
import { TenantData } from '../../types/models';

interface TenantDistributionChartProps {
  tenants: TenantData[];
  totalCount: number;
}

/**
 * Компонент кольцевой диаграммы распределения арендаторов
 * Отображает процентное распределение арендаторов по компаниям
 */
const TenantDistributionChart: React.FC<TenantDistributionChartProps> = ({
  tenants,
  totalCount,
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Палитра цветов для сегментов диаграммы
  const COLORS = [
    '#4CAF50', // Зеленый
    '#2196F3', // Синий
    '#FF9800', // Оранжевый
    '#9C27B0', // Фиолетовый
    '#F44336', // Красный
    '#00BCD4', // Голубой
    '#FFEB3B', // Желтый
    '#795548', // Коричневый
  ];

  // Подготовка данных с расчетом процентов и назначением цветов
  const chartData = tenants.map((tenant, index) => ({
    ...tenant,
    color: COLORS[index % COLORS.length],
  }));

  // Обработчик наведения на сегмент
  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  // Кастомный tooltip для отображения деталей при наведении
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            padding: '12px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            zIndex: 9999,
            position: 'relative',
          }}
        >
          <p style={{ margin: 0, fontWeight: 'bold', fontSize: '14px' }}>
            {data.company}
          </p>
          <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#666' }}>
            Количество накопителей: {data.count}
          </p>
          <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#666' }}>
            Процент: {data.percentage.toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  // Кастомная легенда
  const renderLegend = () => {
    return (
      <div style={{ marginTop: '16px', maxHeight: '120px', overflowY: 'auto' }}>
        {chartData.map((entry, index) => (
          <div
            key={`legend-${index}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '8px',
              fontSize: '12px',
              opacity: activeIndex === null || activeIndex === index ? 1 : 0.5,
              transition: 'opacity 0.3s',
              cursor: 'pointer',
            }}
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <div
              style={{
                width: '12px',
                height: '12px',
                backgroundColor: entry.color,
                marginRight: '8px',
                borderRadius: '2px',
              }}
            />
            <span style={{ flex: 1 }}>
              {entry.company}
            </span>
            <span style={{ fontWeight: 500, marginLeft: '8px' }}>
              {entry.percentage.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card
      style={{
        padding: '20px',
        minHeight: '400px',
        maxWidth: '400px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 500 }}>
        Распределение арендаторов
      </h3>

      <div style={{ position: 'relative', width: '100%', height: '250px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              dataKey="count"
              stroke="none"
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
              animationDuration={500}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  opacity={activeIndex === null || activeIndex === index ? 1 : 0.6}
                  style={{
                    filter: activeIndex === index ? 'brightness(1.1)' : 'none',
                    transition: 'all 0.3s',
                    cursor: 'pointer',
                  }}
                />
              ))}
            </Pie>
            <Tooltip 
              content={<CustomTooltip />} 
              wrapperStyle={{ zIndex: 9999 }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Общее количество арендаторов в центре */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              fontSize: '36px',
              fontWeight: 'bold',
              color: '#333',
              lineHeight: 1,
            }}
          >
            {totalCount}
          </div>
          <div
            style={{
              fontSize: '12px',
              color: '#666',
              marginTop: '4px',
            }}
          >
            арендаторов
          </div>
        </div>
      </div>

      {/* Легенда с компаниями */}
      {renderLegend()}
    </Card>
  );
};

export default TenantDistributionChart;
