<template>
  <view class="temple-content page" :class="show ? 'html-view-stop' : 'html-view-scroll'">
    <view class="main-center">
      <view class="img-content">
        <img :src="from.banner" class="banner" alt="" />
        <view class="peishi">
          <img :src="returnUrl('temple/decoration.png')" class="banner crane zindex1" alt="" />
          <img :src="returnUrl('temple/curve.png')" class="banner curve zindex3" alt="" />
          <img :src="returnUrl('temple/basebg.png')" class="banner zindex2 basebg" alt="" />
        </view>
      </view>
      <view class="main-content">
        <view class="card">
          <view class="title">
            {{ from.title }}
          </view>
          <view class="content">
            {{ from.mome }}
          </view>
          <view class="bottom" />
        </view>
        <view class="formcardbg">
          <view class="type-box">
            <view class="input">
              <input
                ref="digtInput"
                v-model="from.amount"
                placeholder="请填写捐赠金额"
                color="rgba(116,27,26,0.8)"
                border="none"
                font-size="32rpx"
                :placeholder-class="
                  from.amount !== null && from.amount !== undefined
                    ? 'placeholderClass'
                    : 'placeholderClassShow'
                "
              />
            </view>
            <view class="input">
              <input
                v-model="from.username"
                placeholder="您可以输入姓名或匿名"
                color="rgba(116,27,26,0.8)"
                border="none"
                font-size="32rpx"
                :placeholder-class="'placeholderClass'"
              />
            </view>
          </view>
        </view>
      </view>
    </view>

    <view v-if="btnShow" class="main-bottom">
      <view class="submit">
        <img class="tradenoPay" :src="returnUrl('temple/payBtn.png')" alt="" @click="toPay" />
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { storage } from '@/utils';
  import { getPayEnv } from '@/utils/util';
  import temlateArrFn from './temlateArrFn';
  import { parseQRCodeRes } from '@/api/code';
  interface Props {
    parseQRCodeInfo: parseQRCodeRes;
  }
  const props = withDefaults(defineProps<Props>(), {
    parseQRCodeInfo: () => {
      return {
        appType: '',
        cpId: 0,
        cpName: '',
        cpState: 0,
        cpUrl: '',
        endDate: '',
        startDate: '',
        decorateJson: '',
        version: '',
      };
    },
  });
  const btnShow = ref(true);
  interface fromType {
    amount?: number;
    payChannel: number;
    payContent: string;
    mome: string;
    banner: string;
    title: string;
    bgm: string;
    bizType: string;
    username: string;
    cpName: string;
  }
  const from = ref<fromType>({
    amount: undefined,
    payChannel: 0,
    payContent: '',
    mome: '',
    banner: '',
    title: '',
    bgm: '',
    bizType: '',
    username: '',
    cpName: '',
  });
  const ids = ref({
    navbarId: '',
    fileUploadId: '',
    bannerId: '',
    textareaId: '',
    selectId: '',
    amountRandomId: '',
    inputId: '',
  });
  const emit = defineEmits(['subPay']);
  const show = ref(false);
  const current = ref('');
  const bizTypes = ref([]);

  const toPay = () => {
    const env = getPayEnv();
    const amount = (from.value.amount as number) / 100;

    const templateData = {
      banner: from.value.banner,
      bgm: from.value.bgm,
      title: from.value.title,
      mome: from.value.mome,
      bizType: '111',
      amount,
      userName: from.value.username || '',
      randomList: randomList.value || [],
      bizTypes: bizTypes.value || [],
      ids: ids.value,
    };
    const payContent = temlateArrFn(templateData);
    const componentNames = payContent.map((item) => item.component);
    console.log(props.parseQRCodeInfo);

    const params = {
      amount,
      componentNames,
      payContent: JSON.stringify(payContent),
      payChannel: 1,
      qrCodeEncodeStr: storage.getItem('codePlate') || '',
      version: props.parseQRCodeInfo.version,
    };
    if (env == 'wx') {
      // 在微信中打开
      params.payChannel = 2;
    }
    if (env == 'alipay') {
      params.payChannel = 1;
    }
    emit('subPay', params);
  };
  const resetFrom = () => {
    current.value = bizTypes.value[0];
    from.value.bizType = current.value;
    from.value.amount = undefined;
    from.value.username = '';
  };
  const returnUrl = (urlStr: string) => {
    if (urlStr) {
      return `https://scene-star.obs.cn-east-3.myhuaweicloud.com/yhk-cdn/payfly/${urlStr}`;
    }
  };
  const randomList = ref([]);
  // 随机
  const randomMethod = () => {
    if (randomList.value?.length > 0) {
      const index = Math.floor(Math.random() * randomList.value.length);
      from.value.amount = randomList.value[index];
    }
  };
  const router = useRouter();
  const goPage = () => {
    router.push('/login');
  };
  randomMethod();
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
