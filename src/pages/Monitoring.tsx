import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Select, Card } from '@gravity-ui/uikit';
import { rootStore } from '../stores/RootStore';
import { DiskUsageChart, TemperatureChart } from '../components/monitoring';
import { LoadingSpinner, ErrorMessage } from '../components/common';

const Monitoring: React.FC = observer(() => {
  const { monitoringStore } = rootStore;

  useEffect(() => {
    monitoringStore.fetchMonitoringSettings();
  }, [monitoringStore]);

  const handleSearch = () => {
    monitoringStore.fetchMonitoringData();
  };

  const rackOptions = monitoringStore.allRacks.map(rack => ({
    value: rack.rackId.toString(),
    content: rack.rackName,
  }));

  const diskOptions = monitoringStore.availableDisks.map(disk => ({
    value: disk.diskId.toString(),
    content: disk.diskName,
  }));

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Заголовок страницы */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: 600 }}>
          Мониторинг оборудования
        </h1>
        <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
          Укажите параметры для исследования
        </p>
      </div>

      {/* Форма выбора параметров */}
      <Card style={{ padding: '24px', marginBottom: '24px' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr auto', 
          gap: '16px', 
          alignItems: 'end' 
        }}>
          {/* Селектор стойки */}
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontSize: '14px', 
              fontWeight: 500 
            }}>
              Стойка
            </label>
            <Select
              placeholder="Стойка №1"
              value={monitoringStore.selectedRackId ? [monitoringStore.selectedRackId.toString()] : []}
              options={rackOptions}
              onUpdate={(values) => {
                const rackId = values.length > 0 ? parseInt(values[0]) : null;
                monitoringStore.setSelectedRack(rackId);
              }}
              disabled={monitoringStore.isLoadingSettings}
              size="l"
            />
          </div>

          {/* Селектор диска */}
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontSize: '14px', 
              fontWeight: 500 
            }}>
              Накопитель
            </label>
            <Select
              placeholder="Накопитель"
              value={monitoringStore.selectedDiskId ? [monitoringStore.selectedDiskId.toString()] : []}
              options={diskOptions}
              onUpdate={(values) => {
                const diskId = values.length > 0 ? parseInt(values[0]) : null;
                monitoringStore.setSelectedDisk(diskId);
              }}
              disabled={!monitoringStore.selectedRackId || monitoringStore.isLoadingSettings}
              size="l"
            />
          </div>

          {/* Кнопка поиска */}
          <Button
            view="action"
            size="l"
            onClick={handleSearch}
            disabled={!monitoringStore.canSearch}
            loading={monitoringStore.isLoadingData}
            style={{ minWidth: '120px' }}
          >
            Найти
          </Button>
        </div>
      </Card>

      {/* Отображение ошибки */}
      {monitoringStore.error && (
        <ErrorMessage 
          error={monitoringStore.error} 
          onRetry={() => monitoringStore.clearError()} 
        />
      )}

      {/* Индикатор загрузки настроек */}
      {monitoringStore.isLoadingSettings && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
          <LoadingSpinner />
        </div>
      )}

      {/* Результаты мониторинга */}
      {monitoringStore.monitoringData && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Информация о стойке */}
          <div>
            <h2 style={{ margin: '0 0 16px 0', fontSize: '20px', fontWeight: 600 }}>
              Информация о стойке
            </h2>
            
            <Card style={{ padding: '20px', marginBottom: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>
                    Текущая температура спереди
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 500 }}>
                    {monitoringStore.monitoringData.rack.frontTemperature ?? 'Н/Д'}
                    {monitoringStore.monitoringData.rack.frontTemperature ? '°C' : ''}
                  </div>
                </div>
                
                <div>
                  <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>
                    Текущая температура сзади
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 500 }}>
                    {monitoringStore.monitoringData.rack.backTemperature ?? 'Н/Д'}
                    {monitoringStore.monitoringData.rack.backTemperature ? '°C' : ''}
                  </div>
                </div>
                
                <div>
                  <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>
                    Количество слотов для дисков
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 500 }}>
                    {monitoringStore.monitoringData.rack.disksCapacity}
                  </div>
                </div>
                
                <div>
                  <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>
                    Количество занятых слотов
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 500 }}>
                    {Math.floor(monitoringStore.monitoringData.rack.disksCapacity - 2)}
                  </div>
                </div>
                
                <div style={{ gridColumn: '1 / -1' }}>
                  <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>
                    Питание
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 500 }}>
                    {monitoringStore.monitoringData.rack.energyStatus}
                  </div>
                </div>
              </div>
            </Card>

            {/* График температуры */}
            <TemperatureChart 
              temperatures={monitoringStore.monitoringData.temperatures}
            />
          </div>

          {/* Информация о накопителе */}
          <div>
            <h2 style={{ margin: '0 0 16px 0', fontSize: '20px', fontWeight: 600 }}>
              Информация о накопителе
            </h2>
            
            <Card style={{ padding: '20px', marginBottom: '16px', height: '195px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>
                    Модель
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 500 }}>
                    {monitoringStore.monitoringData.disk.name}
                  </div>
                </div>
                
                <div>
                  <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>
                    Объем накопителя
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 500 }}>
                    {monitoringStore.monitoringData.disk.fullVolume} ГБ
                  </div>
                </div>
                
                <div>
                  <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>
                    Доступный объем
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 500 }}>
                    {monitoringStore.monitoringData.disk.usedVolume} ГБ
                  </div>
                </div>
                
                <div>
                  <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>
                    Компания арендатор
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 500 }}>
                    {monitoringStore.monitoringData.disk.rentalCompanyName}
                  </div>
                </div>
              </div>
            </Card>

            {/* Диаграмма использования диска */}
            <DiskUsageChart 
              percentage={monitoringStore.monitoringData.percentOfMemoryDiskUsage}
            />
          </div>
        </div>
      )}
    </div>
  );
});

Monitoring.displayName = 'Monitoring';

export default Monitoring;
