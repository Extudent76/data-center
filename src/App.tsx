import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout';
import { ErrorBoundary } from './components/common';
import Dashboard from './pages/Dashboard';
import Monitoring from './pages/Monitoring';
import AccessLog from './pages/AccessLog';

/**
 * Корневой компонент приложения с настройкой роутинга и Error Boundary
 * Требования: 4.2, 4.4, 6.1, 6.4
 */
function App() {
  return (
    <ErrorBoundary>
      <Layout>
        <Routes>
          {/* Главная страница - Dashboard */}
          <Route path="/" element={<Dashboard />} />
          
          {/* Страница мониторинга */}
          <Route path="/monitoring" element={<Monitoring />} />
          
          {/* Страница журнала доступа */}
          <Route path="/access-log" element={<AccessLog />} />
          
          {/* Перенаправление на главную для неизвестных маршрутов */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </ErrorBoundary>
  );
}

export default App;
