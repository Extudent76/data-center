import React from 'react';
import { NavLink } from 'react-router-dom';
import { Icon } from '@gravity-ui/uikit';
import { House, ChartLine, FileText } from '@gravity-ui/icons';
import './Sidebar.css';

interface MenuItem {
  id: string;
  label: string;
  route: string;
  icon: typeof House;
}

const menuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Главная', route: '/', icon: House },
  { id: 'monitoring', label: 'Мониторинг', route: '/monitoring', icon: ChartLine },
  { id: 'access-log', label: 'Журнал доступа', route: '/access-log', icon: FileText },
];

/**
 * Компонент боковой панели навигации
 * Использует React Router для навигации между страницами
 * Требования: 4.1, 4.2, 4.3, 4.4, 4.5
 */
export const Sidebar: React.FC = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-title">Панель управления</h2>
      </div>
      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          {menuItems.map((item) => (
            <li key={item.id} className="sidebar-menu-item">
              <NavLink
                to={item.route}
                className={({ isActive }) =>
                  `sidebar-menu-button ${isActive ? 'active' : ''}`
                }
              >
                <Icon data={item.icon} size={20} className="sidebar-menu-icon" />
                <span className="sidebar-menu-label">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};
