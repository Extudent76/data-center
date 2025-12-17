export const DASHBOARD_ENDPOINTS = {

  GET_DASHBOARD_DATA: '/dashboard',
  GET_MAIN_INFO: 'http://64.188.113.193:8080/api/v1/main-info',
} as const;

export const MACHINE_HALL_ENDPOINTS = {
  GET_ALL: '/machine-halls',
  GET_BY_ID: (id: number) => `/machine-halls/${id}`,
  GET_RACKS: (id: number) => `/machine-halls/${id}/racks`,
} as const;

export const RACK_ENDPOINTS = {
  GET_BY_ID: (id: string) => `/racks/${id}`,
  UPDATE_STATUS: (id: string) => `/racks/${id}/status`,
} as const;

export const TENANT_ENDPOINTS = {
  GET_ALL: '/tenants',
  GET_BY_ID: (id: string) => `/tenants/${id}`,
  GET_STATISTICS: '/tenants/statistics',
} as const;

export const MONITORING_ENDPOINTS = {
  GET_DATA: '/monitoring',
  GET_SETTINGS: 'http://64.188.113.193:8080/api/v1/monitoring-settings',
  GET_MONITORING_DATA: (rackId: number, diskId: number) => `http://64.188.113.193:8080/api/v1/monitoring-data?rackId=${rackId}&diskId=${diskId}`,
  GET_METRIC_HISTORY: (metric: string) => `/monitoring/metrics/${metric}/history`,
} as const;

export const ACCESS_LOG_ENDPOINTS = {
  GET_LOGS: '/access-logs',
  GET_LOGS_BY_MACHINE_ROOM: (machineRoomId: number) => 
    `http://64.188.113.193:8080/api/v1/logs?machineRoomId=${machineRoomId}`,
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

export const POWER_ALERT_ENDPOINTS = {
  GET_ENERGY_STATE: 'http://64.188.113.193:8080/api/v1/main-info/energy-state',
  ENABLE_BACKUP_POWER: 'http://64.188.113.193:8080/api/v1/main-info',
} as const;

export const API_ENDPOINTS = {
  DASHBOARD: DASHBOARD_ENDPOINTS,
  MACHINE_HALLS: MACHINE_HALL_ENDPOINTS,
  RACKS: RACK_ENDPOINTS,
  TENANTS: TENANT_ENDPOINTS,
  MONITORING: MONITORING_ENDPOINTS,
  ACCESS_LOG: ACCESS_LOG_ENDPOINTS,
  POWER_ALERTS: POWER_ALERT_ENDPOINTS,
} as const;
