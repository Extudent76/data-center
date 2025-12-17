import React from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Select, Card } from '@gravity-ui/uikit';
import { rootStore } from '../stores/RootStore';
import { AccessLogList } from '../components/access-log';
import { LoadingSpinner, ErrorMessage } from '../components/common';


const AccessLog: React.FC = observer(() => {
  const { accessLogStore } = rootStore;

  const handleSearch = () => {
    accessLogStore.fetchAccessLogs();
  };

  const machineRoomOptions = accessLogStore.machineRooms.map(room => ({
    value: room.id.toString(),
    content: room.name,
  }));

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Заголовок страницы */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: 600 }}>
          Журнал доступа к системе
        </h1>
        <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
          Просмотр журнала записей
        </p>
      </div>

      {/* Форма выбора параметров */}
      <Card style={{ padding: '24px', marginBottom: '24px' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr auto', 
          gap: '16px', 
          alignItems: 'end' 
        }}>
          {/* Селектор машинного зала */}
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontSize: '14px', 
              fontWeight: 500 
            }}>
              Машинный зал
            </label>
            <Select
              placeholder="Машинный зал №1"
              value={accessLogStore.selectedMachineRoomId ? [accessLogStore.selectedMachineRoomId.toString()] : []}
              options={machineRoomOptions}
              onUpdate={(values) => {
                const machineRoomId = values.length > 0 ? parseInt(values[0]) : null;
                accessLogStore.setSelectedMachineRoom(machineRoomId);
              }}
              size="l"
            />
          </div>

          {/* Кнопка поиска */}
          <Button
            view="action"
            size="l"
            onClick={handleSearch}
            disabled={!accessLogStore.canSearch}
            loading={accessLogStore.isLoading}
            style={{ minWidth: '120px' }}
          >
            Найти
          </Button>
        </div>
      </Card>

      {/* Отображение ошибки */}
      {accessLogStore.error && (
        <ErrorMessage 
          error={accessLogStore.error} 
          onRetry={() => accessLogStore.clearError()} 
        />
      )}

      {/* Индикатор загрузки */}
      {accessLogStore.isLoading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
          <LoadingSpinner message="Загрузка журнала доступа..." />
        </div>
      )}

      {/* Результаты поиска */}
      {!accessLogStore.isLoading && accessLogStore.logs.length > 0 && (
        <div>
          <h2 style={{ 
            margin: '0 0 16px 0', 
            fontSize: '20px', 
            fontWeight: 600,
            color: 'var(--g-color-text-primary, #333)'
          }}>
            Записи журнала доступа ({accessLogStore.logs.length})
          </h2>
          <AccessLogList logs={accessLogStore.logs} />
        </div>
      )}

      {/* Сообщение о том, что поиск не выполнялся */}
      {!accessLogStore.isLoading && accessLogStore.logs.length === 0 && !accessLogStore.error && accessLogStore.selectedMachineRoomId && (
        <Card style={{ padding: '24px', textAlign: 'center' }}>
          <div style={{ color: '#666', fontSize: '14px' }}>
            Записи журнала доступа не найдены для выбранного машинного зала
          </div>
        </Card>
      )}
    </div>
  );
});

AccessLog.displayName = 'AccessLog';

export default AccessLog;
