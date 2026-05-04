# Word Processor Suite 📝

APIから取得したランダムな言葉を複数の方法で分析・処理する大型スクリプト。

## 機能

- **APIからの言葉取得**: https://random-word-api.herokuapp.com/word から自動取得
- **統計分析**: 文字数、母音・子音数、ユニーク文字数など
- **パターン生成**: 点線化、大文字小文字交互、回転、部分文字列など
- **数値表現**: ASCII値、ハッシュ値、文字コード
- **モース信号**: 言葉をモース信号に変換
- **音声表記**: 言葉を音声表記に変換
- **キャッシング**: 分析結果をJSON形式で保存
- **ログ記録**: すべての分析をタイムスタンプ付きで記録

## 使用方法

```bash
# 分析の実行
npm start

# または
node analyzer.js
```

## 出力例

```
🔄 Fetching random word...
✅ Word: "example"

📊 Word Statistics:
  Length: 7
  Vowels: 3
  Consonants: 4
  Unique Characters: 6
  Is Palindrome: false
  Reversed: elpmaxe

🔤 Character Rotations (first 5):
  1. example
  2. xamplae
  3. ampleax
  ...

📍 Pattern Variations:
  Dotted: e.a.p.e
  Alternating Case: ExAmPlE

🔢 Numeric Representations:
  ASCII Sum: 784
  Hash Value: 123456789

🔵 Morse Code: . -..- .- -- .--. .-.. .

🎵 Phonetic: EE-KSAY-M-P-LEEEE

✅ Analysis complete!
📝 Log file: word-processor.log
💾 Cache file: word-cache.json
```

## ファイル説明

- `analyzer.js` - メインスクリプト（500+行の巨大スクリプト）
- `package.json` - npm設定ファイル
- `word-processor.log` - 実行ログ（自動生成）
- `word-cache.json` - キャッシュデータ（自動生成）

## 処理内容

1. **Fetch**: APIから言葉を取得
2. **Analyze**: 統計情報を生成
3. **Transform**: 複数の形式に変換
4. **Log**: ファイルに記録
5. **Cache**: 結果をキャッシュ

## 技術仕様

- **言語**: JavaScript (Node.js)
- **API**: HTTPS通信で外部APIと連携
- **ストレージ**: ファイルシステム
- **機能**: 15+ の処理エンジン

