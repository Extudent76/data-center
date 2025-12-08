import React from 'react';
import { Loader } from '@gravity-ui/uikit';

/**
 * Компонент индикатора загрузки
 * Требования: 7.3, 8.5
 */
interface LoadingSpinnerProps {
  /** Размер спиннера */
  size?: 's' | 'm' | 'l';
  /** Текст сообщения о загрузке */
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'm', 
  message = 'Загрузка...' 
}) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      gap: '1rem'
    }}>
      <Loader size={size} />
      {message && (
        <div style={{
          color: 'var(--g-color-text-secondary)',
          fontSize: '14px'
        }}>
          {message}
        </div>
      )}
    </div>
  );
};
