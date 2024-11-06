import { ensureTrailingSlash } from '@/utils/helper';
import { BaseQueryFn } from '@reduxjs/toolkit/query';
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { Session } from 'next-auth';
import { getSession } from 'next-auth/react';
import { setSession } from './slices/authenticateSlice';

export type Response<T> = {
  status?: number;
  data: T;
  error?: {
    status: number;
    data: string;
  };
};

export class HttpClient {
  private client: AxiosInstance;

  constructor(
    baseUrl: string = typeof window === 'undefined' ? '' : 'api/proxy'
  ) {
    this.client = axios.create({
      baseURL:
        ensureTrailingSlash(
          typeof window !== 'undefined'
            ? window.location.origin
            : process.env.API_BASE_URL
        ) + baseUrl,
    });
    this.client.interceptors.request.use(
      async (config: InternalAxiosRequestConfig<any>) => {
        const account: any = config.session;
        const isLoggedIn = account?.user;

        config.headers.Accept = 'application/json';
        config.headers['Content-Type'] = 'application/json';
        if (isLoggedIn) {
          config.headers.Authorization = `Bearer ${account?.access}`;
        }

        return config;
      }
    );
  }

  public useResponseInterceptor = (
    success:
      | ((
          value: AxiosResponse<any, any>
        ) => AxiosResponse<any, any> | Promise<AxiosResponse<any, any>>)
      | undefined,
    reject?: ((error: any) => any) | undefined
  ) => {
    return this.client.interceptors.response.use(success, reject);
  };

  async request(config: AxiosRequestConfig<any> = {}): Promise<Response<any>> {
    return new Promise((resolve, reject) => {
      this.client
        .request(config)
        .then((resp) => resolve(resp))
        .catch((resp: any) => {
          reject(resp);
        });
    });
  }
}

const axiosBaseQuery =
  (
    {
      baseUrl,
      useAuth: useGlobalAuth,
    }: { baseUrl: string; useAuth?: boolean } = { baseUrl: '' }
  ): BaseQueryFn<
    {
      url: string;
      method: AxiosRequestConfig['method'];
      data?: AxiosRequestConfig['data'];
      useAuth?: AxiosRequestConfig['useAuth'];
    },
    Response<any>,
    unknown
  > =>
  async ({ url, method, data, useAuth }: any, { getState, dispatch }: any) => {
    const client = new HttpClient();

    const fetch = async (session?: Session | null): Promise<Response<any>> => {
      try {
        const result = await client.request({
          url: baseUrl + url,
          method,
          data,
          session,
          useAuth,
        });
        return { data: result.data };
      } catch (error) {
        let err = error as Response<any>;
        return err;
      }
    };

    client.useResponseInterceptor(
      (response) => response,
      async (err) => {
        return Promise.reject({
          error: { status: err.response?.status, data: err.response?.data },
        });
      }
    );

    const state = getState();
    let session = state.auth.session;
    if ((useAuth || useGlobalAuth) && !session) {
      session = await getSession();
      if (session) {
        dispatch(setSession(session));
      }
    }
    return await fetch(session);
  };

export default axiosBaseQuery;
