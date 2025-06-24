<script setup>

import {ref, watch} from "vue";

const props = defineProps({
  showOpenBtn: {
    type: Boolean,
    default: true,
  },
  btnClass: {
    type: String,
    default: 'btn'
  },
  btnText: {
    type: String,
    default: 'Open Modal'
  },
  open: {
    type: Boolean,
    default: false,
  }
});

function close() {
  dialog.value?.close();
}

defineExpose({
  close
});

const emit = defineEmits(['open', 'close']);

const dialog = ref(null);

function handleOpen() {
  dialog.value?.showModal();
  emit('open');
}

watch(() => props.open, () => {
  if (props.open) {
    handleOpen();
  } else {
    close();
  }
});

</script>

<template>

  <!-- https://daisyui.com/components/modal/#dialog-modal-with-a-close-button-at-corner -->

  <button v-if="showOpenBtn" :class="btnClass" @click="handleOpen">
    <slot name="openBtn">
      {{ btnText }}
    </slot>
  </button>

  <dialog ref="dialog" class="modal" @close="emit('close')">
    <div class="modal-box">
      <slot name="closeBtn">
        <form method="dialog">
          <button title="Close Modal" class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
      </slot>
      <slot>
        <h3 class="text-lg font-bold">Hello!</h3>
        <p class="py-4">Press ESC key or click on ✕ button to close</p>
      </slot>
    </div>
  </dialog>

</template>
