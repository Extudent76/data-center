import React from 'react';
import { Card, Label } from '@gravity-ui/uikit';
import { AccessLogEntry } from '../../types/models';

interface AccessLogListProps {
  logs: AccessLogEntry[];
}

/**
 * Компонент списка записей журнала доступа
 */
const AccessLogList: React.FC<AccessLogListProps> = ({ logs }) => {
  // Функция для получения цвета статуса доступа
  const getAccessResultTheme = (result: string) => {
    return result === 'success' ? 'success' : 'danger';
  };

  // Функция для получения текста статуса доступа
  const getAccessResultText = (result: string) => {
    return result === 'success' ? 'Успешно' : 'Отказано';
  };

  // Функция для получения текста типа аутентификации
  const getAuthTypeText = (authType: string) => {
    return authType === 'fingerprint' ? 'Отпечаток пальца' : 'Карта доступа';
  };

  // Функция для форматирования даты
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  if (logs.length === 0) {
    return (
      <Card style={{ padding: '24px', textAlign: 'center' }}>
        <div style={{ color: '#666', fontSize: '14px' }}>
          Записи журнала доступа не найдены
        </div>
      </Card>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {logs.map((log, index) => (
        <Card key={`${log.employeeId}-${log.timestamp}-${index}`} style={{ padding: '16px' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr auto', 
            gap: '16px',
            alignItems: 'start'
          }}>
            {/* Основная информация */}
            <div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                marginBottom: '8px'
              }}>
                <div style={{ 
                  fontSize: '16px', 
                  fontWeight: 500,
                  color: 'var(--g-color-text-primary, #333)'
                }}>
                  {log.employeeName}
                </div>
                <Label theme={getAccessResultTheme(log.accessResult)}>
                  {getAccessResultText(log.accessResult)}
                </Label>
              </div>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '12px',
                fontSize: '14px',
                color: 'var(--g-color-text-secondary, #666)'
              }}>
                <div>
                  <span style={{ fontWeight: 500 }}>ID сотрудника:</span> {log.employeeId}
                </div>
                <div>
                  <span style={{ fontWeight: 500 }}>Тип аутентификации: </span>
                    <div>
                      {getAuthTypeText(log.authType)}
                    </div> 
                </div>
                <div>
                  <span style={{ fontWeight: 500 }}>Машинный зал:</span> №{log.machineRoomId}
                </div>
                <div>
                  <span style={{ fontWeight: 500 }}>Стойка:</span> №{log.rackId}
                </div>
              </div>
            </div>

            {/* Время доступа */}
            <div style={{ 
              textAlign: 'right',
              fontSize: '14px',
              color: 'var(--g-color-text-secondary, #666)'
            }}>
              <div style={{ fontWeight: 500, marginBottom: '4px' }}>
                Время доступа:
              </div>
              <div style={{ 
                fontFamily: 'monospace',
                fontSize: '13px',
                color: 'var(--g-color-text-primary, #333)'
              }}>
                {formatTimestamp(log.timestamp)}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default AccessLogList;