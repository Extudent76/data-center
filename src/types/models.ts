/**
 * Модели данных для системы мониторинга дата-центра
 */

/**
 * Данные о стойке серверного оборудования
 */
export interface RackData {
  id: number;
  name: string;
  energyStatus: string;
  installedDisksNumber: number;
  disksCapacity: number;
  frontTemperature: number | null;
  backTemperature: number | null;
}

/**
 * Данные о машинном зале
 */
export interface MachineHallData {
  id: number;
  name: string;
  memoryAvailability: number;
  racks: RackData[];
  isExpanded: boolean;
}

/**
 * Данные об арендаторе
 */
export interface TenantData {
  id: string;
  company: string;
  count: number;
  percentage: number;
}

/**
 * Данные об алерте сбоя питания
 */
export interface PowerAlertData {
  rackId: number;
  rackName: string;
  machineRoomName: string;
  timestamp: string;
}

/**
 * Данные о стойке в ремонте
 */
export interface RepairRackData {
  repairRackName: string;
  downTime: string;
}
/**
 * Данные о диске для мониторинга
 */
export interface MonitoringDiskData {
  diskId: number;
  diskName: string;
}

/**
 * Данные о стойке для мониторинга
 */
export interface MonitoringRackData {
  rackId: number;
  rackName: string;
  disksList: MonitoringDiskData[];
}

/**
 * Данные о машинном зале для мониторинга
 */
export interface MonitoringMachineRoomData {
  machineRoomId: number;
  machineRoomName: string;
  racksLists: MonitoringRackData[];
}

/**
 * Данные о стойке в ответе мониторинга
 */
export interface MonitoringRackResponse {
  id: number;
  name: string;
  energyStatus: string;
  installedDisksNumber: number | null;
  disksCapacity: number;
  frontTemperature: number | null;
  backTemperature: number | null;
}

/**
 * Данные о диске в ответе мониторинга
 */
export interface MonitoringDiskResponse {
  id: number;
  name: string;
  usedVolume: number;
  fullVolume: number;
  rentalCompanyName: string;
}

/**
 * Данные о температуре в определенный момент времени
 */
export interface TemperatureData {
  frontTemperature: number;
  backTemperature: number;
  timeStamp: string;
}

/**
 * Ответ API мониторинга
 */
export interface MonitoringDataResponse {
  rack: MonitoringRackResponse;
  disk: MonitoringDiskResponse;
  temperatures: TemperatureData[] | null;
  percentOfMemoryDiskUsage: number;
}

/**
 * Запись журнала доступа
 */
export interface AccessLogEntry {
  employeeId: string;
  employeeName: string;
  accessResult: 'success' | 'denied';
  authType: 'fingerprint' | 'badge';
  timestamp: string;
  machineRoomId: number;
  rackId: number;
}