<template>
  <router-view />
</template>

<script setup lang="ts">
  import debug from '@/utils/debug';
  import watermark from '@/utils/lib/watermark';
  import copyPaste from '@/utils/lib/copy-paste';
  import { storage } from '@/utils/storage';
  import { getUrlCode } from '@/utils/util';
  onMounted(async () => {
    debug.init();
    copyPaste.disable();
    const codePlate = getUrlCode().codePlate || 'cW5OcnduZDlLUzBxOHFBdkxPNUgxdz09';
    codePlate && storage.setItem('codePlate', codePlate);
  });
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
