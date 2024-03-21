<template>
  <header>中英对照</header>
  <main>
    <ItemCompoment v-bind="appConfig" />
    <ToolsBar v-bind="appConfig" @update-triger="updateToolsBarTriger" />
  </main>
</template>

<script setup>
import { reactive } from "vue";
import ItemCompoment from "./components/ItemCompoment.vue";
import ToolsBar from "./components/ToolsBar.vue";

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
