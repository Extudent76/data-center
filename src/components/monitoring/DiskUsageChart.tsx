import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Card } from '@gravity-ui/uikit';

interface DiskUsageChartProps {
  percentage: number;
  title?: string;
}

const DiskUsageChart: React.FC<DiskUsageChartProps> = ({
  percentage,
  title = "Использование памяти"
}) => {
  // Данные для круговой диаграммы
  const data = [
    { name: 'Занято', value: percentage },
    { name: 'Свободно', value: 100 - percentage },
  ];


  const COLORS = {
    used: '#9C27B0',
    free: '#E3F2FD',
  };

  return (
    <Card style={{ padding: '20px', minHeight: '300px' }}>
      <h3 style={{ 
        margin: '0 0 16px 0', 
        fontSize: '16px', 
        fontWeight: 500,
        color: 'var(--g-color-text-primary, #000)'
      }}>
        {title}
      </h3>

      <div style={{ position: 'relative', width: '100%', height: '200px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              stroke="none"
            >
              <Cell fill={COLORS.used} />
              <Cell fill={COLORS.free} />
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Процент в центре диаграммы */}
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
              fontSize: '32px',
              fontWeight: 'bold',
              color: COLORS.used,
              lineHeight: 1,
            }}
          >
            {Math.round(percentage)}%
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
    </Card>
  );
};

export default DiskUsageChart;