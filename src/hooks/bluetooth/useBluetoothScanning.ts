
import { useState } from 'react';
import { BleClient, BleDevice } from '@capacitor-community/bluetooth-le';
import { toast } from '@/hooks/use-toast';

export const useBluetoothScanning = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [discoveredDevices, setDiscoveredDevices] = useState<BleDevice[]>([]);

  const startScan = async () => {
    try {
      setIsScanning(true);
      setDiscoveredDevices([]);

      await BleClient.requestLEScan(
        {
          services: [],
          allowDuplicates: false,
        },
        (result) => {
          if (result.device) {
            setDiscoveredDevices(prev => {
              const exists = prev.some(d => d.deviceId === result.device.deviceId);
              if (!exists) {
                return [...prev, result.device];
              }
              return prev;
            });
          }
        }
      );

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

  return {
    isScanning,
    discoveredDevices,
    startScan,
    stopScan,
  };
};
