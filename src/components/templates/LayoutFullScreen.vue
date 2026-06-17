<script setup lang="ts">
import LayoutBase from '@/components/templates/LayoutBase.vue'

defineProps<{
  jsonPath: string
}>()
</script>

<template>
  <LayoutBase :jsonPath :footer="false">
    <div class="absolute top-0 left-0 size-full">
      <slot />
    </div>
  </LayoutBase>
</template>
