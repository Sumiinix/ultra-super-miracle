/**
 * テスト用スクリプト - ランダムな単語を使った処理
 * APIから取得した単語をベースに何かやってます
 */

// ランダムな単語を取得
async function getRandomWord() {
  try {
    const response = await fetch('https://random-word-api.herokuapp.com/word');
    const data = await response.json();
    return data[0];
  } catch (error) {
    console.error('API エラー:', error);
    return 'default';
  }
}

// 単語から様々な処理を生成
class WordProcessor {
  constructor(word) {
    this.word = word;
    this.reversed = [...word].reverse().join('');
    this.upper = word.toUpperCase();
    this.lower = word.toLowerCase();
  }

  analyze() {
    console.log(`\n📝 単語分析: "${this.word}"`);
    console.log(`  長さ: ${this.word.length}`);
    console.log(`  逆順: ${this.reversed}`);
    console.log(`  大文字: ${this.upper}`);
    console.log(`  小文字: ${this.lower}`);
    
    // 単語の文字列をスコアリング
    const score = this.word.split('').reduce((sum, char) => 
      sum + char.charCodeAt(0), 0
    );
    console.log(`  スコア: ${score}`);
    
    return {
      word: this.word,
      length: this.word.length,
      score: score
    };
  }

  generatePattern() {
    console.log(`\n🎨 パターン生成:`);
    
    const patterns = [];
    for (let i = 0; i < 3; i++) {
      let pattern = '';
      for (let j = 0; j < this.word.length; j++) {
        pattern += this.word[j % this.word.length];
        if ((j + 1) % 2 === 0) pattern += '-';
      }
      patterns.push(pattern);
    }
    
    patterns.forEach((p, i) => console.log(`  パターン${i + 1}: ${p}`));
    return patterns;
  }

  generateCode() {
    console.log(`\n💻 生成されたコード片:`);
    const code = `
// 単語 "${this.word}" から生成
const word = "${this.word}";
const reversed = "${this.reversed}";
const hash = ${this.word.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)};
const length = ${this.word.length};

function process(input) {
  return input
    .split('')
    .map(c => c.charCodeAt(0))
    .reduce((a, b) => a + b, 0) % length;
}

console.log(\`Result: \${process("${this.word}")}\`);
`;
    console.log(code);
    return code;
  }
}

// メイン実行
(async () => {
  console.log('='.repeat(50));
  console.log('テストスクリプト実行');
  console.log('='.repeat(50));
  
  const word = await getRandomWord();
  const processor = new WordProcessor(word);
  
  // 分析
  processor.analyze();
  
  // パターン生成
  processor.generatePattern();
  
  // コード生成
  const code = processor.generateCode();
  
  console.log('\n' + '='.repeat(50));
  console.log('✅ テストスクリプト完了');
  console.log('='.repeat(50));
})();
