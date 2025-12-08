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
