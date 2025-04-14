import crypto from 'crypto';
import https from 'https';

const httpsAgent = new https.Agent({
  secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
});
export default function({
  $axios, redirect, config,
}) {
  $axios.defaults.httpsAgent = httpsAgent;
  $axios.defaults.timeout = 30000;
  $axios.interceptors.request.use((config) => {
    if (config.url.includes('api-ccte')) {
      const modifiedConfig = {
        ...config,
        headers: {
          'x-api-key': process.env.API_KEY,
          ...config.headers,
        },
      };
      return modifiedConfig;
    }
    return config;
  });
  // $axios.defaults.headers['x-api-key'] = process.env.API_KEY;
  $axios.onRequest(() => {
  });
}
