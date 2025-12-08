import { makeObservable, observable, action } from 'mobx';

/**
 * Store для управления навигацией приложения
 * Интегрируется с React Router для синхронизации состояния
 * Требования: 4.2, 4.4
 */
export class NavigationStore {
  currentRoute: string = '/';

  constructor() {
    makeObservable(this, {
      currentRoute: observable,
      navigate: action,
      setCurrentRoute: action,
    });
  }

  /**
   * Устанавливает текущий маршрут
   * Используется для синхронизации с React Router
   */
  setCurrentRoute(route: string): void {
    this.currentRoute = route;
  }

  /**
   * Навигация на указанный маршрут
   * @deprecated Используйте React Router navigate вместо этого метода
   */
  navigate(route: string): void {
    this.currentRoute = route;
  }
}
