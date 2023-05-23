export default function temlateArrFn(temlate) {
  const arr = [
    {
      id: temlate.ids.navbarId,
      component: 'navbar',
      required: false,
      data: {
        value: temlate.title,
      },
      options: {
        enabled: true,
        validate: false,
      },
    },
    {
      id: temlate.ids.fileUploadId,
      component: 'fileUpload',
      required: false,
      data: {
        title: '背景音乐',
        label: '背景音乐',
        value: temlate.bgm,
      },
      options: {
        enabled: true,
        validate: false,
      },
    },
    {
      id: temlate.ids.bannerId,
      component: 'banner',
      required: false,
      data: {
        value: temlate.banner,
      },
      options: {
        enabled: true,
        validate: false,
        format: ['jpg', 'png'],
      },
    },
    {
      id: temlate.ids.textareaId,
      component: 'textarea',
      required: false,
      data: {
        title: '寺庙介绍',
        label: '寺庙介绍',
        value: temlate.mome,
      },
      options: {
        enabled: true,
        validate: false,
      },
    },
    {
      id: temlate.ids.selectId,
      component: 'select',
      data: {
        title: '捐赠类别',
        label: '捐赠类别',
        value: temlate.bizType,
        selectOptions: temlate.bizTypes,
      },
      required: true,
      options: {
        enabled: true,
      },
    },
    {
      id: temlate.ids.amountRandomId,
      component: 'amountRandom',
      data: {
        title: '随缘金额',
        label: '随缘金额',
        value: temlate.amount,
      },
      required: true,
      options: {
        enabled: true,
      },
      extension: {
        amountArr: temlate.randomList,
      },
    },
    {
      id: temlate.ids.inputId,
      component: 'input',
      data: {
        title: '捐赠人',
        label: '',
        value: temlate.userName,
      },
      required: false,
      options: {
        enabled: true,
      },
    },
  ];
  return arr;
}
