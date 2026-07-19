# Divide by 3 Automaton Demo (React)

入力された整数文字列が 3 で割り切れるかを、有限オートマトンで判定するデモです。

- UI: React (Vite)
- グラフ描画: 固定 SVG
- 入力を 1 文字ずつ処理し、状態遷移をアニメーション表示
- 状態図は `S0` を頂点、`S1` と `S2` を下段に置いた三角形レイアウト

## 1. 前提環境

- Node.js 18 以上（推奨: Node.js 20 以上）
- npm
- OS: Windows / macOS / Linux

## 2. セットアップ

プロジェクトルートで依存関係をインストールします。

```bash
npm install
```

### Windows PowerShell で `npm` 実行エラーが出る場合

PowerShell の実行ポリシーにより `npm` がブロックされることがあります。その場合は `cmd` 経由で実行してください。

```powershell
cmd /c npm install
```

## 3. 開発サーバー起動

```bash
npm run dev
```

PowerShell で問題が出る場合:

```powershell
cmd /c npm run dev
```

起動後、表示された URL（通常 `http://localhost:5173`）をブラウザで開きます。

## 4. 本番ビルド

```bash
npm run build
```

PowerShell で問題が出る場合:

```powershell
cmd /c npm run build
```

ビルド成果物は `dist/` に出力されます。

プレビュー実行:

```bash
npm run preview
```

### GitHub Pages への配置

このプロジェクトは GitHub Pages の以下の URL を前提に設定しています。

- `https://novisoftware.github.io/demo/DivisibleBy3Automaton/`

そのため、Vite の `base` は `/demo/DivisibleBy3Automaton/` に設定済みです。

公開手順:

1. `npm run build` を実行
1. `dist/` 配下のファイル一式を生成
1. GitHub Pages で公開している `demo/DivisibleBy3Automaton/` 配下に `dist/` の中身を配置

注意点:

- 配置するのは `dist` フォルダそのものではなく、中身です
- `index.html` と `assets/` が `https://novisoftware.github.io/demo/DivisibleBy3Automaton/` 直下に見える状態にします
- `base` が `/demo/DivisibleBy3Automaton/` なので、別パスへ置く場合は [vite.config.js](vite.config.js) の設定変更が必要です

もし GitHub リポジトリの `gh-pages` ブランチで運用するなら、`dist/` の中身をそのブランチのルートに置く構成でも問題ありません

## 5. 使い方

1. 「Integer string」に整数文字列を入力
1. `Start` をクリック
1. 状態図とトレースが 1 ステップずつ進む
1. 終端記号 `END` で `ACCEPT` または `REJECT` を表示

`Reset` で初期状態に戻せます。

## 6. 判定仕様（3 で割り切れるか）

- 状態は `S0`, `S1`, `S2`
- それぞれ「ここまでの値を 3 で割った余り 0/1/2」を表す
- 開始状態は `S0`
- 1 桁読むたびに次状態は次式で決定:

  `next = (current * 10 + digit) % 3`

- 入力末尾（`END`）で:
  - `S0 -> ACCEPT`
  - `S1 -> REJECT`
  - `S2 -> REJECT`

## 7. 実装ファイル

- メイン実装: `src/App.jsx`
- スタイル: `src/styles.css`

## 8. 補足

- `+` / `-` 付きの整数文字列も受け付けます（符号を除いた数字列で評価）
- 小数点や指数表記は非対応です
- 状態図は SVG で座標固定しているため、`S0`, `S1`, `S2` は崩れずに三角形配置されます
