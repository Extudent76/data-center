/**
 * Определения эндпоинтов API
 */

/**
 * Эндпоинты для работы с панелью управления
 */
export const DASHBOARD_ENDPOINTS = {
  /**
   * Получить данные панели управления (машинные залы, арендаторы)
   */
  GET_DASHBOARD_DATA: '/dashboard',
} as const;

/**
 * Эндпоинты для работы с машинными залами
 */
export const MACHINE_HALL_ENDPOINTS = {
  /**
   * Получить список всех машинных залов
   */
  GET_ALL: '/machine-halls',

  /**
   * Получить данные конкретного машинного зала
   * @param id - ID машинного зала
   */
  GET_BY_ID: (id: number) => `/machine-halls/${id}`,

  /**
   * Получить стойки машинного зала
   * @param id - ID машинного зала
   */
  GET_RACKS: (id: number) => `/machine-halls/${id}/racks`,
} as const;

/**
 * Эндпоинты для работы со стойками
 */
export const RACK_ENDPOINTS = {
  /**
   * Получить данные конкретной стойки
   * @param id - ID стойки
   */
  GET_BY_ID: (id: string) => `/racks/${id}`,

  /**
   * Обновить статус стойки
   * @param id - ID стойки
   */
  UPDATE_STATUS: (id: string) => `/racks/${id}/status`,
} as const;

/**
 * Эндпоинты для работы с арендаторами
 */
export const TENANT_ENDPOINTS = {
  /**
   * Получить список всех арендаторов
   */
  GET_ALL: '/tenants',

  /**
   * Получить данные конкретного арендатора
   * @param id - ID арендатора
   */
  GET_BY_ID: (id: string) => `/tenants/${id}`,

  /**
   * Получить статистику по арендаторам
   */
  GET_STATISTICS: '/tenants/statistics',
} as const;

/**
 * Эндпоинты для работы с пользователями
 */
export const USER_ENDPOINTS = {
  /**
   * Получить данные текущего пользователя
   */
  GET_CURRENT: '/user/current',

  /**
   * Получить уведомления пользователя
   */
  GET_NOTIFICATIONS: '/user/notifications',

  /**
   * Отметить уведомления как прочитанные
   */
  MARK_NOTIFICATIONS_READ: '/user/notifications/read',

  /**
   * Аутентификация пользователя
   */
  LOGIN: '/auth/login',

  /**
   * Выход пользователя
   */
  LOGOUT: '/auth/logout',
} as const;

/**
 * Эндпоинты для мониторинга
 */
export const MONITORING_ENDPOINTS = {
  /**
   * Получить данные мониторинга
   */
  GET_DATA: '/monitoring',

  /**
   * Получить историю метрик
   * @param metric - Название метрики
   */
  GET_METRIC_HISTORY: (metric: string) => `/monitoring/metrics/${metric}/history`,
} as const;

/**
 * Эндпоинты для журнала доступа
 */
export const ACCESS_LOG_ENDPOINTS = {
  /**
   * Получить записи журнала доступа
   */
  GET_LOGS: '/access-logs',

  /**
   * Получить записи журнала с фильтрацией
   * @param params - Параметры фильтрации
   */
  GET_FILTERED_LOGS: (params: {
    startDate?: string;
    endDate?: string;
    userId?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    if (params.userId) queryParams.append('userId', params.userId);
    return `/access-logs?${queryParams.toString()}`;
  },
} as const;

/**
 * Эндпоинты для работы с алертами питания
 */
export const POWER_ALERT_ENDPOINTS = {
  /**
   * Получить информацию о сбоях питания
   */
  GET_ENERGY_STATE: '/api/v1/main-info/energy-state',

  /**
   * Включить резервное питание
   */
  ENABLE_BACKUP_POWER: '/api/v1/main-info',
} as const;

/**
 * Все эндпоинты API
 */
export const API_ENDPOINTS = {
  DASHBOARD: DASHBOARD_ENDPOINTS,
  MACHINE_HALLS: MACHINE_HALL_ENDPOINTS,
  RACKS: RACK_ENDPOINTS,
  TENANTS: TENANT_ENDPOINTS,
  USER: USER_ENDPOINTS,
  MONITORING: MONITORING_ENDPOINTS,
  ACCESS_LOG: ACCESS_LOG_ENDPOINTS,
  POWER_ALERTS: POWER_ALERT_ENDPOINTS,
} as const;
