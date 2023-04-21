<template>
  <router-view />
</template>

<script setup lang="ts">
  import debug from '@/utils/debug';
  import watermark from '@/utils/lib/watermark';
  import copyPaste from '@/utils/lib/copy-paste';
  import { storage } from '@/utils/storage';

  onMounted(() => {
    // 因为debug是存入localStorage中的，刷新页面会从localStorage取出，根据debug控制是否隐藏
    debug.init();
    copyPaste.disable();
    getAllCode();
    storage.setItem('key', '123');
  });
  function getAllCode(): void {
    let codePlate = getQueryParams().codePlate;
    if (codePlate) storage.setItem('codePlate', codePlate);
    const ua = navigator.userAgent.toLowerCase();
    // 微信
    if (ua.match(/MicroMessenger/i)?.[0].toLowerCase() === 'micromessenger') getWechatCode();
    //  支付宝
    if (ua.match(/Alipay/i)?.[0].toLowerCase() === 'alipay') getAliCode();
  }
  // 获取微信code
  function getWechatCode() {
    let appid = 'wxd0a90041611dd75c'; //"wxfa5ec3d5e9da55d2"; //微信APPid
    let code = getQueryParams().code; //是否存在code
    let local = window.location.href;
    if (code == null || code === '') {
      //不存在就打开上面的地址进行授权
      window.location.href =
        'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' +
        appid +
        '&redirect_uri=' +
        encodeURIComponent(local) +
        '&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect';
    } else {
      storage.setItem('code', code);
    }
  }
  // 获取支付宝code
  function getAliCode() {
    let appid = '2021003188686367'; //'2021003188686367'//APPid
    let code = getQueryParams().auth_code; //是否存在code
    let local = 'https://polardaytest.postar.cn/payfly/index.html#/'; // window.location.href;
    if (code == null || code === '') {
      //不存在就打开上面的地址进行授权
      //openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=APPID&scope=SCOPE&redirect_uri=ENCODED_URL
      window.location.href =
        'https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=' +
        appid +
        '&redirect_uri=' +
        encodeURIComponent(local) +
        '&scope=auth_base ';
    } else {
      storage.setItem('code', code);
    }
  }
  // 得到参数
  function getQueryParams(): Record<string, string> {
    const result: Record<string, string> = {}; // 存储参数的对象
    // const urlString = location.href;
    const urlString =
      'https://polardaytest.postar.cn/payfly/index.html?codePlate=ZExrT0YyOSt1UzQxdDZOaDV5eEx5QT09';
    // 使用正则表达式提取 URL 中的查询参数
    const reg = /[?&][^?&]+=[^?&]+/g;
    const found = urlString.match(reg);
    if (found) {
      found.forEach((item) => {
        let temp = item.substring(1).split('='); // = 分割
        let key = temp[0];
        let value = temp[1];
        result[key] = value;
      });
    }
    return result;
  }
  // 删除本地信息
  function removeLoc() {
    storage.removeItem('userCode');
    storage.removeItem('token');
    storage.removeItem('user_openid');
    storage.removeItem('codePlate');
  }
  onBeforeUnmount(() => {
    watermark.remove();
    copyPaste.enable();
    removeLoc();
  });
</script>

<style>
  #app {
    font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-text-size-adjust: 100%;
  }
</style>
