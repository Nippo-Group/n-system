<script setup lang="ts">
import { computed } from 'vue'

import NImage from '@/components/entries/parts/NImage.ce.vue'
import GlobalHeader from '@/components/ui/GlobalHeader.vue'
import HeaderTool from '@/components/ui/HeaderTool.vue'
import OverlayBase from '@/components/ui/OverlayBase.vue'
import ToolBar from '@/components/ui/ToolBar.vue'
import ToolFooter from '@/components/ui/ToolFooter.vue'
import { useConfig } from '@/composables/useConfig'
import { useDrawer } from '@/composables/useDrawer'

const props = defineProps<{
  jsonPath: string
}>()
const { siteTitle, copyright, navigation, logoImage } = useConfig(props.jsonPath)
const { drawer, operateDrawer, dismissDrawer } = useDrawer()

const toolBarNav = computed(() => {
  return navigation.value?.filter((nav) => nav.id !== 'others')
})
</script>

<template>
  <OverlayBase v-show="drawer" class="z-30" @click="dismissDrawer()"></OverlayBase>
  <HeaderTool :active="drawer" class="z-50" @click="operateDrawer()"></HeaderTool>
  <GlobalHeader
    v-if="siteTitle && navigation"
    :titleList="siteTitle"
    :navigation
    :inert="!drawer"
    class="fixed left-0 top-0 z-40 h-screen w-96 max-w-[90%] -translate-x-96 transition duration-200"
    :class="{ 'translate-x-0': drawer }"
  ></GlobalHeader>
  <div :inert="drawer" class="flex min-h-screen w-full flex-col bg-slate-200">
    <ToolBar
      :title="siteTitle ? siteTitle.join(' ') : undefined"
      :navigation="toolBarNav"
      class="sticky top-0 z-20"
    >
      <NImage
        v-if="logoImage"
        :src="logoImage.src"
        :width="Number(logoImage.width)"
        :height="Number(logoImage.height)"
        :alt="logoImage.alt"
      ></NImage>
    </ToolBar>
    <main class="flex flex-1 justify-center">
      <div class="flex w-full max-w-5xl flex-col gap-12 py-6">
        <slot />
      </div>
    </main>
    <ToolFooter :navigation :copyright> </ToolFooter>
  </div>
</template>
