import http, { Response } from '@/utils/http';
const flag = 'payfly';
export interface preLoginReq {
  appType: number;
  qrCodeEncodeStr: string;
}
export interface preLoginDataRes {
  id: string;
  sign: string;
  type: string;
}
export const preLogin = async (data: preLoginReq) => {
  return await http.post<Response<preLoginDataRes>>(`/${flag}/h5/login/pre`, data);
};
