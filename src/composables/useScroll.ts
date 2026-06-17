import { ref, onMounted } from 'vue'

import { useEventListener } from '@/composables/useEventListener'

/**
 * ページのスクロール位置とスクロール方向を監視するComposable
 *
 * - `scrollX` / `scrollY`: 現在のスクロール位置
 * - `scrollDirection`: 最後に判定されたスクロール方向 ('up' / 'down')
 */
export const useScroll = () => {
  // 現在のスクロール位置
  const scrollX = ref(0)
  const scrollY = ref(0)

  // 直前の Y 位置を保持しておき、現在位置と比較して方向を判定する
  const previousScrollY = ref(0)

  // スクロール方向: 上にスクロールしたか下にスクロールしたか
  const scrollDirection = ref<'up' | 'down' | undefined>(undefined)

  const getScroll = () => {
    const currentScrollX = window.scrollX
    const currentScrollY = window.scrollY

    // 現在のスクロール位置と直前の位置を比較して方向を決定
    scrollDirection.value =
      currentScrollY > previousScrollY.value
        ? 'down'
        : currentScrollY < previousScrollY.value
          ? 'up'
          : scrollDirection.value

    // 位置を更新
    scrollX.value = currentScrollX
    scrollY.value = currentScrollY
    previousScrollY.value = currentScrollY
  }

  // マウント時に初期スクロール位置を取得
  onMounted(() => {
    getScroll()
  })

  // scroll イベントを監視して位置と方向を更新
  useEventListener(window, 'scroll', getScroll, { passive: true })

  return {
    scrollX,
    scrollY,
    scrollDirection,
  }
}
