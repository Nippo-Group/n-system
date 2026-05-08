import { fileURLToPath, URL } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// Vite 設定ファイル
// このファイルは Vue3 + TypeScript + Tailwind CSS のプロジェクトのビルドと開発サーバーの設定を定義します。
// 主な目的: Web Componentsライブラリ(n-system)のビルドと開発環境の最適化

export default defineConfig({
  // 配布先がサブディレクトリ配下でも 404 になりにくいように、分割チャンクを相対パス参照にする
  base: './',
  // プラグイン設定: VueとTailwind CSSの統合
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // ダッシュを含むすべてのタグをカスタム要素として扱う
          // これにより、n-systemの Web Components(例: <n-card>) が正しく認識される
          isCustomElement: (tag) => tag.includes('-'),
        },
      },
    }),
    // Tailwind CSSを Viteで使用するためのプラグイン
    tailwindcss(),
  ],

  // パス解決設定: モジュールインポートのエイリアス
  resolve: {
    alias: {
      // '@' を 'src' ディレクトリにマッピング
      // これにより、import '@/components/...' のように短縮してインポート可能
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  // ビルド設定: 出力ファイルの構成
  build: {
    // Vite の preload ヘルパーは base パス次第で絶対パス化しやすく、
    // 配布先がサブパスの場合に 404 になりやすいので無効化する
    modulePreload: false,
    // CSSを分割せず、単一のファイルにまとめる
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        // エントリーポイントの出力ファイル名: n-system.js
        entryFileNames: `assets/n-system.js`,
        // チャンクファイルの命名規則
        chunkFileNames: `assets/chunks/[name]-[hash].js`,
        // アセットファイルの命名規則
        assetFileNames: (assetInfo) => {
          // style.cssは n-system.cssとして出力
          if (assetInfo.names.includes('style.css')) {
            return 'assets/n-system.css'
          }
          // その他のアセットはハッシュ付きで出力
          return 'assets/[name]-[hash][extname]'
        },
      },
    },
  },

  // 開発サーバー設定
  server: {
    watch: {
      // ファイル変更検知にポーリングを使用(一部の環境で安定)
      usePolling: true,
      // ポーリング間隔: 300ms
      interval: 300,
      // 監視対象外のディレクトリ: node_modulesとdist
      ignored: ['**/node_modules/**', '**/dist/**'],
    },
  },
})
