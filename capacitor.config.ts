import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.castanhadecaju.app',
  appName: 'Castanha de Caju',
  webDir: 'public',

  server: {
    url: 'https://castanha-de-caju.vercel.app/',
    cleartext: false
  }
};

export default config;