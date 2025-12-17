/**
 * API клиент для взаимодействия с бэкенд сервером
 */

import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
import { ErrorType, AppError } from '../types/errors';

/**
 * Конфигурация для retry логики
 */
interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
}

/**
 * Класс API клиента с поддержкой retry логики и обработки ошибок
 */
export class ApiClient {
  private axiosInstance: AxiosInstance;
  private authToken: string | null = null;
  private retryConfig: RetryConfig = {
    maxRetries: 3,
    baseDelay: 1000, // 1 секунда
  };

  /**
   * Создает экземпляр API клиента
   * @param baseURL - Базовый URL для API запросов
   */
  constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Добавляем interceptor для автоматического добавления токена аутентификации
    this.axiosInstance.interceptors.request.use((config) => {
      if (this.authToken) {
        config.headers.Authorization = `Bearer ${this.authToken}`;
      }
      return config;
    });
  }

  /**
   * Устанавливает токен аутентификации
   * @param token - JWT токен или другой токен аутентификации
   */
  setAuthToken(token: string): void {
    this.authToken = token;
  }

  /**
   * Удаляет токен аутентификации
   */
  clearAuthToken(): void {
    this.authToken = null;
  }

  /**
   * Выполняет GET запрос
   * @param endpoint - Путь эндпоинта или полный URL
   * @returns Promise с типизированными данными
   */
  async get<T>(endpoint: string): Promise<T> {
    return this.retryRequest(() => this.request<T>('GET', endpoint));
  }

  /**
   * Выполняет POST запрос
   * @param endpoint - Путь эндпоинта
   * @param data - Данные для отправки
   * @returns Promise с типизированными данными
   */
  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.retryRequest(() => this.request<T>('POST', endpoint, data));
  }

  /**
   * Выполняет PATCH запрос
   * @param endpoint - Путь эндпоинта
   * @param data - Данные для отправки
   * @returns Promise с типизированными данными
   */
  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.retryRequest(() => this.request<T>('PATCH', endpoint, data));
  }

  /**
   * Выполняет HTTP запрос
   * @param method - HTTP метод
   * @param endpoint - Путь эндпоинта или полный URL
   * @param data - Данные для отправки (опционально)
   * @returns Promise с типизированными данными
   */
  private async request<T>(
    method: string,
    endpoint: string,
    data?: any
  ): Promise<T> {
    try {
      const config: AxiosRequestConfig = {
        method,
        data,
      };

      // Если endpoint начинается с http, используем его как полный URL
      if (endpoint.startsWith('http')) {
        config.url = endpoint;
        config.baseURL = undefined;
      } else {
        config.url = endpoint;
      }

      const response = await this.axiosInstance.request<T>(config);

      // Валидация ответа
      if (!this.validateResponse(response.data)) {
        throw this.createAppError(
          ErrorType.VALIDATION_ERROR,
          'Получены невалидные данные от сервера',
          response.data
        );
      }

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Выполняет запрос с retry логикой и экспоненциальной задержкой
   * @param requestFn - Функция запроса
   * @param maxRetries - Максимальное количество попыток (по умолчанию из конфигурации)
   * @returns Promise с результатом запроса
   */
  private async retryRequest<T>(
    requestFn: () => Promise<T>,
    maxRetries: number = this.retryConfig.maxRetries
  ): Promise<T> {
    let lastError: AppError | null = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await requestFn();
      } catch (error) {
        lastError = error as AppError;

        // Не повторяем запрос для ошибок валидации или клиентских ошибок (4xx)
        if (
          lastError.type === ErrorType.VALIDATION_ERROR ||
          (lastError.details?.status >= 400 && lastError.details?.status < 500)
        ) {
          throw lastError;
        }

        // Если это последняя попытка, выбрасываем ошибку
        if (attempt === maxRetries - 1) {
          throw lastError;
        }

        // Экспоненциальная задержка: 1с, 2с, 4с
        const delay = this.retryConfig.baseDelay * Math.pow(2, attempt);
        console.warn(
          `Попытка ${attempt + 1} не удалась. Повтор через ${delay}мс...`,
          lastError.message
        );

        await this.sleep(delay);
      }
    }

    // Этот код не должен выполниться, но TypeScript требует return
    throw lastError!;
  }

  /**
   * Валидирует ответ от сервера
   * @param data - Данные для валидации
   * @returns true если данные валидны
   */
  private validateResponse(data: any): boolean {
    // Базовая валидация: проверяем что данные существуют и не null
    if (data === null || data === undefined) {
      return false;
    }

    // Для объектов проверяем что это действительно объект
    if (typeof data === 'object' && !Array.isArray(data)) {
      return true;
    }

    // Для массивов проверяем что это массив
    if (Array.isArray(data)) {
      return true;
    }

    // Примитивные типы также валидны
    return true;
  }

  /**
   * Обрабатывает ошибки и преобразует их в AppError
   * @param error - Ошибка для обработки
   * @returns AppError
   */
  private handleError(error: any): AppError {
    // Если это уже AppError, возвращаем как есть
    if (error.type && error.message && error.timestamp) {
      return error as AppError;
    }

    // Обработка ошибок Axios
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;

      // Сетевые ошибки (нет ответа от сервера)
      if (!axiosError.response) {
        return this.createAppError(
          ErrorType.NETWORK_ERROR,
          'Ошибка сети: не удалось подключиться к серверу',
          {
            message: axiosError.message,
            code: axiosError.code,
          }
        );
      }

      // HTTP ошибки (получен ответ с кодом ошибки)
      const status = axiosError.response.status;
      const statusText = axiosError.response.statusText;
      const responseData = axiosError.response.data;

      return this.createAppError(
        ErrorType.API_ERROR,
        `Ошибка API: ${status} ${statusText}`,
        {
          status,
          statusText,
          data: responseData,
        }
      );
    }

    // Неизвестные ошибки
    return this.createAppError(
      ErrorType.UNKNOWN_ERROR,
      error.message || 'Произошла неизвестная ошибка',
      error
    );
  }

  /**
   * Создает объект AppError
   * @param type - Тип ошибки
   * @param message - Сообщение об ошибке
   * @param details - Дополнительные детали
   * @returns AppError
   */
  private createAppError(
    type: ErrorType,
    message: string,
    details?: any
  ): AppError {
    return {
      type,
      message,
      details,
      timestamp: new Date(),
    };
  }

  /**
   * Вспомогательная функция для задержки
   * @param ms - Миллисекунды задержки
   * @returns Promise
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

/**
 * Экземпляр API клиента по умолчанию
 * Использует переменную окружения или адрес реального бэкенда
 */
export const apiClient = new ApiClient(
  import.meta.env.VITE_API_BASE_URL || 'http://64.188.113.193:8080'
);

/**
 * Флаг для использования мок-данных
 * По умолчанию используем реальные данные, мок-данные только если явно указано
 */
export const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';
