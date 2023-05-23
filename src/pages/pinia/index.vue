<template>
  <Temlate ref="temlateRef" :parseQRodeInfo="parseQRCodeInfo" @subPay="toPay" />
</template>

<script setup lang="ts">
  import {
    login,
    parseQRCode,
    createOrder,
    createOrderReq,
    parseQRCodeRes,
    loginReq,
  } from '@/api/code';
  import Temlate from './temlate/index.vue';
  import { useUserStore } from '@/store';
  import { usePay } from '@/hooks/usePay';
  import { getPayEnv, getUrlCode, getQueryParams } from '@/utils/util';
  import { storage } from '@/utils/storage';
  const userStore = useUserStore();
  const temlateRef = ref<HTMLElement | null>(null);
  const codePlate = ref('');
  const code = ref('');
  let parseQRCodeInfo = ref<parseQRCodeRes>({
    appType: '',
    cpId: 0,
    cpName: '',
    cpState: 0,
    cpUrl: '',
    endDate: '',
    startDate: '',
    decorateJson: '',
    version: '',
  });
  const getParseQRCode = async () => {
    const codestr = decodeURIComponent(codePlate.value).replace(/"/g, '');
    const parseQRCodeRes = await parseQRCode(codestr);
    parseQRCodeInfo.value = parseQRCodeRes.data;
    console.log('parseQRCodeInfo', parseQRCodeInfo);
  };
  const getEnvJumpCode = async () => {
    const env = getPayEnv();
    if (env == 'wx') {
      // 在微信中打开
      code.value = getUrlCode().code;
    }
    if (env == 'alipay') {
      //  支付宝
      code.value = getQueryParams().auth_code;
    }
    if (code.value) {
      storage.setItem('userCode', code.value);
    }
    codePlate.value = storage.getItem('codePlate') || '';
    if (codePlate.value && code.value) {
      loginInfo();
    }
  };
  const loginInfo = async () => {
    const env = getPayEnv();
    // 1支付宝，2微信
    let appType = 2;
    let scope = '';
    if (env == 'wx') {
      // 在微信中打开
      appType = 2;
      scope = 'snsapi_base';
    }
    if (env == 'alipay') {
      //  支付宝
      appType = 1;
      scope = 'auth_base';
    }
    const token = storage.getItem('token');
    const codePlateAndToken = JSON.parse(storage.getItem('codePlateAndToken'));
    console.log('codePlateAndToken', codePlateAndToken);
    const params: loginReq = {
      appId: codePlateAndToken?.id,
      appType: appType,
      data: {
        code: code.value,
        scope: scope,
      },
      sign: codePlateAndToken?.sign,
      qrCodeEncodeStr: codePlate.value,
    };
    console.log(params);
    if (token) {
      getParseQRCode();
      return;
    }
    const userInfoRes = await login(params);
    storage.setItem('token', userInfoRes.data.access_token, 60 * 60 * 24);
    storage.setItem('user_openid', userInfoRes.data.user_openid, 60 * 60 * 24);
    getParseQRCode();
  };
  const toPay = async (params: createOrderReq) => {
    const orderData = await createOrder(params); // 创建订单
    await usePay(orderData.data.orderId);
    // setTimeout(() => {
    //   this.$utils.showMsg('支付成功');
    // }, 300);
    // if (this.$refs.temlateRef) {
    //   this.$refs.temlateRef.resetFrom();
    // }
  };
  getEnvJumpCode();
</script>

<style></style>
