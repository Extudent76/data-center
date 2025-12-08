/**
 * Типы API запросов и ответов
 */

/**
 * Ответ API для стойки
 */
export interface RackResponse {
  id: number;
  name: string;
  energyStatus: string;
  installedDisksNumber: number;
  disksCapacity: number;
  frontTemperature: number | null;
  backTemperature: number | null;
}

/**
 * Виджет машинного зала
 */
export interface MachineRoomWidget {
  name: string;
  persentUsageMemory: number;
}

/**
 * Компания в виджете
 */
export interface CompanyWidget {
  name: string;
  diskNumber: number;
  persentUsageDisks: number;
}

/**
 * Виджет компаний
 */
export interface CompaniesWidget {
  diskNumber: number;
  companies: CompanyWidget[];
}

/**
 * Виджет стоек
 */
export interface RacksWidget {
  id: number;
  name: string;
  racks: RackResponse[];
}

/**
 * Ответ API для панели управления
 */
export interface DashboardResponse {
  machineRoomsWidget: MachineRoomWidget[];
  companiesWidget: CompaniesWidget;
  racksWidget: RacksWidget[];
}
