<template>
  <header>
    <div>中英对照</div>
    <a href="./package.zip"  v-if="appConfig.environment === 'production'"">
      <div>点我下载最新汉化包 package_v{{ packageJson.version }}.zip</div>
    </a>
    <a v-else>
      <div>控制端输入npm run build即可编辑汉化包</div>
    </a>
  </header>
  <main>
    <ItemCompoment v-bind="appConfig" />
    <ToolsBar v-bind="appConfig" @update-triger="updateToolsBarTriger" />
  </main>
</template>

<script setup>
import { reactive } from "vue";
import packageJson from "../package.json";
import ItemCompoment from "./components/ItemCompoment.vue";
import ToolsBar from "./components/ToolsBar.vue";
import json from "body-parser/lib/types/json";

const appConfig = reactive({
  describeFinishedText: false,
  describeAutoText: false,
  // 运行环境
  environment: process.env.NODE_ENV,
});

function updateToolsBarTriger(triger) {
  if (appConfig.describeFinishedText !== triger.describeFinishedText)
    appConfig.describeFinishedText = triger.describeFinishedText;
  if (appConfig.describeAutoText !== triger.describeAutoText)
    appConfig.describeAutoText = triger.describeAutoText;
}
</script>

<style scoped>
main {
  position: relative;
}
</style>
