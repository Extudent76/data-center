/**
 * Мок-данные для разработки и тестирования
 */

import { DashboardResponse } from './types';

/**
 * Мок-данные для панели управления
 */
export const mockDashboardData: DashboardResponse = {
  machineRoomsWidget: [
    {
      name: "Машинный зал №1",
      persentUsageMemory: 32.05
    },
    {
      name: "Машинный зал №2",
      persentUsageMemory: 9
    },
    {
      name: "Машинный зал №3",
      persentUsageMemory: 81
    },
  ],
  companiesWidget: {
    diskNumber: 4,
    companies: [
      {
        name: "ООО \"Рога и Копыта\"",
        diskNumber: 2,
        persentUsageDisks: 50
      },
      {
        name: "ООО \"Перспектива\"",
        diskNumber: 1,
        persentUsageDisks: 25
      },
      {
        name: "ООО \"MegaCloud\"",
        diskNumber: 1,
        persentUsageDisks: 25
      }
    ]
  },
  racksWidget: [
    {
      id: 1,
      name: "Машинный зал №1",
      racks: [
        {
          id: 1,
          name: "Стойка №1",
          energyStatus: "Выключено",
          installedDisksNumber: 2,
          disksCapacity: 12,
          frontTemperature: null,
          backTemperature: null
        },
        {
          id: 2,
          name: "Стойка №2",
          energyStatus: "Выключено",
          installedDisksNumber: 1,
          disksCapacity: 10,
          frontTemperature: null,
          backTemperature: null
        }
      ]
    },
    {
      id: 2,
      name: "Машинный зал №2",
      racks: [
        {
          id: 3,
          name: "Стойка №3",
          energyStatus: "Выключено",
          installedDisksNumber: 1,
          disksCapacity: 10,
          frontTemperature: null,
          backTemperature: null
        }
      ]
    },
        {
      id: 3,
      name: "Машинный зал №3",
      racks: [
        {
          id: 4,
          name: "Стойка №4",
          energyStatus: "Выключено",
          installedDisksNumber: 1,
          disksCapacity: 10,
          frontTemperature: null,
          backTemperature: null
        }
      ]
    },
  ]
};

/**
 * Мок-данные для алертов о сбоях питания
 */
export const mockPowerAlerts = [
  {
    rackId: 1,
    rackName: "Стойка №1",
    machineRoomName: "Машинный зал №1",
    timestamp: "1"
  },
  {
    rackId: 2,
    rackName: "Стойка №2",
    machineRoomName: "Машинный зал №1",
    timestamp: "1"
  },
  {
    rackId: 3,
    rackName: "Стойка №3",
    machineRoomName: "Машинный зал №2",
    timestamp: "1"
  }
];

/**
 * Мок-данные для стоек в ремонте
 */
export const mockRepairRacks = {
  repairRacks: [
    {
      repairRackName: "Стойка №1",
      downTime: "3.00:52:59.9475420"
    },
    {
      repairRackName: "Стойка №2",
      downTime: "3.00:52:59.9327570"
    },
    {
      repairRackName: "Стойка №3",
      downTime: "3.00:52:59.9338450"
    }
  ]
};
