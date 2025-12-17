import { makeObservable, observable, action, computed } from 'mobx';
import { 
  MonitoringMachineRoomData, 
  MonitoringRackData, 
  MonitoringDiskData, 
  MonitoringDataResponse 
} from '../types/models';
import { apiClient } from '../api/client';
import { MONITORING_ENDPOINTS } from '../api/endpoints';

/**
 * Store для управления данными мониторинга
 */
export class MonitoringStore {
  @observable machineRooms: MonitoringMachineRoomData[] = [];
  @observable selectedRackId: number | null = null;
  @observable selectedDiskId: number | null = null;
  @observable monitoringData: MonitoringDataResponse | null = null;
  @observable isLoadingSettings: boolean = false;
  @observable isLoadingData: boolean = false;
  @observable error: string | null = null;

  constructor() {
    makeObservable(this);
  }

  /**
   * Получить все стойки из всех машинных залов
   */
  @computed
  get allRacks(): MonitoringRackData[] {
    return this.machineRooms.flatMap(room => room.racksLists);
  }

  /**
   * Получить диски для выбранной стойки
   */
  @computed
  get availableDisks(): MonitoringDiskData[] {
    if (!this.selectedRackId) return [];
    
    const selectedRack = this.allRacks.find(rack => rack.rackId === this.selectedRackId);
    return selectedRack ? selectedRack.disksList : [];
  }

  /**
   * Можно ли выполнить поиск
   */
  @computed
  get canSearch(): boolean {
    return this.selectedRackId !== null && this.selectedDiskId !== null;
  }

  /**
   * Загрузить настройки мониторинга (стойки и диски)
   */
  @action
  async fetchMonitoringSettings(): Promise<void> {
    try {
      this.isLoadingSettings = true;
      this.error = null;

      // Выполняем реальный API запрос
      const response = await apiClient.get<MonitoringMachineRoomData[]>(MONITORING_ENDPOINTS.GET_SETTINGS);
      this.machineRooms = response;
    } catch (error) {
      this.error = 'Ошибка при загрузке настроек мониторинга';
      console.error('Error fetching monitoring settings:', error);
    } finally {
      this.isLoadingSettings = false;
    }
  }

  /**
   * Загрузить данные мониторинга для выбранной стойки и диска
   */
  @action
  async fetchMonitoringData(): Promise<void> {
    if (!this.canSearch) return;

    try {
      this.isLoadingData = true;
      this.error = null;

      // Выполняем реальный API запрос
      const response = await apiClient.get<MonitoringDataResponse>(
        MONITORING_ENDPOINTS.GET_MONITORING_DATA(this.selectedRackId!, this.selectedDiskId!)
      );
      
      this.monitoringData = response;
    } catch (error) {
      this.error = 'Ошибка при загрузке данных мониторинга';
      console.error('Error fetching monitoring data:', error);
    } finally {
      this.isLoadingData = false;
    }
  }

  /**
   * Выбрать стойку
   */
  @action
  setSelectedRack(rackId: number | null): void {
    this.selectedRackId = rackId;
    // При смене стойки сбрасываем выбранный диск
    this.selectedDiskId = null;
    // Очищаем данные мониторинга
    this.monitoringData = null;
  }

  /**
   * Выбрать диск
   */
  @action
  setSelectedDisk(diskId: number | null): void {
    this.selectedDiskId = diskId;
    // Очищаем данные мониторинга при смене диска
    this.monitoringData = null;
  }

  /**
   * Очистить ошибку
   */
  @action
  clearError(): void {
    this.error = null;
  }
}