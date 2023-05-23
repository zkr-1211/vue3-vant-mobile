export const toPhoneCall = (mobile: number | string) => {
  const url = `tel:${mobile}`;
  window.location.href = url;
};

/**
 * 动态设置css全局变量实现旋转
 * transform: rotate(var(--image-rotate))
 * @param deg 旋转角度
 * @param prop css变量, 默认'--image-rotate'
 */
export const setRotate = (deg: string, prop = '--image-rotate') => {
  let rotate = document.documentElement.style.getPropertyValue(prop) || '0deg';
  if (typeof deg === 'string') {
    rotate = deg;
  } else {
    rotate = parseInt(rotate) + 90 + 'deg';
  }
  document.documentElement.style.setProperty(prop, rotate);
};

export const getPayEnv = (): string | null => {
  const browser = navigator.userAgent.toLowerCase();
  let payEnv = null;
  if (browser.match(/Alipay/i)?.[0] == 'alipay') {
    payEnv = 'alipay';
  }
  if (browser.match(/MicroMessenger/i)?.[0] == 'micromessenger') {
    payEnv = 'wx';
  }
  return payEnv;
};

export const getUrlCode = (): { [key: string]: string } => {
  // 截取url中的code方法
  const url = location.search;
  const theRequest: { [key: string]: string } = {};
  if (url.indexOf('?') !== -1) {
    const str = url.substr(1);
    const strs = str.split('&');
    for (let i = 0; i < strs.length; i++) {
      theRequest[strs[i].split('=')[0]] = strs[i].split('=')[1];
    }
  }
  return theRequest;
};

// 阿里获取code
export const getQueryParams = () => {
  const result: { [key: string]: string } = {}; // 存参数得对象
  const urlString = location.href;
  // 利用正则表达式
  const reg = /[?&][^?&]+=[^?&]+/g;
  const found = urlString.match(reg); // 拿到有符合正则得字符串，输出为数组 [ '?name=home', '&age=20' ]
  if (found) {
    found.forEach((item) => {
      const temp = item.substring(1).split('='); // = 分割
      const key = temp[0];
      const value = temp[1];
      result[key] = value;
    });
  }
  return result;
};
