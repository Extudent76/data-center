import { DashboardStore } from './DashboardStore';
import { NavigationStore } from './NavigationStore';
import { UserStore } from './UserStore';
import { PowerAlertStore } from './PowerAlertStore';

export class RootStore {
  dashboardStore: DashboardStore;
  navigationStore: NavigationStore;
  userStore: UserStore;
  powerAlertStore: PowerAlertStore;

  constructor() {
    this.dashboardStore = new DashboardStore();
    this.navigationStore = new NavigationStore();
    this.userStore = new UserStore();
    this.powerAlertStore = new PowerAlertStore();
  }
}

// Создаем единственный экземпляр RootStore
export const rootStore = new RootStore();
