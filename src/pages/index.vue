<template>
  <div class="index">github pages + github action</div>
</template>

<script setup lang="ts">
  import { preLogin, preLoginDataRes, preLoginReq } from '@/api/user';
  import { storage } from '@/utils/storage';
  import { getPayEnv } from '@/utils/util';
  const codePlate = ref('');
  const appType = ref(1);
  const preLoginData = ref<preLoginDataRes>({
    id: '',
    sign: '',
    type: '',
  });
  onMounted(() => {
    removeLoc();
    codePlate.value = storage.getItem('codePlate') || '';
    console.log('codePlate.value', codePlate.value);
    preLoginMethod();
  });
  function removeLoc() {
    storage.removeItem('token');
    storage.removeItem('userCode');
    storage.removeItem('user_openid');
  }
  function preLoginMethod() {
    const env = getPayEnv();
    if (env == 'wx') {
      appType.value = 2;
    }
    if (env == 'alipay') {
      appType.value = 1;
    }
    const params: preLoginReq = {
      appType: appType.value,
      qrCodeEncodeStr: codePlate.value,
    };
    preLogin(params).then((preLoginRes) => {
      preLoginData.value = preLoginRes.data;
      storage.setItem('codePlateAndToken', JSON.stringify(preLoginData.value));
      if (env == 'wx') {
        getWechatCode();
      }
      if (env == 'alipay') {
        getAliCode();
      }
    });
  }
  function getWechatCode() {
    const appid = preLoginData.value.id;
    const hostUrl = window.location.protocol + '//' + window.location.host;
    const local = `${hostUrl}/payfly/index.html#/pinia`;
    // const local = `https://yjf.postar.cn/payfly/index.html#/pages/index/index`
    // 不存在就打开上面的地址进行授权
    window.location.href =
      'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' +
      appid +
      '&redirect_uri=' +
      encodeURIComponent(local) +
      '&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect';
  }
  function getAliCode() {
    const appid = preLoginData.value.id;
    const hostUrl = window.location.protocol + '//' + window.location.host;
    const local = `${hostUrl}/payfly/index.html#/pinia`;
    // const local = `https://yjf.postar.cn/payfly/index.html#/pages/index/index`
    // 不存在就打开上面的地址进行授权
    // https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=APPID&scope=SCOPE&redirect_uri=ENCODED_URL
    window.location.href =
      'https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=' +
      appid +
      '&redirect_uri=' +
      encodeURIComponent(local) +
      '&scope=auth_base ';
  }
</script>

<style lang="less" scoped>
  .index {
    :deep(.van-cell) {
      background-color: #ddd;
      margin-top: 16px;
    }
  }
</style>
