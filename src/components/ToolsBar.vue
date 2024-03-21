<template>
  <Teleport to="body"
    ><div
      class="toolsBar"
      v-show="visibility"
      @mousedown="mousedownHandler"
      :style="computedStyle"
    >
      <div>ctrl+a 隐藏/唤醒</div>
      <div>
        <label>
          <input type="checkbox" v-model="trigger.describeFinishedText" />
          <div class="describeText">隐藏已完成</div>
        </label>
      </div>
      <div>
        <label>
          <input type="checkbox" v-model="trigger.describeAutoText" />
          <div class="describeText">隐藏机翻</div>
        </label>
      </div>
    </div></Teleport
  >
</template>

<script setup>
import { watch } from "vue";
import { computed } from "vue";
import { onUnmounted, onMounted, ref, reactive } from "vue";

const props = defineProps({
  visibility: {
    type: Boolean,
    default: true,
  },
  // 是否展示已汉化文本
  describeFinishedText: {
    type: Boolean,
    default: true,
  },
  // 是否显示机翻文本
  describeAutoText: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["updateTriger"]);

const visibility = ref(props.visibility);
const position = reactive({ x: 0, y: 0, lastX: 0, lastY: 0 });
const trigger = reactive({
  toolsBarCanMove: false,
  // 是否展示已汉化文本
  describeFinishedText: props.describeFinishedText,
  // 是否显示机翻文本
  describeAutoText: props.describeAutoText,
});
const computedStyle = computed(() => {
  return {
    transform: `translate(${position.x}px, ${position.y}px)`,
  };
});

watch(
  trigger,
  () => {
    emit("updateTriger", trigger);
  },
  {
    deep: true,
  }
);

onMounted(() => {
  // 向window注册事件
  window.addEventListener("keydown", ctrlaHandler, true);
  window.addEventListener("mousemove", mousemoveHanlder, true);
  window.addEventListener("mouseup", mouseupHandler, true);
});

onUnmounted(() => {
  // 向window解除事件
  window.removeEventListener("keydown", ctrlaHandler, true);
  window.removeEventListener("mousemove", mousemoveHanlder, true);
  window.removeEventListener("mouseup", mouseupHandler, true);
});

/**
 * @description ctrl + a 事件处理函数
 * @param { KeyboardEvent } e
 */
function ctrlaHandler(e) {
  if (!e.target) return;

  // 编辑框操作屏蔽
  if (e.target.classList.contains("editable")) return;

  // 按下ctrl+a触发隐藏ToolsBar事件
  if (e.ctrlKey && e.key.toLowerCase() === "a") {
    visibility.value = !visibility.value;
    e.preventDefault();
  }
}

/**
 * @description mousedown 事件处理函数
 * @param { MouseEvent } e
 */
function mousedownHandler(e) {
  if (e.target && e.target === e.currentTarget) {
    trigger.toolsBarCanMove = true;
    position.lastX = e.clientX;
    position.lastY = e.clientY;
  }
}

/**
 * @description mousemove 处理函数
 * @param { MouseEvent } e
 */
function mousemoveHanlder(e) {
  if (trigger.toolsBarCanMove) {
    let offsetX = e.clientX - position.lastX;
    let offsetY = e.clientY - position.lastY;

    position.x += offsetX;
    position.y += offsetY;

    // 更新lastX和lastY
    position.lastX = e.clientX;
    position.lastY = e.clientY;

    e.preventDefault();
  }
}

/**
 * @description mouseup 事件处理函数
 * @param { MouseEvent } e
 */
function mouseupHandler(e) {
  trigger.toolsBarCanMove = false;
}
</script>

<style lang="scss" scoped>
/* 工具栏绝对定位，处于顶级 */
.toolsBar {
  bottom: 0;
  left: 0;
  position: fixed;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  background-color: var(--color-background);
  border: 3px dashed orange;
  border-radius: 1.5rem;

  padding: 2rem 2.5rem;

  &:hover {
    cursor: grab;
  }

  &:active {
    cursor: grabbing;
  }

  & > div {
    padding: 0.5rem 1rem;
    background-color: white;
    border-radius: 1rem;

    &:hover {
      cursor: default;
    }
  }
}

.describeText {
  display: inline;
  padding-left: 8px;
}
</style>
