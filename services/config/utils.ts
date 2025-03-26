import { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { ServiceError } from '../error';

export function requestInterceptor(request: InternalAxiosRequestConfig<any>) {
  let query = new URLSearchParams(request.params).toString();
  if (query) {
    query = '?' + query;
  }

  console.log(
    '\x1b[45m%s\x1b[0m %s\x1b[32m%s\x1b[33m%s',
    request.method?.toUpperCase(),
    request?.baseURL || '',
    request.url,
    query
  );

  return request;
}

export function responseInterceptor(response: AxiosResponse<any>) {
  if (response?.data?.error_code) {
    let message = 'Unknown error';
    if (typeof response?.data?.message === 'string') {
      message = response?.data?.message;
    } else if (Array.isArray(response?.data?.message)) {
      message = response?.data?.message.join(', ');
    }
    throw new ServiceError(message);
  }

  return response.data;
}
