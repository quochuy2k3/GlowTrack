import axios, { type AxiosInstance } from 'axios';
import { requestInterceptor, responseInterceptor } from './utils';
import { API_URL } from '@/constants';

const defaultHeaders = {
  'Content-Type': 'application/json',
  LANG: 'vi',
  Timezone: 'Asia/Saigon',
} as const;

const lmsAPI: AxiosInstance = axios.create({
  baseURL: `${API_URL}/lms`,
  headers: defaultHeaders,
});

lmsAPI.interceptors.request.use(requestInterceptor);
lmsAPI.interceptors.response.use(responseInterceptor);

const talentManagementAPI: AxiosInstance = axios.create({
  baseURL: `${API_URL}/talent-management`,
  headers: defaultHeaders,
});

talentManagementAPI.interceptors.request.use(requestInterceptor);
talentManagementAPI.interceptors.response.use(responseInterceptor);

const authAPI: AxiosInstance = axios.create({
  baseURL: `${API_URL}/api/v4/auth`,
  headers: defaultHeaders,
});

authAPI.interceptors.request.use(requestInterceptor);
authAPI.interceptors.response.use(responseInterceptor);

function setupBearerAuthorization(token: string) {
  lmsAPI.defaults.headers.common.Authorization = `Bearer ${token}`;
  talentManagementAPI.defaults.headers.common.Authorization = `Bearer ${token}`;
  authAPI.defaults.headers.common.Authorization = `Bearer ${token}`;
}

export { lmsAPI, talentManagementAPI, authAPI, setupBearerAuthorization };

export default lmsAPI;
