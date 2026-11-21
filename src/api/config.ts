import { Platform } from 'react-native';

const defaultApiBaseUrl = Platform.OS === 'android'
  ? 'http://10.0.2.2:8080'
  : 'http://localhost:8080';

/** Shared backend base URL for API calls and OAuth redirects. */
export const API_BASE_URL = (process.env.EXPO_PUBLIC_API_URL ?? defaultApiBaseUrl).replace(/\/$/, '');
