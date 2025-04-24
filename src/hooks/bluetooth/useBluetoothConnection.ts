
import { useState, useRef } from 'react';
import { BleClient, BleDevice } from '@capacitor-community/bluetooth-le';
import { toast } from '@/hooks/use-toast';
import { attemptReconnect } from '@/utils/bluetooth/reconnection';

export const useBluetoothConnection = (discoveredDevices: BleDevice[]) => {
  const [connectedDevice, setConnectedDevice] = useState<BleDevice | null>(null);
  const [isBackgroundModeEnabled, setIsBackgroundModeEnabled] = useState(false);
  const lastConnectedDeviceIdRef = useRef<string | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const reconnectAttemptsRef = useRef(0);

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

  const handleAppResume = async () => {
    if (isBackgroundModeEnabled && lastConnectedDeviceIdRef.current && !connectedDevice) {
      console.log('Attempting to reconnect to device:', lastConnectedDeviceIdRef.current);
      attemptReconnect(
        lastConnectedDeviceIdRef.current,
        reconnectAttemptsRef,
        reconnectTimeoutRef,
        discoveredDevices,
        setConnectedDevice
      );
    }
  };

  return {
    connectedDevice,
    isBackgroundModeEnabled,
    connectToDevice,
    disconnectDevice,
    toggleBackgroundMode,
    handleAppResume,
    lastConnectedDeviceIdRef,
    reconnectTimeoutRef,
  };
};
