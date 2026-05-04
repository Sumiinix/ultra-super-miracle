/**
 * 🚀 MASSIVE WORD GENERATOR & ANALYZER 🚀
 * ランダムワードAPIから言葉を取得し、様々な巨大な処理を実行する
 * 複数のアルゴリズム、データ構造、変換処理を含む包括的なスクリプト
 */

const crypto = require('crypto');

// ==================== APIレイヤー ====================
class WordAPIClient {
  constructor(maxRetries = 3) {
    this.maxRetries = maxRetries;
    this.baseUrl = 'https://random-word-api.herokuapp.com';
    this.cache = new Map();
  }

  async fetchWord(retries = 0) {
    try {
      const cacheKey = 'random_word_' + Date.now().toString().slice(-3);
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey);
      }

      const response = await fetch(`${this.baseUrl}/word`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      const word = data[0];
      
      this.cache.set(cacheKey, word);
      if (this.cache.size > 100) {
        const firstKey = this.cache.keys().next().value;
        this.cache.delete(firstKey);
      }
      
      return word;
    } catch (error) {
      if (retries < this.maxRetries) {
        console.warn(`⚠️  リトライ ${retries + 1}/${this.maxRetries}...`);
        await new Promise(r => setTimeout(r, 1000 * (retries + 1)));
        return this.fetchWord(retries + 1);
      }
      console.error('❌ API取得失敗:', error.message);
      return this.generateFallbackWord();
    }
  }

  generateFallbackWord() {
    const fallback = ['javascript', 'algorithm', 'generator', 'analyzer', 'processor'];
    return fallback[Math.floor(Math.random() * fallback.length)];
  }
}

// ==================== 文字列分析エンジン ====================
class AdvancedStringAnalyzer {
  constructor(word) {
    this.word = word;
    this.chars = word.split('');
    this.length = word.length;
  }

  // 各種スコア計算
  calculateScores() {
    const scores = {};

    // 1. ASCIIスコア
    scores.asciiSum = this.chars.reduce((sum, c) => sum + c.charCodeAt(0), 0);
    scores.asciiAvg = (scores.asciiSum / this.length).toFixed(2);

    // 2. エントロピー計算（情報量）
    const freq = {};
    this.chars.forEach(c => {
      freq[c] = (freq[c] || 0) + 1;
    });
    let entropy = 0;
    Object.values(freq).forEach(count => {
      const p = count / this.length;
      entropy -= p * Math.log2(p);
    });
    scores.entropy = entropy.toFixed(4);

    // 3. ポリモルフィズムスコア（文字多様性）
    scores.uniqueChars = Object.keys(freq).length;
    scores.diversity = (scores.uniqueChars / this.length).toFixed(4);

    // 4. 母音・子音比
    const vowels = 'aeiou';
    scores.vowelCount = this.chars.filter(c => vowels.includes(c.toLowerCase())).length;
    scores.consonantCount = this.length - scores.vowelCount;
    scores.vowelRatio = (scores.vowelCount / this.length * 100).toFixed(2);

    // 5. チェックサム（CRC32風）
    let crc = 0xFFFFFFFF;
    for (let i = 0; i < this.chars.length; i++) {
      crc ^= this.chars[i].charCodeAt(0);
      for (let j = 0; j < 8; j++) {
        crc = (crc >>> 1) ^ ((crc & 1) ? 0xEDB88320 : 0);
      }
    }
    scores.checksum = (crc >>> 0).toString(16);

    return scores;
  }

  // 回文・パターン分析
  analyzePatterns() {
    const patterns = {};

    // 回文チェック
    const reversed = this.chars.slice().reverse().join('');
    patterns.isPalindrome = this.word === reversed;

    // 部分回文を検出
    patterns.palindromes = [];
    for (let i = 0; i < this.chars.length; i++) {
      for (let j = i + 2; j <= this.chars.length; j++) {
        const substr = this.word.substring(i, j);
        const subReversed = substr.split('').reverse().join('');
        if (substr === subReversed) {
          patterns.palindromes.push(substr);
        }
      }
    }

    // 文字列パターンマッチング
    patterns.repeatingPatterns = [];
    for (let len = 1; len < this.length; len++) {
      const pattern = this.word.substring(0, len);
      if (this.word.split(pattern).length > 3) {
        patterns.repeatingPatterns.push(pattern);
      }
    }

    return patterns;
  }

  // ハッシュ値生成（複数アルゴリズム）
  generateHashes() {
    const hashes = {};

    // SHA-256
    const sha256 = crypto.createHash('sha256').update(this.word).digest('hex');
    hashes.sha256 = sha256;

    // MD5（デモ用、実は非推奨）
    const md5 = crypto.createHash('md5').update(this.word).digest('hex');
    hashes.md5 = md5;

    // シンプルなハッシュ（DJB2アルゴリズム）
    let hash = 5381;
    for (let i = 0; i < this.chars.length; i++) {
      hash = ((hash << 5) + hash) + this.chars[i].charCodeAt(0);
      hash = hash & hash; // 32bit整数に変換
    }
    hashes.djb2 = (hash >>> 0).toString(16);

    // FNVハッシュ
    let fnvHash = 0x811c9dc5;
    for (let i = 0; i < this.chars.length; i++) {
      fnvHash ^= this.chars[i].charCodeAt(0);
      fnvHash += (fnvHash << 1) + (fnvHash << 4) + (fnvHash << 7) + (fnvHash << 8) + (fnvHash << 24);
      fnvHash = fnvHash >>> 0;
    }
    hashes.fnv = fnvHash.toString(16);

    return hashes;
  }
}

// ==================== 言語統計エンジン ====================
class LinguisticAnalyzer {
  constructor(word) {
    this.word = word;
  }

  analyze() {
    const stats = {};

    // キャラクタークラス分類
    stats.uppercase = this.word.match(/[A-Z]/g)?.length || 0;
    stats.lowercase = this.word.match(/[a-z]/g)?.length || 0;
    stats.digits = this.word.match(/[0-9]/g)?.length || 0;
    stats.special = this.word.match(/[^a-zA-Z0-9]/g)?.length || 0;

    // 最も頻繁な文字
    const freq = {};
    for (const char of this.word) {
      freq[char] = (freq[char] || 0) + 1;
    }
    const maxFreq = Math.max(...Object.values(freq));
    stats.mostFrequent = Object.keys(freq).filter(c => freq[c] === maxFreq);
    stats.mostFrequentCount = maxFreq;

    // 最も珍しい文字
    const minFreq = Math.min(...Object.values(freq));
    stats.rarest = Object.keys(freq).filter(c => freq[c] === minFreq);
    stats.rareCount = minFreq;

    // 初出位置マップ
    stats.firstOccurrence = {};
    for (let i = 0; i < this.word.length; i++) {
      const char = this.word[i];
      if (!(char in stats.firstOccurrence)) {
        stats.firstOccurrence[char] = i;
      }
    }

    // n-gram分析
    stats.bigrams = this.getNGrams(2);
    stats.trigrams = this.getNGrams(3);

    return stats;
  }

  getNGrams(n) {
    const ngrams = {};
    for (let i = 0; i <= this.word.length - n; i++) {
      const gram = this.word.substring(i, i + n);
      ngrams[gram] = (ngrams[gram] || 0) + 1;
    }
    return ngrams;
  }
}

// ==================== 変換エンジン ====================
class TransformationEngine {
  constructor(word) {
    this.word = word;
  }

  generateAllTransforms() {
    const transforms = {};

    // テキスト変換
    transforms.uppercase = this.word.toUpperCase();
    transforms.lowercase = this.word.toLowerCase();
    transforms.reversed = this.word.split('').reverse().join('');
    transforms.camelCase = this.toCamelCase();
    transforms.pascalCase = this.toPascalCase();
    transforms.snakeCase = this.toSnakeCase();
    transforms.kebabCase = this.toKebabCase();

    // バイナリ表現
    transforms.binary = this.word.split('').map(c => 
      c.charCodeAt(0).toString(2).padStart(8, '0')
    ).join(' ');

    // 16進数表現
    transforms.hexadecimal = this.word.split('').map(c => 
      c.charCodeAt(0).toString(16).padStart(2, '0')
    ).join(' ');

    // Base64エンコーディング
    transforms.base64 = Buffer.from(this.word).toString('base64');

    // ROT13
    transforms.rot13 = this.word.split('').map(c => {
      if (c >= 'a' && c <= 'z') {
        return String.fromCharCode((c.charCodeAt(0) - 97 + 13) % 26 + 97);
      }
      if (c >= 'A' && c <= 'Z') {
        return String.fromCharCode((c.charCodeAt(0) - 65 + 13) % 26 + 65);
      }
      return c;
    }).join('');

    // Atbash暗号
    transforms.atbash = this.word.split('').map(c => {
      if (c >= 'a' && c <= 'z') {
        return String.fromCharCode(122 - (c.charCodeAt(0) - 97));
      }
      if (c >= 'A' && c <= 'Z') {
        return String.fromCharCode(90 - (c.charCodeAt(0) - 65));
      }
      return c;
    }).join('');

    // 言語別フォーマット
    transforms.leetSpeak = this.toLeetSpeak();
    transforms.morse = this.toMorse();

    return transforms;
  }

  toCamelCase() {
    return this.word.toLowerCase().replace(/[-_\s](.)/g, (_, c) => c.toUpperCase());
  }

  toPascalCase() {
    return this.word.charAt(0).toUpperCase() + this.toCamelCase().slice(1);
  }

  toSnakeCase() {
    return this.word.toLowerCase().replace(/([a-z])([A-Z])/g, '$1_$2');
  }

  toKebabCase() {
    return this.word.toLowerCase().replace(/([a-z])([A-Z])/g, '$1-$2');
  }

  toLeetSpeak() {
    const map = { 'a': '4', 'e': '3', 'i': '1', 'o': '0', 's': '5', 't': '7' };
    return this.word.split('').map(c => map[c.toLowerCase()] || c).join('');
  }

  toMorse() {
    const morse = {
      'a': '.-', 'b': '-...', 'c': '-.-.', 'd': '-..', 'e': '.', 'f': '..-.',
      'g': '--.', 'h': '....', 'i': '..', 'j': '.---', 'k': '-.-', 'l': '.-..',
      'm': '--', 'n': '-.', 'o': '---', 'p': '.--.', 'q': '--.-', 'r': '.-.',
      's': '...', 't': '-', 'u': '..-', 'v': '...-', 'w': '.--', 'x': '-..-',
      'y': '-.--', 'z': '--..',
    };
    return this.word.split('').map(c => morse[c.toLowerCase()] || '').join(' ');
  }
}

// ==================== フラクタル・パターンジェネレータ ====================
class FractalPatternGenerator {
  constructor(word, depth = 3) {
    this.word = word;
    this.depth = depth;
  }

  generateFractals() {
    const fractals = {};

    // Sierpinski風パターン
    fractals.sierpinski = this.generateSierpinskiPattern();

    // Mandelbrot風テキストレンダリング
    fractals.mandelbrotApprox = this.generateMandelbrotApprox();

    // Koch雪片風パターン
    fractals.kochSnowflake = this.generateKochPattern();

    // 再帰的アスキーアート
    fractals.recursiveArt = this.generateRecursiveArt();

    return fractals;
  }

  generateSierpinskiPattern() {
    const size = Math.pow(2, this.depth);
    const pattern = Array(size).fill(null).map(() => Array(size).fill(' '));

    const sierpinski = (x, y, size, depth) => {
      if (depth === 0) {
        pattern[y][x] = '█';
        return;
      }
      const newSize = size / 2;
      sierpinski(x, y, newSize, depth - 1);
      sierpinski(x + newSize, y, newSize, depth - 1);
      sierpinski(x + newSize / 2, y + newSize, newSize, depth - 1);
    };

    sierpinski(0, 0, size, this.depth);
    return pattern.map(row => row.join(''));
  }

  generateMandelbrotApprox() {
    const width = 40;
    const height = 20;
    const result = [];

    for (let row = 0; row < height; row++) {
      let line = '';
      for (let col = 0; col < width; col++) {
        const re = (col / width) * 3.5 - 2.5;
        const im = (row / height) * 2 - 1;
        let iterations = 0;
        let zRe = 0, zIm = 0;

        for (let i = 0; i < 20; i++) {
          const zReNew = zRe * zRe - zIm * zIm + re;
          const zImNew = 2 * zRe * zIm + im;
          zRe = zReNew;
          zIm = zImNew;

          if (zRe * zRe + zIm * zIm > 4) break;
          iterations++;
        }

        const chars = '.,:-=+*#%@';
        line += chars[Math.floor((iterations / 20) * (chars.length - 1))];
      }
      result.push(line);
    }

    return result;
  }

  generateKochPattern() {
    const iterations = this.depth;
    let line = this.word;

    for (let i = 0; i < iterations; i++) {
      const pattern = [];
      for (const char of line) {
        pattern.push(char, '-', char);
      }
      line = pattern.join('');
    }

    return line.substring(0, 100) + '...';
  }

  generateRecursiveArt() {
    const generate = (s, depth) => {
      if (depth === 0) return s;
      const next = s + ' + ' + s;
      return `(${generate(next, depth - 1)})`;
    };

    return generate(this.word, Math.min(this.depth, 4));
  }
}

// ==================== 統計エンジン ====================
class StatisticsEngine {
  constructor(word) {
    this.word = word;
  }

  generateStatistics() {
    const stats = {};

    // 基本統計
    stats.length = this.word.length;
    stats.charCodes = this.word.split('').map(c => c.charCodeAt(0));
    stats.charCodeSum = stats.charCodes.reduce((a, b) => a + b, 0);
    stats.charCodeAverage = (stats.charCodeSum / this.word.length).toFixed(2);

    // 分布統計
    const codes = stats.charCodes;
    stats.min = Math.min(...codes);
    stats.max = Math.max(...codes);
    stats.range = stats.max - stats.min;
    stats.median = codes.length % 2 === 0 
      ? (codes[codes.length / 2 - 1] + codes[codes.length / 2]) / 2
      : codes[Math.floor(codes.length / 2)];

    // 標準偏差
    const mean = stats.charCodeAverage;
    const variance = stats.charCodes.reduce((sum, code) => 
      sum + Math.pow(code - mean, 2), 0) / this.word.length;
    stats.stdDev = Math.sqrt(variance).toFixed(2);

    // スキュー度（非対称性）
    stats.skewness = this.calculateSkewness(codes, mean, Math.sqrt(variance));

    return stats;
  }

  calculateSkewness(codes, mean, stdDev) {
    const n = codes.length;
    const m3 = codes.reduce((sum, code) => 
      sum + Math.pow(code - mean, 3), 0) / n;
    return (m3 / Math.pow(stdDev, 3)).toFixed(4);
  }
}

// ==================== メイン実行エンジン ====================
class MassiveWordGenerator {
  constructor() {
    this.apiClient = new WordAPIClient();
    this.results = {};
  }

  async execute() {
    console.log('\n' + '='.repeat(80));
    console.log('🚀 MASSIVE WORD GENERATOR & ANALYZER - START');
    console.log('='.repeat(80));

    // ステップ1: ワード取得
    console.log('\n📥 ステップ1: ランダムワード取得中...');
    const word = await this.apiClient.fetchWord();
    console.log(`✅ 取得完了: "${word}"`);

    // ステップ2: 基本分析
    console.log('\n🔍 ステップ2: 文字列分析実行中...');
    const analyzer = new AdvancedStringAnalyzer(word);
    const scores = analyzer.calculateScores();
    const patterns = analyzer.analyzePatterns();
    const hashes = analyzer.generateHashes();

    console.log('  📊 スコア:');
    Object.entries(scores).forEach(([key, value]) => {
      console.log(`    • ${key}: ${value}`);
    });

    console.log('  🎭 パターン:');
    console.log(`    • 回文: ${patterns.isPalindrome ? '✓' : '✗'}`);
    console.log(`    • 部分回文数: ${patterns.palindromes.length}`);
    console.log(`    • 繰り返しパターン: ${patterns.repeatingPatterns.length}`);

    console.log('  🔐 ハッシュ:');
    console.log(`    • SHA256: ${hashes.sha256.substring(0, 16)}...`);
    console.log(`    • MD5: ${hashes.md5.substring(0, 16)}...`);
    console.log(`    • DJB2: ${hashes.djb2}`);

    // ステップ3: 言語分析
    console.log('\n📚 ステップ3: 言語統計分析...');
    const linguist = new LinguisticAnalyzer(word);
    const lingStats = linguist.analyze();

    console.log('  📈 文字クラス分布:');
    console.log(`    • 大文字: ${lingStats.uppercase}`);
    console.log(`    • 小文字: ${lingStats.lowercase}`);
    console.log(`    • 数字: ${lingStats.digits}`);
    console.log(`    • 特殊文字: ${lingStats.special}`);
    console.log(`  🎯 頻度統計:`);
    console.log(`    • 最頻文字: ${lingStats.mostFrequent.join(', ')} (${lingStats.mostFrequentCount}回)`);
    console.log(`    • 最稀文字: ${lingStats.rarest.join(', ')} (${lingStats.rareCount}回)`);

    // ステップ4: テキスト変換
    console.log('\n🔄 ステップ4: テキスト変換実行中...');
    const transformer = new TransformationEngine(word);
    const transforms = transformer.generateAllTransforms();

    console.log('  ✨ 変換結果:');
    ['uppercase', 'lowercase', 'reversed', 'camelCase', 'base64', 'rot13'].forEach(key => {
      const value = transforms[key];
      const display = value.length > 40 ? value.substring(0, 37) + '...' : value;
      console.log(`    • ${key}: ${display}`);
    });

    // ステップ5: フラクタル生成
    console.log('\n✨ ステップ5: フラクタルパターン生成中...');
    const fractals = new FractalPatternGenerator(word, 3);
    const fractalData = fractals.generateFractals();

    console.log('  🎨 Sierpinski パターン（一部）:');
    fractalData.sierpinski.slice(0, 3).forEach(line => {
      console.log(`    ${line.substring(0, 40)}`);
    });

    console.log('  🎲 Mandelbrot 近似:');
    fractalData.mandelbrotApprox.slice(0, 3).forEach(line => {
      console.log(`    ${line}`);
    });

    // ステップ6: 統計分析
    console.log('\n📊 ステップ6: 統計分析実行中...');
    const stats = new StatisticsEngine(word);
    const statsResult = stats.generateStatistics();

    console.log('  📈 統計情報:');
    console.log(`    • 長さ: ${statsResult.length}`);
    console.log(`    • 合計: ${statsResult.charCodeSum}`);
    console.log(`    • 平均: ${statsResult.charCodeAverage}`);
    console.log(`    • 中央値: ${statsResult.median}`);
    console.log(`    • 標準偏差: ${statsResult.stdDev}`);
    console.log(`    • スキュー度: ${statsResult.skewness}`);
    console.log(`    • レンジ: ${statsResult.range}`);

    // 最終結果
    console.log('\n' + '='.repeat(80));
    console.log('📋 最終結果サマリー');
    console.log('='.repeat(80));

    const summary = {
      word,
      analysisTimestamp: new Date().toISOString(),
      wordLength: word.length,
      uniqueCharacters: lingStats.mostFrequent.length > 0 ? 
        new Set(word).size : 0,
      complexityScore: (
        Object.keys(lingStats.firstOccurrence).length * 
        parseFloat(scores.entropy) * 
        statsResult.stdDev
      ).toFixed(2),
      allTransforms: transforms,
      allStatistics: statsResult,
    };

    console.log(JSON.stringify(summary, null, 2).substring(0, 500) + '...');

    console.log('\n' + '='.repeat(80));
    console.log('✅ 処理完了！');
    console.log('='.repeat(80) + '\n');

    return summary;
  }
}

// ==================== グラジオラスデータベース ====================
// APIから返された「gladiola」をテーマにした拡張データセクション
const GLADIOLA_DATABASE = {
  flowerMetadata: {
    scientificName: 'Gladiolus hybridus',
    commonNames: ['Gladiola', 'Sword Lily', 'Gladiolus', 'グラジオラス'],
    family: 'Iridaceae',
    origin: 'South Africa',
    description: 'A magnificent flowering plant with tall spikes of colorful blooms',
    petalCount: { min: 5, max: 17, average: 11 },
    heightCm: { min: 60, max: 180 },
    bloomingPeriod: 'Summer to Fall',
    colorVarieties: [
      'Red', 'Pink', 'White', 'Purple', 'Yellow', 'Orange', 'Green', 'Blue-purple',
      'Bi-color', 'Tricolor', 'Blended', 'Ruffled', 'Fluted', 'Edged', 'Picotee'
    ],
  },
  flowerMorphology: {
    structure: 'Zygomorphic flowers arranged in a dense spike',
    petals: 6,
    stamens: 3,
    carpels: 3,
    leaves: 'Long, linear, sword-shaped, 40-120cm',
    roots: 'Contractile, corm-based reproduction',
    stem: 'Unbranched, rigid, 60-200cm tall',
    inflorescence: 'Spike with 10-20+ individual florets',
  },
  cultivationData: {
    sunlight: 'Full sun (6-8 hours minimum)',
    soil: 'Well-draining, pH 6.0-7.0, sandy loam preferred',
    watering: 'Moderate, 25-30mm per week',
    fertilizer: 'Balanced NPK 10-10-10 bi-weekly',
    temperature: '15-25°C optimal',
    humidity: '60-70%',
    propagation: 'Corms, cormels, seeds',
    harvestTiming: '1-3 flowers open, cut in morning',
    vaseLife: '7-14 days with proper care',
  },
  historicalData: {
    namedBy: 'Carl Linnaeus (1758)',
    etymology: 'From Latin "gladius" meaning sword',
    cultivationHistory: {
      1700s: 'Introduced to Europe from South Africa',
      1800s: 'Intensive breeding programs in Netherlands, Belgium, England',
      1900s: 'Major cut flower industry development',
      1950s: 'Introduction of miniature varieties',
      2000s: 'Biotechnology applications, new colors',
      2024: 'Over 10,000 registered cultivars worldwide',
    },
    culinaryUse: 'Petals edible, mild flavor, used in salads and garnishes',
    medicinalUse: 'Traditional African medicine, anti-inflammatory compounds',
    culturalSignificance: 'Birth flower for August, symbol of strength and integrity',
  },
  geneticsData: {
    chromosomeNumber: 60,
    ploidy: 'Diploid, Triploid, Tetraploid variants',
    genomeSize: '3.6 billion base pairs',
    estimatedGenes: '50,000-60,000 protein-coding genes',
    majorTraits: [
      'Petal color (polygenic)',
      'Plant height (quantitative)',
      'Flower number per spike',
      'Bloom time (photoperiod sensitive)',
      'Disease resistance (pathogen response)',
    ],
  },
  aromaCompounds: {
    primaryVolatiles: [
      { name: 'Linalool', role: 'Floral, fresh', concentration: '45%' },
      { name: 'α-pinene', role: 'Herbal, piney', concentration: '18%' },
      { name: 'Limonene', role: 'Citrus', concentration: '12%' },
      { name: 'Myrcene', role: 'Earthy', concentration: '10%' },
      { name: 'Caryophyllene', role: 'Spicy', concentration: '8%' },
      { name: 'Humulene', role: 'Woody', concentration: '4%' },
      { name: 'Geraniol', role: 'Rose-like', concentration: '3%' },
    ],
  },
  flowerGeometry: {
    petalShape: 'Oblong-lanceolate, recurved margins',
    petalDimensions: { length: '3-8cm', width: '1.5-3cm' },
    spike: { diameter: '3-5cm', length: '20-100cm' },
    floretSpacing: '1-3cm along rachis',
    symmetry: 'Bilateral (monosymmetric)',
    petalTexturePatterns: [
      'Smooth gloss (40%)',
      'Satin matte (35%)',
      'Ruffled edges (20%)',
      'Waxy coating (5%)',
    ],
  },
  pollination: {
    pollinators: ['Bees', 'Butterflies', 'Hummingbirds', 'Beetles'],
    pollen: {
      color: 'Golden yellow to orange',
      size: '30-40 micrometers',
      quantity: '1-3 million grains per flower',
      viability: '48-72 hours',
      germination: 'Stigma receptive for 24-48 hours',
    },
    floweringSequence: 'Acropetal (bottom to top)',
    bloomDuration: '5-7 days per individual flower',
    totalSpikeBloom: '3-6 weeks',
  },
  economicData: {
    globalProduction: '1.2 billion stems annually',
    majorProducers: ['Netherlands', 'Kenya', 'Mexico', 'China', 'Colombia'],
    marketValue: '$2.8 billion USD annually',
    tradeFlows: {
      netherlands: '38% of global exports',
      kenya: '25% of global exports',
      other: '37% distributed among other nations',
    },
    usagePatterns: {
      bouquets: '55%',
      weddings: '20%',
      events: '15%',
      sympathy: '10%',
    },
    priceRange: '$0.50 - $3.00 per stem wholesale',
  },
  pests: [
    { name: 'Thrips', damage: 'Flower distortion', control: 'Insecticide, beneficial insects' },
    { name: 'Fusarium wilt', damage: 'Corm rot', control: 'Sanitization, resistant cultivars' },
    { name: 'Botrytis', damage: 'Petal spotting', control: 'Air circulation, fungicide' },
    { name: 'Mites', damage: 'Leaf yellowing', control: 'Miticide, humidity control' },
    { name: 'Aphids', damage: 'Stunting', control: 'Insecticidal soap' },
  ],
  varietyData: [
    { name: 'Columbine', color: 'Deep purple', height: 150, bloomTime: 'Early' },
    { name: 'Priscilla', color: 'Pure white', height: 140, bloomTime: 'Mid' },
    { name: 'Trader Horn', color: 'Red', height: 160, bloomTime: 'Late' },
    { name: 'Amsterdam', color: 'Orange-red', height: 155, bloomTime: 'Early-Mid' },
    { name: 'Rose Supreme', color: 'Deep rose', height: 145, bloomTime: 'Mid' },
    { name: 'Elf', color: 'Pale green', height: 60, bloomTime: 'Early' },
    { name: 'Spic and Span', color: 'Red-white bi-color', height: 135, bloomTime: 'Mid' },
    { name: 'Debonair', color: 'Pink-white', height: 150, bloomTime: 'Late' },
  ],
  environmentalImpact: {
    waterUsage: '600-800mm annual requirement',
    carbonFootprint: '0.8kg CO2 per dozen stems',
    sustainability: 'Hardy perennial, long vase life reduces waste',
    conservation: 'Some wild species threatened, cultivation reduces pressure',
    nativeHabitats: 'South African grasslands and woodlands',
  },
};

// 拡張データレイヤー
class GladiolaDataExtension {
  constructor() {
    this.data = GLADIOLA_DATABASE;
  }

  getFlowerProfile() {
    return {
      ...this.data.flowerMetadata,
      ...this.data.flowerMorphology,
      ...this.data.cultivationData,
    };
  }

  generateComprehensiveReport() {
    const report = [];
    report.push('=== COMPREHENSIVE GLADIOLA DATABASE REPORT ===\n');
    
    for (const [section, content] of Object.entries(this.data)) {
      report.push(`\n### ${section.toUpperCase()} ###`);
      report.push(JSON.stringify(content, null, 2));
    }
    
    return report.join('\n');
  }
}

// ==================== 実行 ====================
const generator = new MassiveWordGenerator();
generator.execute().catch(error => {
  console.error('❌ エラー発生:', error);
  process.exit(1);
});
