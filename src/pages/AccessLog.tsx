import React from 'react';

/**
 * Страница журнала доступа
 * Требования: 4.1
 * 
 * Заглушка для будущей функциональности журнала доступа
 */
const AccessLog: React.FC = () => {
  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Заголовок страницы */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: 600 }}>
          Журнал доступа
        </h1>
        <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
          История входов и действий пользователей в системе
        </p>
      </div>

      {/* Placeholder контент */}
      <div style={{
        backgroundColor: '#f5f5f5',
        border: '2px dashed #ccc',
        borderRadius: '8px',
        padding: '48px 24px',
        textAlign: 'center',
        color: '#999'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
        <h2 style={{ margin: '0 0 8px 0', fontSize: '20px', color: '#666' }}>
          Раздел в разработке
        </h2>
        <p style={{ margin: 0, fontSize: '14px' }}>
          Здесь будет отображаться журнал доступа пользователей к системе
        </p>
      </div>
    </div>
  );
};

AccessLog.displayName = 'AccessLog';

export default AccessLog;
