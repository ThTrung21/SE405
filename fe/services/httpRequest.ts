import { AxiosInstance } from "axios";
import { axiosInstance, IConfig } from "./initRequest";

class HttpRequest {
  api: AxiosInstance;

  constructor() {
    this.api = axiosInstance;
  }

  async get(url: string, config?: IConfig) {
    return this.api.get(url, config);
  }

  async post(url: string, data: any, config?: IConfig) {
    return this.api.post(url, data, config);
  }

  async put(url: string, data: any, config?: IConfig) {
    return this.api.put(url, data, config);
  }

  async patch(url: string, data?: any, config?: IConfig) {
    return this.api.patch(url, data, config);
  }
  async put2(url: string, config?: IConfig) {
    return this.api.put(url, config);
  }
  async delete(url: string, config?: IConfig) {
    return this.api.delete(url, config);
  }
}

const httpRequest = new HttpRequest();

export default httpRequest;
