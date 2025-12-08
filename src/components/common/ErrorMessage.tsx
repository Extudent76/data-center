import React from 'react';
import { Alert } from '@gravity-ui/uikit';
import { AppError, ErrorType } from '../../types/errors';

/**
 * Компонент отображения ошибок
 * Требования: 7.3, 8.5
 */
interface ErrorMessageProps {
  /** Объект ошибки */
  error: AppError | string;
  /** Callback для повторной попытки */
  onRetry?: () => void;
}

/**
 * Получает понятное пользователю сообщение об ошибке
 */
const getErrorMessage = (error: AppError | string): string => {
  if (typeof error === 'string') {
    return error;
  }

  switch (error.type) {
    case ErrorType.NETWORK_ERROR:
      return 'Ошибка сети. Проверьте подключение к интернету.';
    case ErrorType.API_ERROR:
      return error.message || 'Ошибка при получении данных с сервера.';
    case ErrorType.VALIDATION_ERROR:
      return 'Получены некорректные данные. Обратитесь к администратору.';
    case ErrorType.UNKNOWN_ERROR:
    default:
      return error.message || 'Произошла неизвестная ошибка.';
  }
};

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ error, onRetry }) => {
  const message = getErrorMessage(error);

  return (
    <div style={{ padding: '1rem' }}>
      <Alert
        theme="danger"
        title="Ошибка"
        message={message}
        actions={
          onRetry ? (
            <Alert.Action onClick={onRetry}>
              Повторить попытку
            </Alert.Action>
          ) : undefined
        }
      />
    </div>
  );
};
