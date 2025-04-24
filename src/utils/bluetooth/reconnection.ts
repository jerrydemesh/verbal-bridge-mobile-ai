
import { BleDevice } from '@capacitor-community/bluetooth-le';
import { BleClient } from '@capacitor-community/bluetooth-le';
import { toast } from '@/hooks/use-toast';

export const attemptReconnect = async (
  lastConnectedDeviceId: string | null,
  reconnectAttemptsRef: React.MutableRefObject<number>,
  reconnectTimeoutRef: React.MutableRefObject<number | null>,
  discoveredDevices: BleDevice[],
  setConnectedDevice: (device: BleDevice | null) => void
) => {
  if (!lastConnectedDeviceId) return;
  
  try {
    console.log(`Reconnection attempt ${reconnectAttemptsRef.current + 1}`);
    await BleClient.connect(lastConnectedDeviceId);
    
    const device = discoveredDevices.find(d => d.deviceId === lastConnectedDeviceId);
    setConnectedDevice(device || {
      deviceId: lastConnectedDeviceId,
      name: 'Reconnected Device'
    });
    
    reconnectAttemptsRef.current = 0;
    toast({
      title: "Reconnected",
      description: "Successfully reconnected to Bluetooth device",
    });
  } catch (error) {
    console.error('Reconnection failed:', error);
    
    const delay = Math.min(1000 * (2 ** reconnectAttemptsRef.current), 30000);
    reconnectAttemptsRef.current++;
    
    console.log(`Reconnection failed. Trying again in ${delay}ms`);
    reconnectTimeoutRef.current = window.setTimeout(() => {
      if (reconnectAttemptsRef.current < 5) {
        attemptReconnect(
          lastConnectedDeviceId,
          reconnectAttemptsRef,
          reconnectTimeoutRef,
          discoveredDevices,
          setConnectedDevice
        );
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
