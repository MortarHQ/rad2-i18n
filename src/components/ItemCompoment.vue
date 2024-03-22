<template>
  <table
    :class="{
      hideFinishedText: props.describeFinishedText,
      hideAutoText: props.describeAutoText,
    }"
  >
    <caption style="text-align: left; padding-bottom: 0.5rem">
      {{
        caption
      }}
    </caption>
    <thead>
      <tr>
        <th scope="col">Key</th>
        <th scope="col">value</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in data" :key="item.key">
        <th scope="col">{{ item.key }}</th>
        <td>
          <table>
            <tr>
              <div v-text="item.en_us" class="noSpaceCollapse"></div>
            </tr>
            <tr>
              <div v-text="item.auto" class="noSpaceCollapse"></div>
            </tr>
            <tr :class="{ noManul: !item.zh_cn }">
              <div
                v-text="item.zh_cn"
                class="noSpaceCollapse editable"
                @focusout="focusout(item, $event)"
                contenteditable
              ></div>
            </tr>
          </table>
        </td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <th scope="row" colspan="2">结束了</th>
      </tr>
    </tfoot>
  </table>
</template>

<script setup>
/**
 * @description 读取语言文件，构造对比类并展示
 *
 */

import { ref } from "vue";
import axios from "axios";
import { getLangFileRequest } from "@/api/api";

const props = defineProps({
  describeFinishedText: {
    type: Boolean,
    default: true,
  },
  describeAutoText: {
    type: Boolean,
    default: true,
  },
});

class Item {
  constructor(key, en_us, zh_cn, auto) {
    this.key = key;
    this.en_us = en_us;
    this.zh_cn = zh_cn;
    this.auto = auto;
  }
}

let caption = "开发者模式，可以修改";
if (process.env.NODE_ENV === "production")
  caption = "预览表，仅供预览，修改无效，禁止商业用途";

// 循环遍历 en_us 中的 key ，对应的寻找 zh_cn 与 auto 的 value 存贮至新建的 item 中
// 最后将item保存到data数组中
let data = ref([]);
// 从后端中读取文件
Promise.all([
  getLangFileRequest("en_us"),
  getLangFileRequest("zh_cn"),
  getLangFileRequest("auto"),
]).then((res) => {
  const en_us = res[0].data;
  const zh_cn = res[1].data;
  const auto = res[2].data;
  for (let key in en_us) {
    data.value.push(new Item(key, en_us[key], zh_cn[key], auto[key]));
  }
});

/**
 * @description 监听focusout事件
 * @type {Item} item
 * @type {FocusEvent} event
 */
function focusout(item, event) {
  console.log(Date(), { ...item });
  item.cn = event.target.innerText;
  // dev模式
  if (process.env.NODE_ENV === "development") {
    // 向后端发送put请求，包含请求头
    axios.put(
      "http://localhost:3032",
      { key: item.key, value: item.cn },
      { headers: { "Content-Type": "application/json;charset=utf-8" } }
    );
  }
}
</script>

<style scoped lang="scss">
/* 表格样式 */
table {
  // 全局表格样式
  border-collapse: collapse;
  width: 100%;

  // 最外层表
  &:not(table table) {
    background-color: #ffffff;
    box-shadow: 0px 1px 10px 2px rgba(0, 0, 0, 0.5);
    border-radius: 9px;
  }

  // value 表
  table {
    width: 100%;
    max-width: 1280px;
  }
}

/* 行 */
tr {
  /* 最外层行 */
  &:not(tr tr) {
    height: 3rem;
    border: 1px solid #ddd;

    &:nth-child(2n) {
      background-color: #f2f2f2;
    }

    &:nth-child(2n + 1) {
      border: 1caps solid #ddd;
    }

    // key列
    & > :nth-child(1) {
      text-align: center;
      padding: 0.5rem 1rem;
      border-right: 1px solid #ddd;
      border-bottom: 1px solid #ddd;
      width: 0;
    }

    // 处理ToolsBar:hideAutoText功能
    .hideFinishedText &:not(*:has(.noManul)) {
      display: none;
      background-color: black;
    }
  }

  /* 语言对照 value */
  & tr {
    // 处理ToolsBar:hideFinishedText功能
    .hideAutoText &:nth-of-type(2) {
      display: none;
      background-color: red;
    }

    .noSpaceCollapse {
      margin-left: 1rem;
      white-space: pre;
      padding: 1rem 0.5rem;

      /* 编辑区 */
      &.editable {
        margin-top: 2rem;
        margin-bottom: 2rem;
        // 虚线边框
        border: 3px dashed #ddd;
        border-radius: 1rem;
      }
    }

    /* 没有翻译，给予背景标红 */
    &.noManul div {
      height: 100%;
      background-color: #e43d33;
    }

    > div {
      &:focus {
        background-color: #18bc37;
        outline: none;
      }
    }
  }
}
</style>
