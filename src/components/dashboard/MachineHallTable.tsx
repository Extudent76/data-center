import React from 'react';
import { observer } from 'mobx-react-lite';
import { Table, Label, Icon } from '@gravity-ui/uikit';
import { ChevronDown, ChevronUp } from '@gravity-ui/icons';
import { RackData } from '../../types/models';

interface MachineHallTableProps {
  hallNumber: number;
  racks: RackData[];
  isExpanded: boolean;
  onToggle: () => void;
}

const MachineHallTable: React.FC<MachineHallTableProps> = observer(({
  hallNumber,
  racks,
  isExpanded,
  onToggle
}) => {
  // Сортировка стоек по идентификатору
  const sortedRacks = [...racks].sort((a, b) => a.id - b.id);

  // Функция для получения цвета и текста статуса питания
  const getPowerStatusProps = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('подключ') || statusLower.includes('включ')) {
      return { theme: 'success' as const, text: status };
    } else if (statusLower.includes('резерв')) {
      return { theme: 'warning' as const, text: status };
    } else if (statusLower.includes('выключ') || statusLower.includes('отключ')) {
      return { theme: 'danger' as const, text: status };
    }
    return { theme: 'normal' as const, text: status };
  };

  // Определение столбцов таблицы
  const columns = [
    {
      id: 'name',
      name: 'Наименование стойки',
      width: 200,
    },
    {
      id: 'powerStatus',
      name: 'Питание',
      width: 150,
    },
    {
      id: 'installedDisks',
      name: 'Занято слотов',
      width: 120,
    },
    {
      id: 'disksCapacity',
      name: 'Доступно слотов',
      width: 140,
    },
    {
      id: 'temperature',
      name: 'Температура стойки / спереди | сзади',
      width: 280,
    },
  ];

  // Формирование данных для таблицы
  const tableData = sortedRacks.map((rack) => {
    const powerStatusProps = getPowerStatusProps(rack.energyStatus);
    
    return {
      id: rack.id.toString(),
      name: rack.name,
      powerStatus: (
        <Label theme={powerStatusProps.theme}>
          {powerStatusProps.text}
        </Label>
      ),
      installedDisks: rack.installedDisksNumber.toString(),
      disksCapacity: rack.disksCapacity.toString(),
      temperature: rack.frontTemperature !== null && rack.backTemperature !== null
        ? `${rack.frontTemperature}°C | ${rack.backTemperature}°C`
        : 'Н/Д',
    };
  });

  return (
    <div style={{ marginBottom: '24px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '12px 16px',
          backgroundColor: 'var(--g-color-base-generic-hover, #f3f3f3)',
          borderRadius: '8px',
          cursor: 'pointer',
          userSelect: 'none',
        }}
        onClick={onToggle}
      >
        <div style={{ marginRight: '8px', display: 'flex', alignItems: 'center' }}>
          <Icon
            data={isExpanded ? ChevronUp : ChevronDown}
            size={20}
          />
        </div>
        <h3 style={{ 
          margin: 0, 
          fontSize: '16px', 
          fontWeight: 600,
          color: 'var(--g-color-text-primary, #000000)'
        }}>
          Машинный зал №{hallNumber}
        </h3>
      </div>

      {isExpanded && (
        <div style={{ marginTop: '16px' }}>
          <Table
            data={tableData}
            columns={columns}
            verticalAlign="middle"
          />
        </div>
      )}
    </div>
  );
});

MachineHallTable.displayName = 'MachineHallTable';

export default MachineHallTable;
