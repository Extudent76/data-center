import { DashboardStore } from './DashboardStore';
import { NavigationStore } from './NavigationStore';
import { UserStore } from './UserStore';
import { PowerAlertStore } from './PowerAlertStore';
import { MonitoringStore } from './MonitoringStore';
import { AccessLogStore } from './AccessLogStore';

export class RootStore {
  dashboardStore: DashboardStore;
  navigationStore: NavigationStore;
  userStore: UserStore;
  powerAlertStore: PowerAlertStore;
  monitoringStore: MonitoringStore;
  accessLogStore: AccessLogStore;

  constructor() {
    this.dashboardStore = new DashboardStore();
    this.navigationStore = new NavigationStore();
    this.userStore = new UserStore();
    this.powerAlertStore = new PowerAlertStore();
    this.monitoringStore = new MonitoringStore();
    this.accessLogStore = new AccessLogStore();
  }
}

// Создаем единственный экземпляр RootStore
export const rootStore = new RootStore();
