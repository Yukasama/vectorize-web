import axios, { AxiosInstance } from 'axios';
import https from 'node:https';

const httpsAgent = new https.Agent({ rejectUnauthorized: false });

export const client: AxiosInstance = axios.create({
  baseURL: 'https://localhost/v1',
  httpsAgent,
  timeout: 10000,
});
