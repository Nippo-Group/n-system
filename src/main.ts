import { defineCustomElement } from 'vue'

// パスカルケースをケバブケースに変換するユーティリティ関数
import { pascalToKebab } from '@/utils'

import type { DefineComponent } from 'vue'

// メインのCSSファイルをインポートしてグローバルスタイルを適用
import './assets/css/main.css'

// カスタム要素モジュールの型定義
type CustomElementModule = {
  default: DefineComponent
}

// カスタム要素ローダーの型定義（非同期インポート関数）
type CustomElementLoader = () => Promise<CustomElementModule>

// Web Components の自動登録システム
// このファイルは n-system のエントリーポイントで、.ce.vue ファイルを
// 自動的にカスタム要素として登録する役割を担う

// すべての .ce.vue ファイルを遅延インポート
// これにより、初回ロード時のバンドルサイズを最小化
const componentModules = import.meta.glob<CustomElementModule>('./components/entries/*/*.ce.vue')

// コンポーネント名（ケバブケース）とローダーのマッピング
// 例: NCard.ce.vue -> n-card
const componentRegistry = new Map<string, CustomElementLoader>(
  Object.entries(componentModules).flatMap(([path, loader]) => {
    // ファイルパスからファイル名を取得
    const fileName = path.split('/').pop() || ''
    // .ce.vue を除去してベース名を取得
    const baseName = fileName.replace('.ce.vue', '')
    // パスカルケースからケバブケースに変換
    const componentName = pascalToKebab(baseName)

    // 有効なコンポーネント名のみ登録
    return componentName ? [[componentName, loader]] : []
  }),
)

// 現在ロード中のコンポーネントを追跡（重複ロード防止）
const loadingComponents = new Map<string, Promise<void>>()

// 指定されたタグ名の Web Component が定義されていない場合に定義する関数
// 非同期でロードし、customElements.define() を実行
const ensureDefined = async (tagName: string) => {
  // すでに定義済み、または有効なカスタム要素名でない場合はスキップ
  if (!tagName.includes('-') || customElements.get(tagName)) {
    return
  }

  // すでにロード中の場合は完了を待つ
  const loadingTask = loadingComponents.get(tagName)
  if (loadingTask) {
    await loadingTask
    return
  }

  // レジストリからローダーを取得
  const loader = componentRegistry.get(tagName)
  if (!loader) {
    return
  }

  // ロードタスクを作成
  const task = loader().then((module) => {
    // 二重定義防止
    if (!customElements.get(tagName)) {
      customElements.define(tagName, defineCustomElement(module.default))
    }
  })

  // ロード中としてマーク
  loadingComponents.set(tagName, task)

  try {
    await task
  } finally {
    // 完了後にクリーンアップ
    loadingComponents.delete(tagName)
  }
}

// 指定されたルート要素内の未定義の n-system タグを収集
const collectUndefinedTags = (root: ParentNode) => {
  const tagNames = new Set<string>()

  // ルート要素自身をチェック
  if (root instanceof Element) {
    const ownTagName = root.tagName.toLowerCase()
    if (componentRegistry.has(ownTagName) && !customElements.get(ownTagName)) {
      tagNames.add(ownTagName)
    }
  }

  // 子孫要素をチェック
  root.querySelectorAll('*').forEach((element) => {
    const tagName = element.tagName.toLowerCase()
    if (componentRegistry.has(tagName) && !customElements.get(tagName)) {
      tagNames.add(tagName)
    }
  })

  return [...tagNames]
}

// 指定されたルート要素内の未定義タグをすべて定義
const upgradeRoot = async (root: ParentNode) => {
  await Promise.all(collectUndefinedTags(root).map(ensureDefined))
}

// DOM 変更を監視し、新しい要素が追加されたら自動的にアップグレード
const startObserver = () => {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof Element) {
          // 新しい要素をアップグレード（エラーハンドリングは内部で）
          void upgradeRoot(node)
        }
      })
    })
  })

  // ドキュメント全体を監視
  observer.observe(document.documentElement, {
    childList: true, // 子要素の追加/削除を監視
    subtree: true, // サブツリー全体を監視
  })
}

// 初期化: 初期DOMに存在するタグだけを登録し、監視を開始
void upgradeRoot(document).then(startObserver)
