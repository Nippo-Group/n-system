<script setup lang="ts">
import LayoutBase from '@/components/templates/LayoutBase.vue'

defineProps<{
  jsonPath: string
}>()
</script>

<template>
  <LayoutBase :jsonPath>
    <div class="flex justify-center">
      <div class="flex w-full max-w-5xl flex-col gap-12 py-6">
        <slot />
      </div>
    </div>
  </LayoutBase>
</template>
