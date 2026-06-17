<script setup lang="ts">
import { computed } from 'vue'

import ListNavItem from '@/components/ui/ListNavItem.vue'
import ListNavMenu from '@/components/ui/ListNavMenu.vue'
import { useRouter } from '@/composables/useRouter'
import { cn } from '@/lib/cn'
import { variantConceptMap } from '@/styles'
import type { Navigation } from '@/types'
import { getLinkOptions } from '@/utils'

defineProps<{
  title?: string
  navigation?: Navigation[]
}>()

// ルーターの呼び出し
const router = useRouter()

// ルーターからトップページのリンクを取得
const LinkTop = computed(() => {
  const routerTop = router.getLinkById('top')
  if (!routerTop) return undefined
  return getLinkOptions(routerTop.href, routerTop.type)
})

const baseButtonClass = cn(variantConceptMap['outlined']('primary'), 'border')
const languageButtonClass = cn(variantConceptMap['flat']('info'), 'border hover:text-info')
</script>

<template>
  <div class="bg-white p-2 md:p-4 shadow-md border-t-4 border-primary">
    <div class="m-auto flex max-w-6xl justify-center align-bottom lg:justify-normal">
      <div class="flex-none">
        <component
          :is="LinkTop ? 'a' : 'span'"
          :href="LinkTop ? LinkTop.href : undefined"
          :target="LinkTop ? LinkTop.target : undefined"
          class="text-lg font-bold text-primary hover:opacity-75"
        >
          <slot>{{ title }}</slot>
        </component>
      </div>
      <div class="hidden grow lg:block"></div>
      <nav class="hidden flex-none lg:block">
        <div class="m-auto flex w-full max-w-5xl justify-between gap-2">
          <div v-for="item in navigation" :key="item.id">
            <ListNavMenu
              v-if="item.type === 'group'"
              :id="item.id"
              :name="item.name"
              :type="item.type"
              :children="item.children"
              :button-class="baseButtonClass"
            >
            </ListNavMenu>
            <ListNavItem
              v-else-if="item.children[0]"
              :path="item.children[0]"
              :class="item.id === 'language' ? languageButtonClass : baseButtonClass"
            ></ListNavItem>
          </div>
        </div>
      </nav>
    </div>
  </div>
</template>
