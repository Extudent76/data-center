import React from 'react';
import { observer } from 'mobx-react-lite';
import { Modal, Button, Table } from '@gravity-ui/uikit';
import { PowerAlertData } from '../../types/models';

interface PowerAlertModalProps {
  isOpen: boolean;
  alerts: PowerAlertData[];
  isLoading: boolean;
  onClose: () => void;
  onEnableBackupPower: () => void;
}

/**
 * Модальное окно с информацией о сбоях питания
 */
const PowerAlertModal: React.FC<PowerAlertModalProps> = observer(({
  isOpen,
  alerts,
  isLoading,
  onClose,
  onEnableBackupPower,
}) => {
  // Форматирование timestamp в читаемый формат
  const formatTimestamp = (): string => {
    const date = new Date();
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  // Колонки таблицы
  const columns = [
    {
      id: 'rackName',
      name: 'Наименование стойки',
    },
    {
      id: 'machineRoomName',
      name: 'Машинный зал',
    },
    {
      id: 'timestamp',
      name: 'Время отключения',
    },
  ];

  // Данные для таблицы
  const data = alerts.map((alert) => ({
    id: alert.rackId.toString(),
    rackName: alert.rackName,
    machineRoomName: alert.machineRoomName,
    timestamp: formatTimestamp(),
  }));

  return (
    <Modal open={isOpen} onClose={onClose}>
      <div style={{ padding: '24px', minWidth: '600px' }}>
        <h2 style={{ 
          margin: '0 0 24px 0', 
          fontSize: '20px', 
          fontWeight: 600,
          color: 'var(--g-color-text-primary, #000)'
        }}>
          Сбой питания
        </h2>

        <div style={{ marginBottom: '24px' }}>
          <p style={{ 
            margin: '0 0 16px 0', 
            fontSize: '14px',
            color: 'var(--g-color-text-secondary, #666)'
          }}>
            Обнаружены проблемы с питанием следующих стоек:
          </p>

          <Table
            data={data}
            columns={columns}
            verticalAlign="middle"
          />
        </div>

        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          justifyContent: 'flex-end' 
        }}>
          <Button
            view="outlined"
            size="l"
            onClick={onClose}
            disabled={isLoading}
          >
            Отмена
          </Button>
          <Button
            view="action"
            size="l"
            onClick={onEnableBackupPower}
            loading={isLoading}
          >
            Включить резервное питание
          </Button>
        </div>
      </div>
    </Modal>
  );
});

export default PowerAlertModal;
