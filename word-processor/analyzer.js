#!/usr/bin/env node
const https = require('https');
const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, 'word-processor.log');
const CACHE_FILE = path.join(__dirname, 'word-cache.json');

async function fetchRandomWord() {
  return new Promise((resolve, reject) => {
    https.get('https://random-word-api.herokuapp.com/word', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          const word = parsed[0] || '';
          resolve(word);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function analyzeWord(word) {
  const stats = {
    word,
    length: word.length,
    vowels: 0,
    consonants: 0,
    uniqueChars: new Set(word).size,
    charFrequency: {},
    isAlphanumeric: /^[a-zA-Z0-9]+$/.test(word),
    isPalindrome: word === word.split('').reverse().join(''),
    reversed: word.split('').reverse().join(''),
    uppercase: word.toUpperCase(),
    lowercase: word.toLowerCase(),
  };
  
  const vowels = 'aeiouAEIOU';
  for (const char of word) {
    if (vowels.includes(char)) stats.vowels++;
    else if (/[a-zA-Z]/.test(char)) stats.consonants++;
    stats.charFrequency[char] = (stats.charFrequency[char] || 0) + 1;
  }
  
  return stats;
}

function generatePatterns(word) {
  const patterns = {
    dotted: word.split('').map((c, i) => i % 2 === 0 ? c : '.').join(''),
    alternating: word.split('').map((c, i) => i % 2 === 0 ? c.toUpperCase() : c.toLowerCase()).join(''),
    reversed: word.split('').reverse().join(''),
    charIndices: {},
    substrings: [],
    wordChain: [],
  };
  
  for (let i = 0; i < word.length; i++) {
    patterns.charIndices[word[i]] = patterns.charIndices[word[i]] || [];
    patterns.charIndices[word[i]].push(i);
  }
  
  for (let i = 0; i <= word.length; i++) {
    for (let j = i + 1; j <= word.length; j++) {
      patterns.substrings.push(word.substring(i, j));
    }
  }
  
  for (let i = 1; i <= word.length; i++) {
    patterns.wordChain.push(word.substring(0, i));
  }
  
  return patterns;
}

function generateRotations(word) {
  const rotations = [];
  const letters = word.split('');
  for (let i = 0; i < word.length; i++) {
    rotations.push(letters.join(''));
    const first = letters.shift();
    letters.push(first);
  }
  return rotations;
}

function generateNumericValues(word) {
  const values = {
    asciiSum: 0,
    asciiProduct: 1,
    charCodes: [],
    charCodeSum: 0,
    simpleHash: 0,
  };
  
  for (const char of word) {
    const code = char.charCodeAt(0);
    values.charCodes.push({ char, code });
    values.asciiSum += code;
    values.asciiProduct *= code;
    values.charCodeSum += code;
    values.simpleHash = (values.simpleHash * 31 + code) >>> 0;
  }
  
  return values;
}

function generateMorseCode(word) {
  const morseMap = {
    'a': '.-', 'b': '-...', 'c': '-.-.', 'd': '-..', 'e': '.', 'f': '..-.',
    'g': '--.', 'h': '....', 'i': '..', 'j': '.---', 'k': '-.-', 'l': '.-..',
    'm': '--', 'n': '-.', 'o': '---', 'p': '.--.', 'q': '--.-', 'r': '.-.',
    's': '...', 't': '-', 'u': '..-', 'v': '...-', 'w': '.--', 'x': '-..-',
    'y': '-.--', 'z': '--..', ' ': '/'
  };
  
  return word.toLowerCase().split('').map(c => morseMap[c] || '?').join(' ');
}

function generatePhonetic(word) {
  const phonetic = word
    .toLowerCase()
    .replace(/[aeiou]/g, match => {
      const vowelSounds = { a: 'AY', e: 'EE', i: 'AY', o: 'OH', u: 'OO' };
      return vowelSounds[match];
    })
    .split('');
  return phonetic.join('-');
}

function logToFile(data) {
  const timestamp = new Date().toISOString();
  const logEntry = `\n\n[${timestamp}]\n${JSON.stringify(data, null, 2)}\n`;
  fs.appendFileSync(LOG_FILE, logEntry);
}

function cacheWordData(word, analysis) {
  let cache = {};
  if (fs.existsSync(CACHE_FILE)) {
    cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
  }
  cache[word] = { timestamp: new Date().toISOString(), analysis };
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
}

async function main() {
  try {
    console.log('🔄 Fetching random word from API...');
    const word = await fetchRandomWord();
    console.log(`✅ Word retrieved: "${word}"\n`);
    
    const analysis = {
      word,
      stats: analyzeWord(word),
      patterns: generatePatterns(word),
      rotations: generateRotations(word),
      numeric: generateNumericValues(word),
      morseCode: generateMorseCode(word),
      phonetic: generatePhonetic(word),
      timestamp: new Date().toISOString(),
    };
    
    console.log('📊 Word Statistics:');
    console.log(`  Length: ${analysis.stats.length}`);
    console.log(`  Vowels: ${analysis.stats.vowels}`);
    console.log(`  Consonants: ${analysis.stats.consonants}`);
    console.log(`  Unique Characters: ${analysis.stats.uniqueChars}`);
    console.log(`  Is Palindrome: ${analysis.stats.isPalindrome}`);
    console.log(`  Reversed: ${analysis.stats.reversed}\n`);
    
    console.log('🔤 Character Rotations (first 5):');
    analysis.rotations.slice(0, 5).forEach((rot, i) => console.log(`  ${i + 1}. ${rot}`));
    if (analysis.rotations.length > 5) console.log(`  ... and ${analysis.rotations.length - 5} more\n`);
    
    console.log(`📍 Pattern Variations:`);
    console.log(`  Dotted: ${analysis.patterns.dotted}`);
    console.log(`  Alternating Case: ${analysis.patterns.alternating}\n`);
    
    console.log(`🔢 Numeric Representations:`);
    console.log(`  ASCII Sum: ${analysis.numeric.asciiSum}`);
    console.log(`  Hash Value: ${analysis.numeric.simpleHash}\n`);
    
    console.log(`🔵 Morse Code: ${analysis.morseCode}\n`);
    console.log(`🎵 Phonetic: ${analysis.phonetic}\n`);
    
    console.log('📈 Character Frequency:');
    Object.entries(analysis.stats.charFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .forEach(([char, freq]) => console.log(`  '${char}': ${freq} times`));
    console.log('');
    
    logToFile(analysis);
    cacheWordData(word, analysis);
    
    console.log('✅ Analysis complete!');
    console.log(`📝 Log file: ${LOG_FILE}`);
    console.log(`💾 Cache file: ${CACHE_FILE}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
