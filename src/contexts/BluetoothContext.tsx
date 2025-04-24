
import React, { createContext, useContext, useEffect, useRef } from 'react';
import { BleDevice } from '@capacitor-community/bluetooth-le';
import { App } from '@capacitor/app';
import { useBluetoothInitialization } from '@/hooks/bluetooth/useBluetoothInitialization';
import { useBluetoothScanning } from '@/hooks/bluetooth/useBluetoothScanning';
import { useBluetoothConnection } from '@/hooks/bluetooth/useBluetoothConnection';

interface BluetoothContextType {
  isBluetoothAvailable: boolean;
  isScanning: boolean;
  connectedDevice: BleDevice | null;
  discoveredDevices: BleDevice[];
  startScan: () => Promise<void>;
  stopScan: () => Promise<void>;
  connectToDevice: (deviceId: string) => Promise<void>;
  disconnectDevice: () => Promise<void>;
  isBackgroundModeEnabled: boolean;
  toggleBackgroundMode: () => void;
}

const BluetoothContext = createContext<BluetoothContextType>({
  isBluetoothAvailable: false,
  isScanning: false,
  connectedDevice: null,
  discoveredDevices: [],
  startScan: async () => {},
  stopScan: async () => {},
  connectToDevice: async () => {},
  disconnectDevice: async () => {},
  isBackgroundModeEnabled: false,
  toggleBackgroundMode: () => {},
});

export const useBluetoothContext = () => useContext(BluetoothContext);

export const BluetoothProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isBluetoothAvailable } = useBluetoothInitialization();
  const { isScanning, discoveredDevices, startScan, stopScan } = useBluetoothScanning();
  const {
    connectedDevice,
    isBackgroundModeEnabled,
    connectToDevice,
    disconnectDevice,
    toggleBackgroundMode,
    handleAppResume,
    lastConnectedDeviceIdRef,
    reconnectTimeoutRef,
  } = useBluetoothConnection(discoveredDevices);

  const appStateListenerRef = useRef<any>(null);

  useEffect(() => {
    const setupAppStateListener = async () => {
      appStateListenerRef.current = await App.addListener('appStateChange', ({ isActive }) => {
        console.log('App state changed. Is active:', isActive);
        
        if (isActive) {
          console.log('App is active, checking for device reconnection');
          handleAppResume();
        } else {
          console.log('App is inactive');
          if (isBackgroundModeEnabled && connectedDevice) {
            console.log('Background mode is enabled, maintaining connection');
          }
        }
      });
    };
    
    setupAppStateListener();

    return () => {
      if (appStateListenerRef.current) {
        appStateListenerRef.current.remove();
      }
      
      if (connectedDevice) {
        disconnectDevice();
      }
      
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [connectedDevice, isBackgroundModeEnabled, disconnectDevice, handleAppResume]);

  const value = {
    isBluetoothAvailable,
    isScanning,
    connectedDevice,
    discoveredDevices,
    startScan,
    stopScan,
    connectToDevice,
    disconnectDevice,
    isBackgroundModeEnabled,
    toggleBackgroundMode
  };

  return (
    <BluetoothContext.Provider value={value}>
      {children}
    </BluetoothContext.Provider>
  );
};
