<script setup lang="ts">
import { ref, computed } from 'vue'

import NContainer1col from '@/components/entries/layouts/NContainer1col.ce.vue'
import NIcon from '@/components/entries/parts/NIcon.ce.vue'
import ModalWarpper from '@/components/ui/ModalWarpper.vue'
import { useModal } from '@/composables/useModal'
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
  },
  640: {
    slidesPerView: Math.min(2, props.slidesPerView),
  },
  1024: {
    slidesPerView: props.slidesPerView,
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
  swiper.on('slideChange', () => {
    currentIndex.value = swiper.realIndex ?? swiper.activeIndex ?? 0
  })
  isAutoplaying.value = !!swiper.autoplay?.running
}

// ナビゲーション（カスタム）
const goPrev = () => swiperInstance.value?.slidePrev()
const goNext = () => swiperInstance.value?.slideNext()

// オートプレイ
const autoplayStart = () => {
  swiperInstance.value?.autoplay.start()
  isAutoplaying.value = true
}
const autoplayStop = () => {
  swiperInstance.value?.autoplay.stop()
  isAutoplaying.value = false
}

// 画像の拡大表示
// - モーダルの状態管理
const { visible, show, dismiss } = useModal()

// - クリックされた画像を管理
const selectedIndex = ref<number | undefined>(undefined)
const showImage = (index: number) => {
  selectedIndex.value = index
  show()
}
const dismissImage = () => {
  selectedIndex.value = undefined
  dismiss()
}
</script>

<template>
  <div role="region" aria-label="Image carousel" aria-roledescription="carousel">
    <div class="flex items-center gap-2">
      <!-- カスタムの戻るボタン -->
      <button
        type="button"
        class="btn-nav"
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
        :spaceBetween="props.spaceBetween"
        :centeredSlides="props.centeredSlides"
        :navigation="false"
        @swiper="onSwiper"
      >
        <SwiperSlide v-for="(item, index) in props.items" :key="item.src">
          <button
            type="button"
            class="rounded overflow-hidden flex cursor-pointer hover:opacity-80 focus:ring"
            @click="showImage(index)"
          >
            <img :src="item.src" :alt="item.alt" class="aspect-3/2 object-cover" />
          </button>
        </SwiperSlide>
      </Swiper>

      <!-- カスタムの進ボタン -->
      <button type="button" class="btn-nav" aria-label="Next" :aria-controls="uid" @click="goNext">
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
        class="btn-autoplay"
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
        class="btn-autoplay"
        aria-label="Start autoplay"
        :aria-pressed="isAutoplaying"
        @click="autoplayStart"
      >
        <NIcon name="play" size="sm"></NIcon>
      </button>
    </div>
    <ModalWarpper :visible :close-action="dismissImage">
      <NContainer1col v-if="selectedIndex !== undefined" aline="center">
        <img :src="props.items[selectedIndex].src" :alt="props.items[selectedIndex].alt" />
        <p class="bg-gray-800 text-white px-1">{{ props.items[selectedIndex].alt }}</p>
      </NContainer1col>
    </ModalWarpper>
  </div>
</template>

<style>
@import '@/assets/css/web-component.css';
@import 'swiper/css';
@import 'swiper/css/navigation';
@import 'swiper/css/pagination';
@import 'swiper/css/scrollbar';

@layer components {
  .btn-nav {
    @apply bg-white hover:bg-gray-200 p-1 rounded-full border border-gray-200 text-primary shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary;
  }
  .btn-autoplay {
    @apply rounded-full text-primary hover:text-info cursor-pointer focus:outline-none focus:ring focus:ring-primary;
  }
}
</style>
