<template>
  <header>
    <div>中英对照</div>
    <a href="./package.zip"
      >点我下载最新汉化包 package_v{{ packageJson.version }}.zip
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
