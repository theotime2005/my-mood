<script setup>
import { onMounted, ref } from "vue";

import { checkApiIsOk } from "@/adapters/api-adapter.js";

const apiIsActive = ref(false);

onMounted(async () => {
  apiIsActive.value = await checkApiIsOk();
});
</script>

<template>
  <div v-if="apiIsActive">
    <RouterView />
  </div>
</template>
