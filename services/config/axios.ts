import axios, { type AxiosInstance } from 'axios';
import { requestInterceptor, responseInterceptor } from './utils';
import { API_URL } from '@/constants';

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

routineAPI.interceptors.request.use(requestInterceptor);
routineAPI.interceptors.response.use(responseInterceptor);

userAPI.interceptors.request.use(requestInterceptor);
userAPI.interceptors.response.use(responseInterceptor);

const talentManagementAPI: AxiosInstance = axios.create({
  baseURL: `${API_URL}/talent-management`,
  headers: defaultHeaders,
});
mediaAPI.interceptors.request.use(requestInterceptor);
mediaAPI.interceptors.response.use(responseInterceptor);

talentManagementAPI.interceptors.request.use(requestInterceptor);
talentManagementAPI.interceptors.response.use(responseInterceptor);

const authAPI: AxiosInstance = axios.create({
  baseURL: `${API_URL}/auth`,
  headers: defaultHeaders,
});

authAPI.interceptors.request.use(requestInterceptor);
authAPI.interceptors.response.use(responseInterceptor);

function setupBearerAuthorization(token: string) {
  lmsAPI.defaults.headers.common.Authorization = `Bearer ${token}`;
  talentManagementAPI.defaults.headers.common.Authorization = `Bearer ${token}`;
  authAPI.defaults.headers.common.Authorization = `Bearer ${token}`;
  routineAPI.defaults.headers.common.Authorization = `Bearer ${token}`;
  userAPI.defaults.headers.common.Authorization = `Bearer ${token}`;
}

export {
  lmsAPI,
  talentManagementAPI,
  authAPI,
  setupBearerAuthorization,
  routineAPI,
  userAPI,
  mediaAPI,
};

export default lmsAPI;
