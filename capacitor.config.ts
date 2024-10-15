import type { CapacitorConfig } from '@capacitor/cli';
import { networkInterfaces } from 'os';

function getLocalIpAddress() {
  const nets = networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return '0.0.0.0'; // Fallback
}
console.log('getLocalIpAddress()',getLocalIpAddress());

const config: CapacitorConfig = {
  appId: 'com.dmarie.property-manager',
  appName: 'Property Manager',
  webDir: 'build',
  bundledWebRuntime: false,
  ios: {
    contentInset: 'automatic'
  },
  server: {
    url: `http://${getLocalIpAddress()}:5173`,
    cleartext: true
  }
};

export default config;