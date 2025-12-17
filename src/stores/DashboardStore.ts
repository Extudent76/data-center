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
      
      if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 500));
        data = mockDashboardData;
      } else {
        data = await apiClient.get<DashboardResponse>('http://64.188.113.193:8080/api/v1/main-info');
      }
      
      runInAction(() => {
        this.machineHalls = data.racksWidget.map((widget, index) => ({
          id: widget.id,
          name: widget.name,
          memoryAvailability: data.machineRoomsWidget[index]?.persentUsageMemory || 0,
          racks: widget.racks,
          isExpanded: this.machineHalls.find(h => h.id === widget.id)?.isExpanded ?? false,
        }));

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
    this.fetchDashboardData();
    
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
