/**
 * Экспорт API модулей
 */

export { ApiClient, apiClient, USE_MOCK_DATA } from './client';
export { API_ENDPOINTS } from './endpoints';
export { mockDashboardData } from './mockData';
export type {
  DashboardResponse,
  MachineRoomWidget,
  CompanyWidget,
  CompaniesWidget,
  RacksWidget,
  RackResponse,
} from './types';
