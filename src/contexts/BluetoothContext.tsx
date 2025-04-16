
import React, { createContext, useContext, useState, useEffect } from 'react';
import { BleClient, BleDevice } from '@capacitor-community/bluetooth-le';
import { toast } from '@/hooks/use-toast';

interface BluetoothContextType {
  isBluetoothAvailable: boolean;
  isScanning: boolean;
  connectedDevice: BleDevice | null;
  discoveredDevices: BleDevice[];
  startScan: () => Promise<void>;
  stopScan: () => Promise<void>;
  connectToDevice: (deviceId: string) => Promise<void>;
  disconnectDevice: () => Promise<void>;
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
});

export const useBluetoothContext = () => useContext(BluetoothContext);

export const BluetoothProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isBluetoothAvailable, setIsBluetoothAvailable] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState<BleDevice | null>(null);
  const [discoveredDevices, setDiscoveredDevices] = useState<BleDevice[]>([]);

  useEffect(() => {
    const initializeBluetooth = async () => {
      try {
        await BleClient.initialize({ androidNeverForLocation: false });
        setIsBluetoothAvailable(true);
      } catch (error) {
        console.error('Bluetooth initialization error:', error);
        setIsBluetoothAvailable(false);
        toast({
          title: "Bluetooth Error",
          description: "Failed to initialize Bluetooth. Please ensure Bluetooth is enabled.",
          variant: "destructive"
        });
      }
    };

    initializeBluetooth();

    return () => {
      // Cleanup if needed
      if (connectedDevice) {
        BleClient.disconnect(connectedDevice.deviceId)
          .catch(error => console.error('Error disconnecting device:', error));
      }
    };
  }, []);

  const startScan = async () => {
    if (!isBluetoothAvailable) {
      toast({
        title: "Bluetooth Unavailable",
        description: "Bluetooth is not available on this device.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsScanning(true);
      setDiscoveredDevices([]);

      await BleClient.requestLEScan(
        {
          services: [], // Scan for all services
          allowDuplicates: false,
        },
        (result) => {
          if (result.device) {
            setDiscoveredDevices(prev => {
              // Check if the device is already in the list
              const exists = prev.some(d => d.deviceId === result.device.deviceId);
              if (!exists) {
                return [...prev, result.device];
              }
              return prev;
            });
          }
        }
      );

      // Stop scanning after 10 seconds
      setTimeout(async () => {
        if (isScanning) {
          await stopScan();
        }
      }, 10000);
    } catch (error) {
      console.error('Scan error:', error);
      setIsScanning(false);
      toast({
        title: "Scan Failed",
        description: "Failed to scan for devices. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const stopScan = async () => {
    try {
      await BleClient.stopLEScan();
      setIsScanning(false);
    } catch (error) {
      console.error('Error stopping scan:', error);
    }
  };

  const connectToDevice = async (deviceId: string) => {
    try {
      await BleClient.connect(deviceId);
      const device = discoveredDevices.find(d => d.deviceId === deviceId) || null;
      setConnectedDevice(device);
      toast({
        title: "Connected",
        description: `Connected to ${device?.name || 'device'}`,
      });
    } catch (error) {
      console.error('Connection error:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to the device.",
        variant: "destructive"
      });
    }
  };

  const disconnectDevice = async () => {
    if (connectedDevice) {
      try {
        await BleClient.disconnect(connectedDevice.deviceId);
        setConnectedDevice(null);
        toast({
          title: "Disconnected",
          description: `Disconnected from ${connectedDevice.name || 'device'}`,
        });
      } catch (error) {
        console.error('Disconnect error:', error);
        toast({
          title: "Disconnect Failed",
          description: "Failed to disconnect from the device.",
          variant: "destructive"
        });
      }
    }
  };

  const value = {
    isBluetoothAvailable,
    isScanning,
    connectedDevice,
    discoveredDevices,
    startScan,
    stopScan,
    connectToDevice,
    disconnectDevice
  };

  return (
    <BluetoothContext.Provider value={value}>
      {children}
    </BluetoothContext.Provider>
  );
};
