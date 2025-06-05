import jwtDecode from "jwt-decode";

export function getExpiredTime(token: string) {
  const decoded: any = jwtDecode(token);
  return decoded.exp;
}
