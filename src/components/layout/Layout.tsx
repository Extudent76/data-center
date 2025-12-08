import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { rootStore } from '../../stores/RootStore';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

/**
 * Основной компонент макета приложения
 * Интегрирует Sidebar, Header и синхронизирует NavigationStore с React Router
 * Требования: 4.2, 4.4, 4.5
 */
export const Layout: React.FC<LayoutProps> = observer(({ children }) => {
  const { navigationStore, userStore, powerAlertStore } = rootStore;
  const location = useLocation();

  useEffect(() => {
    // Загружаем данные пользователя при монтировании
    userStore.fetchUserData();
  }, [userStore]);

  // Синхронизация NavigationStore с React Router
  useEffect(() => {
    navigationStore.setCurrentRoute(location.pathname);
  }, [location.pathname, navigationStore]);

  return (
    <div className="layout">
      <Sidebar />
      <div className="layout-main">
        <Header userStore={userStore} powerAlertStore={powerAlertStore} />
        <main className="layout-content">
          {children}
        </main>
      </div>
    </div>
  );
});
