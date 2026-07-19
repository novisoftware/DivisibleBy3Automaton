# 3で割り切れるかを判定するオートマトン<br>Divide by 3 Automaton Demo (React)

入力された整数文字列が 3 で割り切れるかを、有限オートマトンで判定するデモです。

デモはこちらです。

- https://novisoftware.github.io/demo/DivisibleBy3Automaton/

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

### 状態定義

- `S0`: 余りが 0（開始状態かつ唯一の受理状態）
- `S1`: 余りが 1
- `S2`: 余りが 2

### 遷移表

| 現在状態 | 入力: 0,3,6,9 | 入力: 1,4,7 | 入力: 2,5,8 |
| --- | --- | --- | --- |
| `S0`（開始 / 受理） | `S0` | `S1` | `S2` |
| `S1` | `S1` | `S2` | `S0` |
| `S2` | `S2` | `S0` | `S1` |

## 7. 実装ファイル

- メイン実装: `src/App.jsx`
- スタイル: `src/styles.css`

## 8. 補足

- `+` / `-` 付きの整数文字列も受け付けます（符号を除いた数字列で評価）
- 小数点や指数表記は非対応です
- 状態図は SVG で座標固定しているため、`S0`, `S1`, `S2` は崩れずに三角形配置されます

## 9. 参考: 7で割り切れるかを判定するオートマトン

7で割り切れる判定でも、状態は「ここまでの値を 7 で割った余り」で表せます。

- 状態0: 余り 0（開始状態かつ受理状態）
- 状態1: 余り 1
- 状態2: 余り 2
- 状態3: 余り 3
- 状態4: 余り 4
- 状態5: 余り 5
- 状態6: 余り 6

遷移は次式で決まります。

`next = (current * 10 + digit) % 7`

### 遷移表（入力 0〜9）

| 現在の状態（7で割った余り） | 入力0 | 入力1 | 入力2 | 入力3 | 入力4 | 入力5 | 入力6 | 入力7 | 入力8 | 入力9 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 状態0 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 0 | 1 | 2 |
| 状態1 | 3 | 4 | 5 | 6 | 0 | 1 | 2 | 3 | 4 | 5 |
| 状態2 | 6 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 0 | 1 |
| 状態3 | 2 | 3 | 4 | 5 | 6 | 0 | 1 | 2 | 3 | 4 |
| 状態4 | 5 | 6 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 0 |
| 状態5 | 1 | 2 | 3 | 4 | 5 | 6 | 0 | 1 | 2 | 3 |
| 状態6 | 4 | 5 | 6 | 0 | 1 | 2 | 3 | 4 | 5 | 6 |
