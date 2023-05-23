import http, { Response } from '@/utils/http';

const flag = 'payfly';

export interface loginRes {
  access_token: string;
  expires_in: number;
  user_openid: string;
}

export interface preLoginReq {
  appType: string | number;
  qrCodeEncodeStr: string;
}
export interface loginReq extends preLoginReq {
  appId: string;
  data: {
    code: string;
    scope: string;
  };
  sign: number;
}
export interface parseQRCodeRes {
  appType: string | number;
  cpId: number;
  cpName: string;
  cpState: number;
  cpUrl: string;
  endDate: string;
  startDate: string;
  decorateJson: string;
  version: string;
}
export interface createOrderReq {
  version: string;
  amount: number;
  componentNames: string[];
  qrCodeEncodeStr: string;
  payContent: string;
  payChannel: number;
}

export interface h5PayRes {
  extraData: {
    jsApiTimestamp: string;
    jsApiNoncestr: string;
    jsApiPackage: string;
    jsApiSignType: string;
    jsApiPaySign: string;
    prepayId: string;
  };
  orderId: string;
}
// 登录
export const login = async (data: loginReq) => {
  return await http.post<Response<loginRes>>(`/${flag}/h5/login`, data);
};

// 支付
export const h5Pay = async (orderId: string) => {
  return await http.post<Response<h5PayRes>>(`/${flag}/h5/pay/`, orderId);
};

// 取消支付
export const cancelPay = async (orderId: string) => {
  return await http.post(`/${flag}/h5/pay/cancel/`, orderId);
};

// 完成订单
export const completedOrder = async (orderId: string) => {
  return await http.post(`/${flag}/h5/pay/completedOrder/`, orderId);
};

// parseQRCode解析码牌信息
export const parseQRCode = async (encodeStr: string) => {
  return await http.get<Response<parseQRCodeRes>>(`/${flag}/h5/codePlate/parse/${encodeStr}`);
};

// // 创建订单
export const createOrder = async (data: createOrderReq) => {
  return await http.post(`/${flag}/h5/pay/createOrder`, data);
};
