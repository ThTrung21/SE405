import { AxiosInstance } from "axios";
import { axiosInstance, IConfig } from "./initRequest";

class HttpRequest {
  api: AxiosInstance;

  constructor() {
    this.api = axiosInstance;
  }

  async get<T = any>(url: string, config?: IConfig): Promise<T> {
    return this.api.get(url, config);
  }

  async post<T = any>(url: string, data: any, config?: IConfig): Promise<T> {
    return this.api.post(url, data, config);
  }

  async put<T = any>(url: string, data: any, config?: IConfig): Promise<T> {
    return this.api.put(url, data, config);
  }

  async patch<T = any>(url: string, data?: any, config?: IConfig): Promise<T> {
    return this.api.patch(url, data, config);
  }
  async put2<T = any>(url: string, config?: IConfig): Promise<T> {
    return this.api.put(url, config);
  }
  async delete<T = any>(url: string, config?: IConfig): Promise<T> {
    return this.api.delete(url, config);
  }
}

const httpRequest = new HttpRequest();

export default httpRequest;
