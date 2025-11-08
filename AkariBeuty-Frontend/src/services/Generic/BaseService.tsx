/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/Generic/BaseService.tsx
import api from "../api";

type HttpMethod = "get" | "post" | "put" | "delete" | "patch";

export type BaseServiceOptions = {
  method: HttpMethod;
  url: string;
  params?: any;
  data?: any;
  headers?: Record<string, string>;
  /** se false, não envia Authorization */
  auth?: boolean;
};

export default class BaseService {
  private opts: BaseServiceOptions;

  constructor(options: BaseServiceOptions) {
    this.opts = { auth: true, ...options };
  }

  async request<T = any>(): Promise<T> {
    const { method, url, params, data, headers, auth } = this.opts;

    // A flag useAuth é lida pelo interceptador em api.ts
    const config: any = {
      method,
      url,
      params,
      data,
      headers,
      useAuth: auth !== false,
    };

    const response = await api.request<T>(config);
    return response.data as T; // axios lança erro se não for 2xx
  }
}
