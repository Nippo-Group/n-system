# n-system: Copilot 向け開発ガイド

**プロジェクトタイプ**: Vue 3 Web Components ライブラリ + デザインシステム  
**言語**: TypeScript / Vue 3 / Tailwind CSS  
**出力**: 単一ファイルライブラリ（`assets/n-system.js` + CSS）

## アーキテクチャ概要

### Web Components 戦略

- **`.ce.vue` ファイル** = `src/main.ts` の `import.meta.glob()` で自動登録されるカスタム要素
- 命名規則: ファイルは PascalCase → DOM では kebab-case（例：`NCard.ce.vue` → `<n-card>`）
- 配置: `src/components/entries/`（layout/parts/media/interaction/data で分類）
- `defineCustomElement()` を使用して標準 Web Components として出力（Vue スコープなし）

### コンポーネント組織

- **`entries/`** (`.ce.vue`): 再利用可能なカスタム要素、自動登録、Vue コンテキスト非依存
- **`features/`** (`.vue`): Vue 固有のコンポーネント、コンテキスト認識、ページまたはエントリが使用
- **`ui/`** (`.vue`): 原子的 UI コンポーネント（ボタン、モーダル、入力）、entries と features で共有
- **アイコン**: `icons/` フォルダの独立したコンポーネント（すべて `.vue`）

### 主要ライブラリと統合

- **Headless UI** (`@headlessui/vue`): スタイル無し アクセシブルコンポーネント（Menu、Switch、Transition）
- **Fuse.js**: データの曖昧検索（例：出展者キーワード検索）
- **marked**: Markdown レンダリング
- **DOMPurify**: HTML サニタイゼーション
- **Tailwind CSS**: スタイリング（設定：`tailwind.config.js`、カスタム Tailwind プラグインなし）

## データと状態管理

### Composables パターン

- **`use*` 命名**: `useLang`、`useExhibitorList`、`useModal`、`useGenres` など
- **Pinia/グローバルストアなし**（現在）: 状態は composables + localStorage に存在
- **`readonly()` ラッピング**: ミュータブルな内部状態と読み取り専用エクスポートを区別
- **リアクティブ ref + computed**: Vue 3 リアクティビティモデル；watch の副作用に注意（"Gotchas" 参照）

#### 重要な Composables

- **`useExhibitorList.ts`**: フィルタリング、ソート、キーワード検索を編成；`exhibitorList`、`stateKeyword`、`stateGenres`、`stateSort` を所有
- **`useExhibitorListFavorite.ts`**: localStorage 経由でお気に入りを管理；"Gotchas" の composable 内 `window.confirm` を参照
- **`useGenres.ts`**: ジャンル/展示会メタデータを読み込み；`genresMap`、`exhibitions` を提供
- **`useLang.ts`**: 現在の言語状態（リアクティブ；変更時に完全な再レンダリングがトリガー）

### データフロー例: 出展者リスト

1. **読み込み**: `useExhibitorList` の `onMounted` → `getJson()` で JSON をフェッチ → `convertJSONToExhibitorList()` で変換
2. **フィルター**: `filterByGenres()`、`filterByFavorites()`、`searchByKeyword()` を順序通り適用（順序重要）
3. **ソート**: `sortExhibitorList()` を呼び出し `order` / `koma` / `name` でソート
4. **キャッシュ**: `localStorageManager()` 経由でお気に入りを localStorage に永続化

### 型システム

- **`src/types/exhibitorList.ts`**: `Exhibitor`、`Exhibitors`、`JsonExhibitor`、`SortType` ユニオン
- **`src/types/lang.ts`**: `Lang` = `'ja' | 'en'`（二言語対応）
- **`src/types/index.ts`**: 中央エクスポート；すべての内部型を再エクスポート
- **パターン**: 明示的な `type` エクスポートを推奨；列挙は union で表現（例：`SortType = 'order' | 'koma' | 'search'`）

## 開発ワークフロー

### コマンド

```bash
pnpm dev        # Vite dev サーバー起動（HMR 有効）
pnpm build      # 完全ビルド: type-check → test → build-only
pnpm test       # Vitest（シングルラン）
pnpm test:watch # ウォッチモード
pnpm typecheck # vue-tsc
pnpm lint       # ESLint（自動修正）
pnpm format     # Prettier
```

### テスト

- **フレームワーク**: Vitest + Vue Test Utils
- **設定**: `vitest.config.ts`（JSDOM、グローバル有効）
- **パターン**:
  - 子要素をスタブでシャローマウント
  - import 境界で composables をモック
  - テストユーティルは `src/utils/**/*.spec.ts` 内
- **注記**: 一部 composables は `window.confirm()` を使用 → テスト時にスタブまたはモック化

### デバッグ

- **Dev サーバー**: `pnpm dev` → ブラウザで開く、ファイル変更時 HMR
- **コンソール**: localStorage（`localStorage.getItem(key)`）でお気に入り状態を確認
- **Vue DevTools**: コンポーネント階層を検査、`refs`、`computed` 値を確認
- **型エラー**: プッシュ前に `pnpm typecheck` を実行

## 共通パターンと規約

### ユーティリティ構造

- **`src/utils/exhibitorList/`**: ドメイン固有のユーティル（convert、filter、search、sort、heading、count）
  - **規約**: 純粋関数、副作用なし
  - **例**: `sortExhibitorList(list, sortKey)` は新規ソート配列を返す
- **`src/utils/index.ts`**: すべてのユーティルのバレルエクスポート
- **命名**: 関数は `camelCase`、型は `PascalCase`

### ローカライゼーション（i18n）

- **i18n ライブラリなし**: 代わりに二言語データ + `useLang()` composable
- **パターン**: JSON に `ja` と `en` キーを保持（`name`、`nameEng`；`contents`、`contentsEng`）
- **条件付きレンダー**: `lang.value === 'ja' ? jaText : engText` または computed を使用

### スタイリング

- **entries 内にスコープ CSS なし**: entries は Web Components（shadow DOM が適用される可能性）
- **CSS 変数**: `public/css/n-system-variables.css` がデザイントークンを定義
- **Tailwind**: Vue コンポーネントに適用；`tailwind.config.js` でコンテンツパスを確認

### localStorage 統合

- **`src/lib/localStorage.ts`**: `localStorageManager(key)` を提供し `{ get, set }` を返す
- **パターン**: `const { set, get } = localStorageManager('my-key'); const data = JSON.parse(get() || '[]')`
- **注意**: 直接 `window.localStorage` はまれ；マネージャー抽象化を推奨

### エラーハンドリング

- **JSON フェッチ**: `getJson<T>(path)` は失敗する可能性 → 現在 catch なし；エラーバウンダリ追加を検討
- **ソート検証**: `sortKey` が item キーにない場合 `sortExhibitorList()` は例外を throw → 呼び出し元で検証

## 落とし穴とリファクタホットスポット

### 既知の問題

1. **computed 内の副作用**: `exhibitorList` computed が `isDataReady` をトグル → 無限ループの可能性
2. **computed 内の変更**: `exhibitionOptions` computed が `initGenreFlags()` を呼び出し → リアクティブ状態を変更
3. **浅い watch**: `watch(genreFlags.value)` に `deep: true` なし → ネストされた変更を見落とす可能性
4. **直接 `confirm` を composable 内**: `useExhibitorListFavorite` が `window.confirm()` を呼び出し → テスト困難；注入可能コールバック推奨
5. **型安全性ギャップ**: `sortKey` はランタイム文字列、遅延検証；`Exhibitor` キーからのマップ型を検討

### リファクタ優先度

1. **computed からの副作用を除去**（仕様 Step 1）
2. **ジャンルフィルターロジックを抽出** `useGenreFilter` composable へ（Step 2）
3. **confirm コールバックを注入** favorites composable へ（Step 3）
4. **ソートキータイプを強化**（仕様 Step 5）

### パフォーマンスノート

- **仮想化なし**: 大規模リスト（`>1000` 項目）は遅くなる可能性；遅延レンダリングを検討
- **検索のデバウンスなし**: キーワード入力が即座に完全 fuse 検索をトリガー；レスポンス改善にデバウンスを追加
- **メモリ内フィルタリング**: バックエンド ページング なし；現在のデータセットサイズに適切

## ファイル構造リファレンス

```
src/
├── components/
│   ├── entries/          # Web Components (.ce.vue、自動登録)
│   │   ├── layouts/      # NCard、NContainer*、NGrid など
│   │   ├── parts/        # NChip、NTitle、NLink、NImage など
│   │   ├── media/        # NExhibitors（複雑なコンポーネント）
│   │   ├── interaction/  # NTooltip*、インタラクティブ要素
│   │   └── data/         # NBulletedList など
│   ├── features/         # Vue 専用: ExhibitorListItem、BtnMenu、ExhibitorProfile
│   ├── icons/            # アイコンコンポーネント（すべて .vue、IconXxx 命名）
│   ├── ui/               # 原子的 UI: BtnBase、ModalBase、InputSearch、TabsBase など
│   └── templates/        # ページレベルレイアウトコンポーネント
├── composables/          # use* 関数（状態とロジック）
├── types/                # TypeScript インターフェースと型
├── utils/                # 純粋ユーティル関数
│   └── exhibitorList/    # ドメイン固有: convert、filter、search、sort、heading
├── lib/                  # 中核の抽象化: cn（クラスマージャー）、localStorage、fuseSearch
├── styles/               # Tailwind 設定、デザイントークン
├── assets/               # CSS とメディア
└── main.ts               # エントリーポイント: .ce.vue コンポーネント自動登録
```

## AI エージェント向けヒント

1. **コンポーネント サフィックスを常に確認**: `.ce.vue` = 自動登録 Web Component；`.vue` = Vue 専用
2. **型優先アプローチ**: 新規ユーティル作成前に `src/types/` を確認；型をデータ形状に合わせる
3. **データレイヤーとしての Composable**: composables を「サービス」と考える；状態 + 導出ロジックを所有
4. **読み取り専用エクスポートに注視**: Composable がミュータブルと読み取り専用 refs をエクスポートする場合、理由を理解
5. **JSON 構造をテスト**: `getJson<T>()` に組み込む前に JSON パスとスキーマを検証；テスト時はモック
6. **ローカライゼーション**: デフォルトは二言語対応；UI テキスト追加時は `ja` と `en` 両方のバージョン追加
7. **リファクタコンパニオン**: 進行中のリファクタ計画は `.github/refactor-spec.md`（またはプロジェクトドキュメント）を参照

---

**最終更新**: 2025-11-21  
**保守者**: 開発事業部 / 鷺野谷  
**関連**: README.md、package.json、vite.config.ts、tsconfig.app.json
