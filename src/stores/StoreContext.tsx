import React, { createContext, useContext, ReactNode } from 'react';
import { RootStore, rootStore } from './RootStore';

/**
 * React Context для предоставления RootStore всем компонентам приложения
 * Требования: 6.1, 6.4
 */
const StoreContext = createContext<RootStore | null>(null);

interface StoreProviderProps {
  children: ReactNode;
  store?: RootStore;
}

/**
 * Provider компонент для MobX stores
 * Оборачивает приложение и предоставляет доступ к RootStore через React Context
 */
export const StoreProvider: React.FC<StoreProviderProps> = ({ 
  children, 
  store = rootStore 
}) => {
  return (
    <StoreContext.Provider value={store}>
      {children}
    </StoreContext.Provider>
  );
};

/**
 * Hook для получения RootStore из контекста
 * Выбрасывает ошибку, если используется вне StoreProvider
 */
export const useStore = (): RootStore => {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error('useStore must be used within StoreProvider');
  }
  return store;
};

/**
 * Hook для получения конкретного store из RootStore
 */
export const useDashboardStore = () => useStore().dashboardStore;
export const useNavigationStore = () => useStore().navigationStore;
export const useUserStore = () => useStore().userStore;
