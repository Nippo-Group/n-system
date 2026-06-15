/// <reference types="vite/client" />

declare module '@splidejs/vue-splide' {
  import type { App, Component } from 'vue'

  export interface Options {
    [key: string]: unknown
  }

  export const Splide: Component
  export const SplideSlide: Component
  export const SplideTrack: Component
  export const VueSplide: { install(app: App): void }

  export default VueSplide
}

declare module '@splidejs/vue-splide/css'
