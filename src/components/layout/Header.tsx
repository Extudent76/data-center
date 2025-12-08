import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Icon } from '@gravity-ui/uikit';
import { Thunderbolt, PersonWorker } from '@gravity-ui/icons';
import { UserStore } from '../../stores/UserStore';
import { PowerAlertStore } from '../../stores/PowerAlertStore';
import { PowerAlertModal } from '../common';
import './Header.css';

interface HeaderProps {
  userStore: UserStore;
  powerAlertStore: PowerAlertStore;
}

export const Header: React.FC<HeaderProps> = observer(({ userStore, powerAlertStore }) => {
  // Запускаем polling при монтировании компонента
  useEffect(() => {
    powerAlertStore.startPolling();
    
    return () => {
      powerAlertStore.stopPolling();
    };
  }, [powerAlertStore]);

  const handlePowerAlertClick = () => {
    powerAlertStore.openModal();
  };

  const handleProfileClick = () => {
    console.log('Profile clicked');
    // Согласно требованию 5.5, это просто заглушка
  };

  const handleEnableBackupPower = async () => {
    await powerAlertStore.enableBackupPower();
  };

  return (
    <>
      <header className="header">
        <div className="header-content">
          <div className="header-right">
            {/* Кнопка сбоя питания */}
            {powerAlertStore.hasAlerts && (
              <Button
                view="outlined-danger"
                size="m"
                onClick={handlePowerAlertClick}
                className="header-power-alert"
              >
                <Icon data={Thunderbolt} size={16} />
                <span>Сбой питания</span>
              </Button>
            )}

            {/* Профиль пользователя */}
            <div className="header-profile">
              <Button
                view="flat"
                size="l"
                onClick={handleProfileClick}
                className="header-profile-button"
              >
                <Icon data={PersonWorker} size={20} />
                <span className="header-username">{userStore.userName}</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Модальное окно с алертами */}
      <PowerAlertModal
        isOpen={powerAlertStore.isModalOpen}
        alerts={powerAlertStore.alerts}
        isLoading={powerAlertStore.isLoading}
        onClose={() => powerAlertStore.closeModal()}
        onEnableBackupPower={handleEnableBackupPower}
      />
    </>
  );
});
