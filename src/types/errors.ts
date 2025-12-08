/**
 * Типы ошибок для системы мониторинга дата-центра
 */

/**
 * Перечисление типов ошибок
 */
export enum ErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  API_ERROR = 'API_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

/**
 * Интерфейс ошибки приложения
 */
export interface AppError {
  type: ErrorType;
  message: string;
  details?: any;
  timestamp: Date;
}
