import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.aiexamresult.app',
  appName: 'All India Exam Result',
  webDir: '.next',
  server: {
    url: 'https://www.aiexamresult.com',
    cleartext: false,
    androidScheme: 'https'
  },
  android: {
    buildOptions: {
      keystorePath: undefined
    }
  }
};

export default config;
