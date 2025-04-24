
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { BleClient, BleDevice } from '@capacitor-community/bluetooth-le';
import { App } from '@capacitor/app';
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
  const [isBluetoothAvailable, setIsBluetoothAvailable] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState<BleDevice | null>(null);
  const [discoveredDevices, setDiscoveredDevices] = useState<BleDevice[]>([]);
  const [isBackgroundModeEnabled, setIsBackgroundModeEnabled] = useState(false);
  
  // References to store device information for reconnection
  const lastConnectedDeviceIdRef = useRef<string | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const reconnectAttemptsRef = useRef(0);

  useEffect(() => {
    const initializeBluetooth = async () => {
      try {
        await BleClient.initialize({ androidNeverForLocation: false });
        setIsBluetoothAvailable(true);
        console.log("Bluetooth initialized successfully");
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

    // Set up event listeners for app state changes
    const appStateChangeListener = App.addListener('appStateChange', ({ isActive }) => {
      console.log('App state changed. Is active:', isActive);
      
      if (isActive) {
        console.log('App is active, checking for device reconnection');
        handleAppResume();
      } else {
        console.log('App is inactive');
        // The app is going to background, might need special handling
        if (isBackgroundModeEnabled && connectedDevice) {
          console.log('Background mode is enabled, maintaining connection');
          // Additional code to maintain connection could go here
        }
      }
    });

    return () => {
      // Cleanup listeners
      appStateChangeListener.remove();
      
      // Disconnect device if connected
      if (connectedDevice) {
        BleClient.disconnect(connectedDevice.deviceId)
          .catch(error => console.error('Error disconnecting device during cleanup:', error));
      }
      
      // Clear any pending reconnect attempts
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };
  }, [connectedDevice, isBackgroundModeEnabled]);

  // Handle app resume - attempt to reconnect if needed
  const handleAppResume = async () => {
    if (isBackgroundModeEnabled && lastConnectedDeviceIdRef.current && !connectedDevice) {
      console.log('Attempting to reconnect to device:', lastConnectedDeviceIdRef.current);
      attemptReconnect();
    }
  };

  // Implement exponential backoff for reconnection attempts
  const attemptReconnect = async () => {
    if (!lastConnectedDeviceIdRef.current) return;
    
    try {
      console.log(`Reconnection attempt ${reconnectAttemptsRef.current + 1}`);
      await BleClient.connect(lastConnectedDeviceIdRef.current);
      
      // Find device in discovered devices
      const device = discoveredDevices.find(d => d.deviceId === lastConnectedDeviceIdRef.current);
      setConnectedDevice(device || {
        deviceId: lastConnectedDeviceIdRef.current,
        name: 'Reconnected Device'
      });
      
      reconnectAttemptsRef.current = 0;
      toast({
        title: "Reconnected",
        description: "Successfully reconnected to Bluetooth device",
      });
    } catch (error) {
      console.error('Reconnection failed:', error);
      
      // Implement exponential backoff
      const delay = Math.min(1000 * (2 ** reconnectAttemptsRef.current), 30000);
      reconnectAttemptsRef.current++;
      
      console.log(`Reconnection failed. Trying again in ${delay}ms`);
      reconnectTimeoutRef.current = window.setTimeout(() => {
        if (reconnectAttemptsRef.current < 5) {
          attemptReconnect();
        } else {
          console.log('Maximum reconnection attempts reached');
          reconnectAttemptsRef.current = 0;
          toast({
            title: "Reconnection Failed",
            description: "Please manually reconnect to your device",
            variant: "destructive"
          });
        }
      }, delay);
    }
  };

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
      lastConnectedDeviceIdRef.current = deviceId;
      
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
        lastConnectedDeviceIdRef.current = null;
        
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

  const toggleBackgroundMode = () => {
    setIsBackgroundModeEnabled(prev => !prev);
    toast({
      title: isBackgroundModeEnabled ? "Background Mode Disabled" : "Background Mode Enabled",
      description: isBackgroundModeEnabled 
        ? "Device connection will not be maintained when app is in background" 
        : "Device connection will be maintained when app is in background",
    });
  };

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
