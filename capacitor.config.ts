
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.fe172d912af140b19da0b8687810aead',
  appName: 'verbal-bridge-mobile-ai',
  webDir: 'dist',
  server: {
    url: 'https://fe172d91-2af1-40b1-9da0-b8687810aead.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    CapacitorHttp: {
      enabled: true
    }
  }
};

export default config;
