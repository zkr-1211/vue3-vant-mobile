import { storage } from '@/utils/storage';
import { getPayEnv } from '@/utils/util';
import { h5Pay, completedOrder, cancelPay, h5PayRes } from '@/api/code';
export function usePay(orderId: string) {
  return new Promise((resolve) => {
    const env = getPayEnv();
    h5Pay(orderId).then((payRes) => {
      const payInfo = payRes.data;
      if (env == 'wx') {
        onBridgeReady(payInfo);
        resolve('');
      }
      if (env == 'alipay') {
        const { extraData, orderId } = payInfo;
        if (window.AlipayJSBridge) {
          // eslint-disable-next-line no-undef
          window.AlipayJSBridge.call(
            'tradePay',
            {
              tradeNO: extraData?.prepayId,
            },
            (result: any) => {
              if (result.resultCode == 9000) {
                completedOrder(orderId);
                resolve('');
              } else {
                cancelPay(orderId);
              }
            }
          );
        }
      }
    });
  });
}
export function onBridgeReady(payInfo: h5PayRes) {
  return new Promise((resolve) => {
    const { extraData, orderId } = payInfo;
    const codePlateAndToken = JSON.parse(storage.getItem('codePlateAndToken'));
    const codePlateJson = codePlateAndToken;
    window.WeixinJSBridge.invoke(
      'getBrandWCPayRequest',
      {
        appId: codePlateJson?.appId, // 公众号ID，由商户传入
        timeStamp: extraData?.jsApiTimestamp, // 时间戳，自1970年以来的秒数
        nonceStr: extraData?.jsApiNoncestr, // 随机串
        package: extraData?.jsApiPackage,
        signType: extraData?.jsApiSignType, // 微信签名方式：
        paySign: extraData?.jsApiPaySign, // 微信签名
      },
      function (res: { err_msg: string }) {
        if (res.err_msg == 'get_brand_wcpay_request:ok') {
          resolve('');
          // 使用以上方式判断前端返回,微信团队郑重提示：
          // res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
        } else {
          cancelPay(orderId);
        }
      }
    );
  });
}
