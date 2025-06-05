export interface ILoginPayload {
    phone: string;
    password: string;
  }
  
  export interface TokenPayload {
    accessToken: string;
    refreshToken: string;
  }
