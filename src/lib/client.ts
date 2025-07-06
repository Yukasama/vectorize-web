import axios, { AxiosInstance } from 'axios';
// eslint-disable-next-line unicorn/prefer-node-protocol
import https from 'https';

const httpsAgent = new https.Agent({ rejectUnauthorized: false });

export const client: AxiosInstance = axios.create({
  baseURL: 'https://vectorize.candlezone.eu/v1/api',
  httpsAgent,
  timeout: 10000,
});
