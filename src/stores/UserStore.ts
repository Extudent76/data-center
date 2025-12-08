import { makeObservable, observable, action } from 'mobx';

export class UserStore {
  userName: string = '';
  notificationCount: number = 0;
  hasPowerAlert: boolean = false;

  constructor() {
    makeObservable(this, {
      userName: observable,
      notificationCount: observable,
      hasPowerAlert: observable,
      fetchUserData: action,
    });
  }

  async fetchUserData(): Promise<void> {
    // TODO: В будущем здесь будет реальный API запрос
    // Пока используем заглушку
    this.userName = 'Петров И.И.';
    this.hasPowerAlert = true;
  }
}
