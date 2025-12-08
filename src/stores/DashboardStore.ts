import { makeObservable, observable, action, computed, runInAction } from 'mobx';
import { apiClient, USE_MOCK_DATA } from '../api/client';
import { mockDashboardData } from '../api/mockData';
import type { MachineHallData, TenantData } from '../types/models';
import type { DashboardResponse } from '../api/types';

export class DashboardStore {
  machineHalls: MachineHallData[] = [];
  tenants: TenantData[] = [];
  isLoading: boolean = false;
  lastUpdated: Date | null = null;
  error: string | null = null;
  private pollingInterval: ReturnType<typeof setInterval> | null = null;

  constructor() {
    makeObservable(this, {
      machineHalls: observable,
      tenants: observable,
      isLoading: observable,
      lastUpdated: observable,
      error: observable,
      fetchDashboardData: action,
      setExpandedHall: action,
      startPolling: action,
      stopPolling: action,
      totalTenants: computed,
    });
  }

  async fetchDashboardData(): Promise<void> {
    this.isLoading = true;
    this.error = null;

    try {
      let data: DashboardResponse;
      
      // Используем мок-данные если флаг установлен
      if (USE_MOCK_DATA) {
        // Имитируем задержку сети
        await new Promise(resolve => setTimeout(resolve, 500));
        data = mockDashboardData;
      } else {
        data = await apiClient.get<DashboardResponse>('/dashboard');
      }
      
      runInAction(() => {
        // Преобразуем данные API в модели приложения
        this.machineHalls = data.racksWidget.map((widget, index) => ({
          id: widget.id,
          name: widget.name,
          memoryAvailability: data.machineRoomsWidget[index]?.persentUsageMemory || 0,
          racks: widget.racks,
          isExpanded: this.machineHalls.find(h => h.id === widget.id)?.isExpanded ?? false,
        }));

        // Преобразуем данные компаний в арендаторов
        this.tenants = data.companiesWidget.companies.map((company, index) => ({
          id: `tenant-${index}`,
          company: company.name,
          count: company.diskNumber,
          percentage: company.persentUsageDisks,
        }));

        this.lastUpdated = new Date();
        this.isLoading = false;
      });
    } catch (err) {
      runInAction(() => {
        this.error = err instanceof Error ? err.message : 'Неизвестная ошибка';
        this.isLoading = false;
      });
    }
  }

  setExpandedHall(hallNumber: number, expanded: boolean): void {
    const hall = this.machineHalls.find(h => h.id === hallNumber);
    if (hall) {
      hall.isExpanded = expanded;
    }
  }

  startPolling(): void {
    // Сначала загружаем данные
    this.fetchDashboardData();
    
    // Затем запускаем polling каждые 30 секунд
    this.pollingInterval = setInterval(() => {
      this.fetchDashboardData();
    }, 30000);
  }

  stopPolling(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  get totalTenants(): number {
    return this.tenants.length;
  }
}
