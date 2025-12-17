import { makeObservable, observable, action, computed, runInAction } from 'mobx';
import { PowerAlertData, RepairRackData } from '../types/models';
import { mockPowerAlerts, mockRepairRacks } from '../api/mockData';
import { apiClient } from '../api/client';
import { POWER_ALERT_ENDPOINTS } from '../api/endpoints';

/**
 * Store для управления алертами о сбоях питания
 */
export class PowerAlertStore {
  @observable alerts: PowerAlertData[] = [];
  @observable repairRacks: RepairRackData[] = [];
  @observable isLoading: boolean = false;
  @observable error: string | null = null;
  @observable isModalOpen: boolean = false;
  private pollingInterval: ReturnType<typeof setInterval> | null = null;

  constructor() {
    makeObservable(this);
  }

  /**
   * Есть ли активные алерты
   */
  @computed
  get hasAlerts(): boolean {
    return this.alerts.length > 0;
  }

  /**
   * Количество активных алертов
   */
  @computed
  get alertCount(): number {
    return this.alerts.length;
  }

  /**
   * Получить данные об алертах
   */
  @action
  async fetchAlerts(): Promise<void> {
    try {
      this.isLoading = true;
      this.error = null;
      const alerts = await apiClient.get<PowerAlertData[]>(POWER_ALERT_ENDPOINTS.GET_ENERGY_STATE);
      
      runInAction(() => {
        this.alerts = alerts || [];
        this.isLoading = false;
      });
    } catch (error) {
      runInAction(() => {
        console.warn('API недоступен, используем мок-данные для алертов:', error);
        this.alerts = mockPowerAlerts;
        this.error = null;
        this.isLoading = false;
      });
    }
  }

  @action
  async fetchRepairRacks(): Promise<void> {
    try {
      this.isLoading = true;
      this.error = null;

      await new Promise(resolve => setTimeout(resolve, 300));
      
      runInAction(() => {
        this.repairRacks = mockRepairRacks.repairRacks;
        this.isLoading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = 'Ошибка при загрузке данных о ремонте';
        this.isLoading = false;
      });
      console.error('Error fetching repair racks:', error);
    }
  }

  /**
   * Включить резервное питание
   */
  @action
  async enableBackupPower(): Promise<void> {
    try {
      this.isLoading = true;
      this.error = null;

      // // Отправляем PATCH запрос для включения резервного питания
      // await apiClient.patch(POWER_ALERT_ENDPOINTS.ENABLE_BACKUP_POWER, mockRepairRacks);
      
      runInAction(() => {
        this.alerts = [];
        this.closeModal();
        this.isLoading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = 'Ошибка при включении резервного питания';
        this.isLoading = false;
      });
      console.error('Error enabling backup power:', error);
    }
  }

  @action
  openModal(): void {
    this.isModalOpen = true;
    this.fetchRepairRacks();
  }

  @action
  closeModal(): void {
    this.isModalOpen = false;
  }


  @action
  startPolling(): void {
    this.fetchAlerts();

    this.pollingInterval = setInterval(() => {
      this.fetchAlerts();
    }, 30000);
  }

  @action
  stopPolling(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }
}
