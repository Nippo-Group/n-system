<script setup lang="ts">
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'

import IconArrowDown from '@/components/icons/IconArrowDown.vue'
import IconArrowUp from '@/components/icons/IconArrowUp.vue'

withDefaults(
  defineProps<{
    title?: string
    defaultOpen?: boolean
  }>(),
  {
    defaultOpen: false,
  },
)
</script>

<template>
  <Disclosure as="div" class="border-b" :default-open="defaultOpen" v-slot="{ open }">
    <DisclosureButton
      class="flex w-full items-center justify-between p-2 text-start hover:bg-gray-100 rounded-md"
    >
      <slot name="title">
        <span>{{ title }}</span>
      </slot>
      <span class="flex size-8 items-center justify-center rounded-full bg-gray-100">
        <component :is="open ? IconArrowUp : IconArrowDown" class="text-xl text-gray-400" />
      </span>
    </DisclosureButton>
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <DisclosurePanel class="px-2 pb-2">
        <slot />
      </DisclosurePanel>
    </transition>
  </Disclosure>
</template>

<style>
@import '@/assets/css/web-component.css';
</style>
