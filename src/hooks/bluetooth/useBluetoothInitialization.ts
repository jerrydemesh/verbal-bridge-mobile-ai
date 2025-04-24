
import { useState, useEffect } from 'react';
import { BleClient } from '@capacitor-community/bluetooth-le';
import { toast } from '@/hooks/use-toast';

export const useBluetoothInitialization = () => {
  const [isBluetoothAvailable, setIsBluetoothAvailable] = useState(false);

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
  }, []);

  return { isBluetoothAvailable };
};
