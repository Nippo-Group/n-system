<script setup lang="ts">
import NCard from '@/components/entries/layouts/NCard.ce.vue'
import ModalWarpper from '@/components/ui/ModalWarpper.vue'

defineProps<{
  visible: boolean
  closeAction: () => void
}>()
</script>

<template>
  <ModalWarpper :visible :close-action>
    <NCard class="max-h-full min-w-[60%] max-w-full">
      <header>
        <slot name="header" />
      </header>
      <div class="overflow-y-auto overscroll-contain">
        <slot />
      </div>
      <footer class="text-center">
        <slot name="footer" />
      </footer>
    </NCard>
  </ModalWarpper>
</template>
