<script setup lang="ts">
import { computed } from 'vue'

import { Swiper, SwiperSlide, defaultSwiperOptions } from '@/lib/swiper'

export type NSliderItem = {
  src: string
  alt: string
}

const props = withDefaults(
  defineProps<{
    items: NSliderItem[]
    slidesPerView?: number
    spaceBetween?: number
  }>(),
  {
    slidesPerView: 3,
    spaceBetween: 8,
  },
)

const swiperBreakpoints = computed(() => ({
  0: {
    slidesPerView: 1,
    spaceBetween: 0,
  },
  640: {
    slidesPerView: Math.min(2, props.slidesPerView),
    spaceBetween: 8,
  },
  1024: {
    slidesPerView: props.slidesPerView,
    spaceBetween: 8,
  },
}))
</script>

<template>
  <Swiper
    v-bind="defaultSwiperOptions"
    :breakpoints="swiperBreakpoints"
    navigation
    :pagination="{ clickable: true }"
    :scrollbar="{ draggable: true }"
  >
    <SwiperSlide v-for="(item, index) in props.items" :key="index">
      <img :src="item.src" :alt="item.alt" class="rounded aspect-3/2 object-cover" />
    </SwiperSlide>
  </Swiper>
</template>

<style>
@import '@/assets/css/web-component.css';
@import 'swiper/css';
@import 'swiper/css/navigation';
@import 'swiper/css/pagination';
@import 'swiper/css/scrollbar';
@import 'photoswipe/style.css';
</style>
