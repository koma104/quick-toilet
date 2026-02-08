# タイポグラフィ・フォント指定（デザイン仕様）

Quick Toilet アプリで使用するフォント・文字サイズの指定一覧。実装の参照用です。

---

## 1. フォントファミリー

| 用途 | 指定 | 定義場所 |
|------|------|----------|
| 本文・UI | Geist Sans | `layout.tsx` で読み込み、`globals.css` の `--font-sans` / `body` に適用 |
| 等幅（未使用） | Geist Mono | `layout.tsx` で `--font-mono` に定義のみ |

---

## 2. フォントサイズ一覧

Tailwind のクラスとおおよそのピクセル換算。

| クラス | 相当 | 用途 |
|--------|------|------|
| `text-xs` | 12px (0.75rem) | ラベル・タグ・補助情報 |
| `text-sm` | 14px (0.875rem) | 説明文・住所・単位（m/分）・設備「なし」 |
| 指定なし (base) | 16px (1rem) | エラー/空メッセージなどデフォルト |
| `text-lg` | 18px (1.125rem) | セクション見出し・カードタイトル・CTA文言 |
| `text-xl` | 20px (1.25rem) | ヘッダーロゴ・数値（距離・徒歩） |
| `text-2xl` | 24px (1.5rem) | モーダルタイトル（SP） |
| `text-3xl` | 30px (1.875rem) | モーダルタイトル（PC / md以上） |

---

## 3. 画面・コンポーネント別

### 3.1 ページ（page.tsx）

| 要素 | サイズ | ウェイト・その他 |
|------|--------|------------------|
| ヘッダー「QT」 | `text-xl` | `font-bold` `tracking-tight` |
| 「近くのトイレ」見出し | `text-lg` | `font-semibold` |
| 「カードをタップすると…」 | `text-sm` | 色のみ（slate-500） |
| フッター「リストを更新」ボタン | デフォルト | `font-bold` |

### 3.2 トイレカード（ToiletListItem.tsx）

| 要素 | サイズ | ウェイト・その他 |
|------|--------|------------------|
| 施設名（タイトル） | `text-lg` | `font-bold` `leading-snug` |
| 徒歩「○分」バッジ | `text-xs` | `font-bold` |
| 距離「○m」 | `text-sm` | `font-medium` |
| 住所 | `text-sm` | 指定なし |
| 設備タグ（24時間・アクセシブル・キッズ向け） | `text-xs` | `font-bold` `uppercase` `tracking-wider` |

### 3.3 モーダル（MapModal.tsx）

| 要素 | サイズ | ウェイト・その他 |
|------|--------|------------------|
| 施設名（タイトル） | `text-2xl` / `md:text-3xl` | `font-extrabold` `leading-tight` |
| 住所 | `text-sm` | `font-medium` |
| 「距離」「徒歩」ラベル | `text-xs` | `font-bold` `uppercase` `tracking-wider` |
| 距離・徒歩の数値 | `text-xl` | `font-bold` |
| 数値の単位「m」「分」 | `text-sm` | 指定なし |
| 「設備」ラベル | `text-xs` | `font-bold` `uppercase` `tracking-widest` |
| 設備タグ（24時間・アクセシブル・キッズ向け） | `text-xs` | `font-bold` `uppercase` `tracking-wider` |
| 設備「なし」 | `text-sm` | 指定なし（ラベルと同系色） |
| 「ナビ開始」ボタン | `text-lg` | `font-bold`（ボタン全体） |

### 3.4 リスト状態（ToiletList.tsx）

| 要素 | サイズ | 備考 |
|------|--------|------|
| エラーメッセージ・空メッセージ | 指定なし (base) | 枠の色・テキスト色のみ指定 |

---

## 4. フォントウェイト・字間

| クラス | 用途 |
|--------|------|
| `font-bold` | ヘッダー、カードタイトル、数値、タグ、ボタン |
| `font-extrabold` | モーダルタイトル |
| `font-semibold` | ページ見出し「近くのトイレ」 |
| `font-medium` | 住所、距離「○m」 |
| `tracking-tight` | ヘッダー「QT」 |
| `tracking-wider` | 設備タグ・「距離」「徒歩」ラベル |
| `tracking-widest` | 「設備」ラベル |
| `leading-tight` | モーダルタイトル |
| `leading-snug` | カードタイトル（施設名） |

---

## 5. 運用メモ

- **最小サイズ**: ラベル・タグは `text-xs`（12px）を下限とする。注意文専用の 10px は使わない。
- **レスポンシブ**: モーダルタイトルのみ SP `text-2xl` / PC `text-3xl` で切り替え。他は共通。
- 色指定は本ドキュメントの対象外（Tailwind の color を参照）。
