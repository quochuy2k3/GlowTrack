import { API_URL } from '@/constants';
import axios, { AxiosInstance } from 'axios';

import { requestInterceptor, responseInterceptor } from './utils';

const defaultHeaders = {
  'Content-Type': 'application/json',
  LANG: 'vi',
  Timezone: 'Asia/Saigon',
} as const;
const mediaHeaders = {
  'Content-Type': 'multipart/form-data',
  LANG: 'vi',
  Timezone: 'Asia/Saigon',
} as const;

const mediaAPI: AxiosInstance = axios.create({
  baseURL: `${API_URL}/media`,
  headers: mediaHeaders,
});

const coupleAPI: AxiosInstance = axios.create({
  baseURL: `${API_URL}/couple`,
  headers: defaultHeaders,
});

const lmsAPI: AxiosInstance = axios.create({
  baseURL: `${API_URL}/lms`,
  headers: defaultHeaders,
});

const userAPI: AxiosInstance = axios.create({
  baseURL: `${API_URL}/user`,
  headers: defaultHeaders,
});

const routineAPI: AxiosInstance = axios.create({
  baseURL: `${API_URL}/routine`,
  headers: defaultHeaders,
});

const scanAPI: AxiosInstance = axios.create({
  baseURL: `${API_URL}/predict`,
  headers: mediaHeaders,
});

const trackerAPI: AxiosInstance = axios.create({
  baseURL: `${API_URL}/tracker`,
  headers: defaultHeaders,
});

const requestAPI: AxiosInstance = axios.create({
  baseURL: `${API_URL}/request`,
  headers: defaultHeaders,
});

const authAPI: AxiosInstance = axios.create({
  baseURL: `${API_URL}/auth`,
  headers: defaultHeaders,
});

const talentManagementAPI: AxiosInstance = axios.create({
  baseURL: `${API_URL}/talent-management`,
  headers: defaultHeaders,
});
trackerAPI.interceptors.request.use(requestInterceptor);
trackerAPI.interceptors.response.use(responseInterceptor);

coupleAPI.interceptors.request.use(requestInterceptor);
coupleAPI.interceptors.response.use(responseInterceptor);

requestAPI.interceptors.request.use(requestInterceptor);
requestAPI.interceptors.response.use(responseInterceptor);

scanAPI.interceptors.request.use(requestInterceptor);
scanAPI.interceptors.response.use(responseInterceptor);

routineAPI.interceptors.request.use(requestInterceptor);
routineAPI.interceptors.response.use(responseInterceptor);

userAPI.interceptors.request.use(requestInterceptor);
userAPI.interceptors.response.use(responseInterceptor);

mediaAPI.interceptors.request.use(requestInterceptor);
mediaAPI.interceptors.response.use(responseInterceptor);

talentManagementAPI.interceptors.request.use(requestInterceptor);
talentManagementAPI.interceptors.response.use(responseInterceptor);

authAPI.interceptors.request.use(requestInterceptor);
authAPI.interceptors.response.use(responseInterceptor);

function setupBearerAuthorization(token: string) {
  lmsAPI.defaults.headers.common.Authorization = `Bearer ${token}`;
  talentManagementAPI.defaults.headers.common.Authorization = `Bearer ${token}`;
  authAPI.defaults.headers.common.Authorization = `Bearer ${token}`;
  routineAPI.defaults.headers.common.Authorization = `Bearer ${token}`;
  userAPI.defaults.headers.common.Authorization = `Bearer ${token}`;
  scanAPI.defaults.headers.common.Authorization = `Bearer ${token}`;
  trackerAPI.defaults.headers.common.Authorization = `Bearer ${token}`;
  requestAPI.defaults.headers.common.Authorization = `Bearer ${token}`;
  coupleAPI.defaults.headers.common.Authorization = `Bearer ${token}`;
}

export {
  lmsAPI,
  talentManagementAPI,
  authAPI,
  setupBearerAuthorization,
  routineAPI,
  userAPI,
  mediaAPI,
  scanAPI,
  trackerAPI,
  requestAPI,
  coupleAPI,
};

export default lmsAPI;
