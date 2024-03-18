<template>
  <table>
    <caption>
      预览表，仅供预览，禁止商业用途
    </caption>
    <thead>
      <tr>
        <th scope="col">Key</th>
        <th scope="col">value</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in data">
        <th scope="col">{{ item.key }}</th>
        <td>
          <table>
            <tr>
              <td>
                {{ item.en }}
              </td>
            </tr>
            <tr>
              <td>
                {{ item.auto }}
              </td>
            </tr>
            <tr :class="{ nomanul: !item.cn }">
              <td>
                {{ item.cn }}
              </td>
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

class item {
  constructor(key, en, cn, auto) {
    this.key = key;
    this.en = en;
    this.cn = cn;
    this.auto = auto;
  }
}

import en from "@/ftbqkeys/kubejs/assets/kubejs/lang/en_us.json";
import cn from "@/ftbqkeys/kubejs/assets/kubejs/lang/zh_cn.json";
import auto from "@/ftbqkeys/kubejs/assets/kubejs/lang/zh_hk.json";

// 循环遍历en中的key，对应的寻找cn与auto的value存贮至新建的item中
// 最后将item保存到data数组中
let data = [];
for (let key in en) {
  data.push(new item(key, en[key], cn[key] || "", auto[key] || ""));
}
</script>

<style scoped>
/* 表格样式 */
table {
  border-collapse: collapse;
  width: 100%;
  /* border: 1px solid #ddd; */
}

/* 表格每行间隔背景显示 */
tr:not(tr tr) {
  height: 3rem;
  width: 100%;
  border: 1px solid #ddd;

  &:nth-child(2n) {
    background-color: #f2f2f2;
  }

  &:nth-child(2n + 1) {
    border: 1caps solid #ddd;
  }
}

tr tr {
  height: 2rem;

  &:nth-child(2n) {
    background-color: #f2f2f2;
    filter: contrast(0.85);
  }

  /* 没有翻译，给予背景标红 */
  &.nomanul {
    background-color: #d60c0c;
    filter: opacity(0.5);
  }
}
</style>
