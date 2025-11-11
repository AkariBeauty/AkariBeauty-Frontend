/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "../api";

type HttpMethod = "get" | "post" | "put" | "delete" | "patch";

export type BaseServiceOptions = {
  method: HttpMethod;
  url: string;
  params?: any;
  data?: any;
  headers?: Record<string, string>;
  auth?: boolean; // false = não envia Authorization
};

export default class BaseService {
  private opts: BaseServiceOptions;
  constructor(options: BaseServiceOptions) {
    this.opts = { auth: true, ...options };
  }

  async request<T = any>(): Promise<T> {
    const { method, url, params, data, headers, auth } = this.opts;
    const config: any = { method, url, params, data, headers, useAuth: auth !== false };
    const response = await api.request<T>(config); // axios lança erro quando não-2xx
    return response.data as T;
  }
}
