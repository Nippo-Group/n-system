/**
 * @file Swiperライブラリをプロジェクトで使用するための共通設定とエクスポートをまとめたファイル
 * @description
 * Swiperの詳細は公式サイト（https://swiperjs.com/vue）を参照してください。
 */

// import Swiper core and required modules
import { Navigation, Pagination, Autoplay, EffectFade, Scrollbar, A11y } from 'swiper/modules'
// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from 'swiper/vue'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'

// よく使うモジュール
import 'swiper/css/effect-fade'

// 型
import type { SwiperOptions } from 'swiper/types'

// プロジェクト共通のデフォルト設定
export const defaultSwiperOptions: Omit<
  SwiperOptions,
  'width' | 'height' | 'userAgent' | 'url' | 'swipeHandler' | 'controller'
> = {
  modules: [Navigation, Pagination, Autoplay, EffectFade, Scrollbar, A11y],
  loop: true,
  autoplay: {
    delay: 4000,
    disableOnInteraction: false,
  },
  pagination: {
    clickable: true,
  },
  navigation: true,
  spaceBetween: 0,
  slidesPerView: 1,
}

// 必要なコンポーネント・モジュールをまとめてエクスポート
export { Swiper, SwiperSlide, Navigation, Pagination, Autoplay, EffectFade, Scrollbar, A11y }

export type { SwiperOptions }
