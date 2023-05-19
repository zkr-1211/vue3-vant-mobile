<template>
  <router-view />
</template>

<script setup lang="ts">
  import debug from '@/utils/debug';
  import watermark from '@/utils/lib/watermark';
  import copyPaste from '@/utils/lib/copy-paste';
  import { storage } from '@/utils/storage';
  onMounted(() => {
    debug.init();
    copyPaste.disable();
    const codePlate = getUrlCode().codePlate;
    codePlate && storage.setItem('codePlate', codePlate);
  });
  function getUrlCode(): { [key: string]: string } {
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
  }
  onBeforeUnmount(() => {
    watermark.remove();
    copyPaste.enable();
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
