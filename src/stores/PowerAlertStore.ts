import { makeObservable, observable, action, computed } from 'mobx';
import { PowerAlertData, RepairRackData } from '../types/models';
import { mockPowerAlerts, mockRepairRacks } from '../api/mockData';

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

      // Используем мок-данные
      // В реальном приложении здесь будет API запрос:
      // const response = await apiClient.get(POWER_ALERT_ENDPOINTS.GET_ENERGY_STATE);
      
      await new Promise(resolve => setTimeout(resolve, 300)); // Имитация задержки сети
      this.alerts = mockPowerAlerts;
    } catch (error) {
      this.error = 'Ошибка при загрузке данных об алертах';
      console.error('Error fetching power alerts:', error);
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Получить данные о стойках в ремонте
   */
  @action
  async fetchRepairRacks(): Promise<void> {
    try {
      this.isLoading = true;
      this.error = null;

      // Используем мок-данные
      await new Promise(resolve => setTimeout(resolve, 300));
      this.repairRacks = mockRepairRacks.repairRacks;
    } catch (error) {
      this.error = 'Ошибка при загрузке данных о ремонте';
      console.error('Error fetching repair racks:', error);
    } finally {
      this.isLoading = false;
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

      // В реальном приложении здесь будет PATCH запрос:
      // await apiClient.patch(POWER_ALERT_ENDPOINTS.ENABLE_BACKUP_POWER, mockRepairRacks);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // После успешного включения резервного питания очищаем алерты
      this.alerts = [];
      this.closeModal();
    } catch (error) {
      this.error = 'Ошибка при включении резервного питания';
      console.error('Error enabling backup power:', error);
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Открыть модальное окно
   */
  @action
  openModal(): void {
    this.isModalOpen = true;
    this.fetchRepairRacks();
  }

  /**
   * Закрыть модальное окно
   */
  @action
  closeModal(): void {
    this.isModalOpen = false;
  }

  /**
   * Запустить polling для проверки алертов
   */
  @action
  startPolling(): void {
    // Сразу загружаем данные
    this.fetchAlerts();

    // Затем запускаем периодическую проверку каждые 30 секунд
    this.pollingInterval = setInterval(() => {
      this.fetchAlerts();
    }, 30000);
  }

  /**
   * Остановить polling
   */
  @action
  stopPolling(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }
}
