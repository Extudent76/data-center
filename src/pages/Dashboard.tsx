import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { rootStore } from '../stores/RootStore';
import MemoryAvailabilityChart from '../components/dashboard/MemoryAvailabilityChart';
import TenantDistributionChart from '../components/dashboard/TenantDistributionChart';
import MachineHallTable from '../components/dashboard/MachineHallTable';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';

/**
 * Главная страница Dashboard с обзорной информацией о дата-центре
 * Требования: 1.1, 2.1, 3.1, 6.4, 8.5, 10.1, 10.3, 10.4, 10.5
 */
const Dashboard: React.FC = observer(() => {
  const { dashboardStore } = rootStore;

  // Загрузка данных при монтировании компонента и запуск polling
  useEffect(() => {
    dashboardStore.startPolling();

    // Остановка polling при размонтировании компонента
    return () => {
      dashboardStore.stopPolling();
    };
  }, [dashboardStore]);

  // Обработчик переключения раскрытия таблицы машинного зала
  const handleToggleHall = (hallId: number) => {
    const hall = dashboardStore.machineHalls.find(h => h.id === hallId);
    if (hall) {
      dashboardStore.setExpandedHall(hallId, !hall.isExpanded);
    }
  };

  // Обработчик повторной попытки загрузки данных
  const handleRetry = () => {
    dashboardStore.fetchDashboardData();
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Заголовок страницы */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ 
          margin: '0 0 8px 0', 
          fontSize: '28px', 
          fontWeight: 600,
          color: 'var(--g-color-text-primary, #000000)'
        }}>
          Сводка
        </h1>

        <h2 style={{ 
          margin: '16px 0 8px 0', 
          fontSize: '20px', 
          fontWeight: 400,
          color: 'grey'
        }}>
          Информация о работе оборудования
        </h2>

        
        {/* Временная метка последнего обновления */}
        {dashboardStore.lastUpdated && (
          <div style={{ 
            fontSize: '14px', 
            color: dashboardStore.error 
              ? 'var(--g-color-text-warning, #FF9800)' 
              : 'var(--g-color-text-secondary, #666)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            {dashboardStore.error && (
              <span style={{ color: 'var(--g-color-text-warning, #FF9800)' }}>
                ⚠ Данные могут быть устаревшими
              </span>
            )}
          </div>
        )}
      </div>

      {/* Отображение ошибки */}
      {dashboardStore.error && (
        <div style={{ marginBottom: '24px' }}>
          <ErrorMessage 
            error={dashboardStore.error} 
            onRetry={handleRetry}
          />
        </div>
      )}

      {/* Индикатор загрузки при первой загрузке */}
      {dashboardStore.isLoading && dashboardStore.machineHalls.length === 0 ? (
        <LoadingSpinner size="l" message="Загрузка данных панели управления..." />
      ) : (
        <>
          {/* Секция диаграмм доступности памяти */}
          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ 
              margin: '0 0 16px 0', 
              fontSize: '20px', 
              fontWeight: 500,
              color: 'var(--g-color-text-primary, #333)'
            }}>
              Доступность памяти
            </h2>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px'
            }}>
              {dashboardStore.machineHalls.map((hall) => (
                console.log(hall.id),
                <MemoryAvailabilityChart
                  key={hall.id}
                  hallNumber={hall.id}
                  percentage={hall.memoryAvailability}
                  isWarning={hall.memoryAvailability > 80}
                />
              ))}
            </div>
          </section>

          {/* Секция диаграммы распределения арендаторов */}
          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ 
              margin: '0 0 16px 0', 
              fontSize: '20px', 
              fontWeight: 500,
              color: 'var(--g-color-text-primary, #333)'
            }}>
              Распределение арендаторов
            </h2>
            <div style={{ maxWidth: '600px' }}>
              <TenantDistributionChart
                tenants={dashboardStore.tenants}
                totalCount={dashboardStore.totalTenants}
              />
            </div>
          </section>

          {/* Секция таблиц машинных залов */}
          <section>
            <h2 style={{ 
              margin: '0 0 16px 0', 
              fontSize: '20px', 
              fontWeight: 500,
              color: 'var(--g-color-text-primary, #333)'
            }}>
              Детальная информация о стойках
            </h2>
            {dashboardStore.machineHalls.map((hall) => (
              <MachineHallTable
                key={hall.id}
                hallNumber={hall.id}
                racks={hall.racks}
                isExpanded={hall.isExpanded}
                onToggle={() => handleToggleHall(hall.id)}
              />
            ))}
          </section>

          {/* Индикатор фоновой загрузки */}
          {dashboardStore.isLoading && dashboardStore.machineHalls.length > 0 && (
            <div style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              backgroundColor: 'var(--g-color-base-background, rgba(255, 255, 255, 0.95))',
              padding: '12px 16px',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              color: 'var(--g-color-text-secondary, #666)',
              border: '1px solid var(--g-color-line-generic, #e5e7eb)'
            }}>
              <LoadingSpinner size="s" message="" />
              <span>Обновление данных...</span>
            </div>
          )}
        </>
      )}
    </div>
  );
});

Dashboard.displayName = 'Dashboard';

export default Dashboard;
