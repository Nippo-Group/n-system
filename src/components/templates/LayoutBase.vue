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
import { useScroll } from '@/composables/useScroll'

const props = withDefaults(
  defineProps<{
    jsonPath: string
    footer?: boolean
  }>(),
  {
    footer: true,
  },
)
const { siteTitle, copyright, navigation, logoImage } = useConfig(props.jsonPath)
const { drawer, operateDrawer, dismissDrawer } = useDrawer()

const toolBarNav = computed(() => {
  return navigation.value?.filter((nav) => nav.id !== 'others')
})

// ヘッドツールの表示制御
const { scrollY, scrollDirection } = useScroll()

const toolbarStateStyles = {
  visible: 'translate-y-0',
  hidden: '-translate-y-full',
}
const toolbarState = computed(() => {
  if (scrollY.value < 200) {
    return 'visible'
  } else if (scrollDirection.value === 'down') {
    return 'hidden'
  } else {
    return 'visible'
  }
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
    class="fixed left-0 top-0 z-40 h-dvh w-96 max-w-[90%] -translate-x-96 transition duration-200"
    :class="{ 'translate-x-0': drawer }"
  ></GlobalHeader>
  <div :inert="drawer" class="flex min-h-dvh w-full flex-col bg-slate-200">
    <ToolBar
      :title="siteTitle ? siteTitle.join(' ') : undefined"
      :navigation="toolBarNav"
      class="sticky top-0 z-20 duration-300"
      :class="toolbarStateStyles[toolbarState]"
    >
      <NImage
        v-if="logoImage"
        :src="logoImage.src"
        :width="Number(logoImage.width)"
        :height="Number(logoImage.height)"
        :alt="logoImage.alt"
      ></NImage>
    </ToolBar>
    <!--
      メイン
      - `grow`: コンテンツに応じて伸びる
      - `relative`: 子要素が高さを取得したい場合に子要素に`absolute`を設定することで取得可能になる
    -->
    <main class="grow relative">
      <slot />
    </main>
    <ToolFooter v-if="footer" :navigation :copyright> </ToolFooter>
  </div>
</template>
