<script setup lang="ts">
import BtnClose from '@/components/features/BtnClose.vue'
import OverlayBase from '@/components/ui/OverlayBase.vue'
import TransitionScale from '@/components/ui/TransitionScale.vue'

defineProps<{
  visible: boolean
  closeAction: () => void
}>()
</script>

<template>
  <Teleport to="body">
    <OverlayBase v-show="visible" @click="closeAction">
      <TransitionScale>
        <div v-show="visible" role="dialog" @click.stop>
          <slot></slot>
        </div>
      </TransitionScale>
      <BtnClose class="absolute right-4 top-4" @click="closeAction"></BtnClose>
    </OverlayBase>
  </Teleport>
</template>
