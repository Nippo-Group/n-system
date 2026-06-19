<script setup lang="ts">
import { ref, computed } from 'vue'

import NIcon from '@/components/entries/parts/NIcon.ce.vue'
import { Swiper, SwiperSlide, defaultSwiperOptions } from '@/lib/swiper'

import type { Swiper as SwiperClass } from 'swiper'

export type NSliderItem = {
  src: string
  alt: string
}

const props = withDefaults(
  defineProps<{
    items: NSliderItem[]
    autoplay?: boolean
    slidesPerView?: number
    spaceBetween?: number
    centeredSlides?: boolean
  }>(),
  {
    autoplay: false,
    slidesPerView: 3,
    spaceBetween: 8,
    centeredSlides: false,
  },
)

// 横幅で表示枚数を変える
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

// Swiper インスタンスを保持
const swiperInstance = ref<SwiperClass | null>(null)
const uid = `nslider-${Math.random().toString(36).slice(2, 9)}`

const currentIndex = ref(0)
const totalSlides = computed(() => props.items.length)
const isAutoplaying = ref(false)

const onSwiper = (swiper: SwiperClass) => {
  swiperInstance.value = swiper
  currentIndex.value = swiper.realIndex ?? swiper.activeIndex ?? 0
  // 更新イベントを登録
  try {
    swiper.on('slideChange', () => {
      currentIndex.value = swiper.realIndex ?? swiper.activeIndex ?? 0
    })
  } catch (e) {
    console.error(e)
  }
  isAutoplaying.value = !!swiper.autoplay?.running
}

// ナビゲーション（カスタム）
const goPrev = () => swiperInstance.value?.slidePrev()
const goNext = () => swiperInstance.value?.slideNext()
const btnNavigation =
  'bg-white hover:bg-gray-200 p-1 rounded-full border border-gray-200 text-primary shadow-md cursor-pointer'

// オートプレイ
const autoplayStart = () => {
  swiperInstance.value?.autoplay.start()
  isAutoplaying.value = true
}
const autoplayStop = () => {
  swiperInstance.value?.autoplay.stop()
  isAutoplaying.value = false
}
const btnAutoplay =
  'bg-white hover:bg-gray-200 rounded-full text-primary cursor-pointer p-1 border border-transparent'
</script>

<template>
  <div role="region" aria-label="Image carousel" aria-roledescription="carousel">
    <div class="flex items-center gap-2">
      <!-- カスタムの戻るボタン -->
      <button
        type="button"
        :class="[btnNavigation, 'focus:outline-none focus:ring-2 focus:ring-primary']"
        aria-label="Previous"
        :aria-controls="uid"
        @click="goPrev"
      >
        <NIcon name="arrow-left"></NIcon>
      </button>

      <!-- スライダー本体 -->
      <Swiper
        :id="uid"
        v-bind="defaultSwiperOptions"
        :autoplay="
          props.autoplay
            ? {
                delay: 3000,
                disableOnInteraction: false,
              }
            : false
        "
        :breakpoints="swiperBreakpoints"
        :centeredSlides="props.centeredSlides"
        :navigation="false"
        @swiper="onSwiper"
      >
        <SwiperSlide v-for="item in props.items" :key="item.src">
          <img :src="item.src" :alt="item.alt" class="rounded aspect-3/2 object-cover" />
        </SwiperSlide>
      </Swiper>

      <!-- カスタムの進ボタン -->
      <button
        type="button"
        :class="[btnNavigation, 'focus:outline-none focus:ring-2 focus:ring-primary']"
        aria-label="Next"
        :aria-controls="uid"
        @click="goNext"
      >
        <NIcon name="arrow-right"></NIcon>
      </button>
    </div>

    <!-- スライド位置をスクリーンリーダーに通知 -->
    <div class="sr-only" aria-live="polite">{{ currentIndex + 1 }} of {{ totalSlides }}</div>

    <div v-if="props.autoplay" class="flex justify-center items-center gap-1">
      <!-- 停止ボタン -->
      <button
        v-if="isAutoplaying"
        type="button"
        :class="[btnAutoplay, 'focus:outline-none focus:ring-2 focus:ring-primary']"
        aria-label="Pause autoplay"
        :aria-pressed="!isAutoplaying"
        @click="autoplayStop"
      >
        <NIcon name="pause" size="sm"></NIcon>
      </button>

      <!-- 再生ボタン -->
      <button
        v-else
        type="button"
        :class="[btnAutoplay, 'focus:outline-none focus:ring-2 focus:ring-primary']"
        aria-label="Start autoplay"
        :aria-pressed="isAutoplaying"
        @click="autoplayStart"
      >
        <NIcon name="play" size="sm"></NIcon>
      </button>
    </div>
  </div>
</template>

<style>
@import '@/assets/css/web-component.css';
@import 'swiper/css';
@import 'swiper/css/navigation';
@import 'swiper/css/pagination';
@import 'swiper/css/scrollbar';
</style>
