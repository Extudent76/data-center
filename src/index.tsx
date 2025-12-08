import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@gravity-ui/uikit';
import { StoreProvider } from './stores';
import App from './App.tsx';
import '@gravity-ui/uikit/styles/fonts.css';
import '@gravity-ui/uikit/styles/styles.css';
import './styles/global.css';

/**
 * Точка входа приложения
 * Настраивает MobX Provider, React Router, Gravity UI Theme Provider и рендерит корневой компонент
 * Требования: 6.1, 6.4, 9.4
 */
ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StoreProvider>
      <BrowserRouter>
        <ThemeProvider theme="light">
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </StoreProvider>
  </StrictMode>,
);
