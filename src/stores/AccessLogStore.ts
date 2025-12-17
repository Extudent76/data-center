import { makeObservable, observable, action, runInAction } from 'mobx';
import { apiClient } from '../api/client';
import { ACCESS_LOG_ENDPOINTS } from '../api/endpoints';
import type { AccessLogEntry } from '../types/models';

export class AccessLogStore {
  logs: AccessLogEntry[] = [];
  selectedMachineRoomId: number | null = null;
  isLoading: boolean = false;
  error: string | null = null;

  machineRooms = [
    { id: 1, name: 'Машинный зал №1' },
    { id: 2, name: 'Машинный зал №2' },
    { id: 3, name: 'Машинный зал №3' },
  ];

  constructor() {
    makeObservable(this, {
      logs: observable,
      selectedMachineRoomId: observable,
      isLoading: observable,
      error: observable,
      setSelectedMachineRoom: action,
      fetchAccessLogs: action,
      clearError: action,
    });
  }

  setSelectedMachineRoom(machineRoomId: number | null): void {
    this.selectedMachineRoomId = machineRoomId;
  }

  async fetchAccessLogs(): Promise<void> {
    if (!this.selectedMachineRoomId) {
      return;
    }

    this.isLoading = true;
    this.error = null;

    try {
      const logs = await apiClient.get<AccessLogEntry[]>(
        ACCESS_LOG_ENDPOINTS.GET_LOGS_BY_MACHINE_ROOM(this.selectedMachineRoomId)
      );

      runInAction(() => {
        this.logs = logs;
        this.isLoading = false;
      });
    } catch (err) {
      runInAction(() => {
        this.error = err instanceof Error ? err.message : 'Ошибка загрузки журнала доступа';
        this.isLoading = false;
      });
    }
  }

  clearError(): void {
    this.error = null;
  }

  get canSearch(): boolean {
    return this.selectedMachineRoomId !== null && !this.isLoading;
  }
}