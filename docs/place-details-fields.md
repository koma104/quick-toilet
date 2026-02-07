# Place Details で取得できる項目（タグ表示用）

Places API (New) の **Place Details**（`GET https://places.googleapis.com/v1/places/{placeId}`）で、トイレカードのタグに使えそうなフィールドをまとめています。

## リクエスト方法

- **エンドポイント**: `GET https://places.googleapis.com/v1/places/{placeId}`
- **ヘッダー**: `X-Goog-Api-Key`, `X-Goog-FieldMask`（取得したいフィールドをカンマ区切りで指定）
- **クエリ**: `languageCode=ja` で日本語化可能

placeId は、現在の searchNearby / searchText のレスポンスの `places[].id` で取得できます。

---

## タグに使えるフィールド一覧

| 表示したいタグ | フィールド名 | 型 | 説明 | 課金 SKU |
|----------------|-------------|-----|------|----------|
| **24時間営業** | `regularOpeningHours` または `currentOpeningHours` | OpeningHours | 営業時間。24時間の場合は「open のみで close なし」の 1 期間（day=0, hour=0, minute=0）で返る。 | Place Details **Enterprise** |
| **アクセシブル（車椅子対応入口）** | `accessibilityOptions` | AccessibilityOptions | 車椅子で入れられる入口かどうかなど。`wheelchairAccessibleEntrance` などのサブフィールドあり。 | Place Details **Pro** |
| **トイレあり** | `restroom` | boolean | トイレの有無。公衆トイレの場合はほぼ true の想定。 | Place Details **Enterprise + Atmosphere** |
| **キッズ向け / ベビーケア** | `goodForChildren` | boolean | 子ども向けかどうか。オムツ台などはここで分かる場合あり。 | Place Details **Enterprise + Atmosphere** |
| **営業状況** | `businessStatus` | enum | OPEN / CLOSED_TEMPORARILY / CLOSED_PERMANENTLY。営業中かどうかの表示に利用可能。 | Place Details **Pro** |

---

## 課金（SKU）の目安

- **Pro**: `accessibilityOptions`, `businessStatus`, `displayName` など（いまの searchNearby / searchText でも一部利用中）
- **Enterprise**: 営業時間（`regularOpeningHours`, `currentOpeningHours`）→ **24時間営業タグ**
- **Enterprise + Atmosphere**: `restroom`, `goodForChildren` など → **トイレあり・ベビーケアタグ**

無料枠を超えると、Place Details はリクエスト数と FieldMask の内容に応じて課金されます。  
一覧で 3 件表示するたびに 3 回 Place Details を呼ぶと料金が増えるため、「一覧では基本情報のみで、タップして詳細を開いたときだけ Place Details を呼ぶ」などの設計がおすすめです。

---

## 実装の進め方の例

1. **まず Pro まで**: `accessibilityOptions` と `businessStatus` を取得し、「アクセシブル」「営業中」タグを表示する。
2. **Enterprise を有効にする場合**: `currentOpeningHours` を取得し、24時間営業かどうかを判定して「24時間」タグを表示する。
3. **Enterprise + Atmosphere まで使う場合**: `restroom`, `goodForChildren` を追加し、「トイレあり」「ベビーケア」タグを表示する。

タグ用の UI はすでに ToiletListItem 内に用意してあるので、API からこれらのフィールドを返すようにバックエンド（または Place Details を呼ぶ API Route）を拡張し、`Place` 型に `tags` や `accessibilityOptions` などを追加して渡せば表示できます。
