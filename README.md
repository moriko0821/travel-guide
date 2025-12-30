# Travel Guide App（旅行スポット管理アプリ）

旅行のスポットを「地図」と「お気に入り」で管理できる Web アプリです。  
Trip ごとに URL（`?trip=...`）でデータが分離され、共有もしやすい設計です。

- デモ URL：https://travel-guide-indol.vercel.app/
- GitHub：https://github.com/moriko0821/travel-guide

---

## 主な機能

- Trip（旅行プラン）を自動作成し、URL に `?trip=<id>` を付与して以後その Trip を表示
- Trip 名の編集（ヘッダーから変更 → 保存）
- Google Map にスポット（マーカー）を表示
- マーカークリックでスポット詳細を表示
- 「新しいスポットを追加」フォームからスポットを登録
  - Google Places Autocomplete による候補表示（最大 5 件）
  - 候補を選ぶと緯度/経度を自動入力し、写真参照（photoReference）も取得して保存
- 登録済みスポットの検索（名前の部分一致）
- カテゴリフィルター（all/city/nature/restaurant/museum/hotel/other）
- ⭐ でお気に入り登録/解除、Favorites ページで一覧表示
- 写真が取得できない場合は `/no-image.png` を表示（フォールバック）

---

## 技術スタック

- React + TypeScript（Vite）
- Supabase（Database）
- Google Maps JavaScript API / Places API
- Tailwind CSS
- Vercel（デプロイ）

---

## 画面

- 地図：`/`
<img width="1328" height="790" alt="image" src="https://github.com/user-attachments/assets/00b63284-6b43-499b-ad8d-31b91db27ea5" />



- お気に入り追加
<img width="865" height="562" alt="image" src="https://github.com/user-attachments/assets/44701817-4804-47bc-b5ab-a9a9d21f3ca7" />



- お気に入り：`/favorites`
<img width="1276" height="846" alt="image" src="https://github.com/user-attachments/assets/d1814934-d9a4-49ef-9c64-fabb641163ce" />
---

## セットアップ

### 1) Install

```bash
npm install
```

### 2) Env

ルートに `.env` を作成し、少なくとも以下を設定します。

```env
VITE_GOOGLE_MAPS_API_KEY=xxxxxxxxxxxxxxxxxxxx
```

Supabase 用の環境変数はあなたの実装に合わせて設定してください  
（例：`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` など）。

### 3) Run

```bash
npm run dev
```

---

## 使い方（デモで見る順）

1. トップ（地図）にアクセスすると Trip が自動生成され、URL に `?trip=...` が付きます
2. 「新しいスポットを追加」からスポットを登録します
3. 地図上のマーカーをクリックすると詳細が表示されます
4. ⭐ でお気に入り登録し、`/favorites` で一覧確認できます

---

## License

MIT（任意）
