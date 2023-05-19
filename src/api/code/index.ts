import http, { Response } from '@/utils/http';

const flag = 'payfly';

export interface preLoginReq {
  appType: number;
  qrCodeEncodeStr: string;
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
