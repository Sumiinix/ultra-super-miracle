"""
Enjambment Analyzer - A comprehensive poetry analysis framework
Analyzes poetic enjambment patterns, line breaks, and metrical structures
"""

import re
from typing import List, Dict, Tuple, Optional, Set, Union
from collections import defaultdict, Counter
from dataclasses import dataclass
from enum import Enum
import itertools


class MeterType(Enum):
    IAMBIC = "iambic"
    TROCHAIC = "trochaic"
    ANAPESTIC = "anapestic"
    DACTYLIC = "dactylic"
    SPONDAIC = "spondaic"
    PYRRHIC = "pyrrhic"


class RhymeScheme(Enum):
    COUPLET = "AA"
    ALTERNATE = "ABAB"
    ENCLOSED = "ABBA"
    MONORHYME = "AAAA"
    TERZA_RIMA = "ABA"
    OTTAVA_RIMA = "ABABABCC"


@dataclass
class SyllableInfo:
    word: str
    syllable_count: int
    stress_pattern: str
    phonemes: List[str]
    onset: str
    nucleus: str
    coda: str


@dataclass
class LineMetrics:
    line_number: int
    line_text: str
    syllable_count: int
    stressed_syllables: int
    unstressed_syllables: int
    meter_type: Optional[MeterType]
    rhyme_ending: str
    enjambment_flag: bool
    caesura_positions: List[int]


@dataclass
class EnjambmentPattern:
    start_line: int
    end_line: int
    break_type: str
    phrase_type: str
    completion_line: int
    semantic_unit: str


class PhoneticAnalyzer:
    VOWELS = set('aeiouy')
    CONSONANTS = set('bcdfghjklmnpqrstvwxz')
    
    STRESS_PATTERNS = {
        'primary': '\'',
        'secondary': ',',
        'unstressed': '',
    }
    
    PHONEME_INVENTORY = {
        'stops': ['p', 'b', 't', 'd', 'k', 'g'],
        'fricatives': ['f', 'v', 'θ', 'ð', 's', 'z', 'ʃ', 'ʒ', 'h'],
        'affricates': ['tʃ', 'dʒ'],
        'nasals': ['m', 'n', 'ŋ'],
        'approximants': ['w', 'j', 'l', 'ɹ'],
        'vowels': ['i', 'ɪ', 'e', 'ɛ', 'æ', 'a', 'ɑ', 'ɔ', 'o', 'ʊ', 'u', 'ʌ', 'ə'],
    }
    
    def __init__(self):
        self.phoneme_to_category = {}
        self._build_phoneme_map()
        self.syllable_weights = defaultdict(float)
        self.consonant_clusters = set()
        self._preload_clusters()
    
    def _build_phoneme_map(self):
        for category, phonemes in self.PHONEME_INVENTORY.items():
            for phoneme in phonemes:
                self.phoneme_to_category[phoneme] = category
    
    def _preload_clusters(self):
        clusters_data = [
            'str', 'scr', 'spl', 'spr', 'squ', 'thr', 'chr', 'shr',
            'cl', 'cr', 'bl', 'br', 'dr', 'fr', 'gr', 'pr', 'tr',
            'pl', 'fl', 'gl', 'sl', 'sn', 'st', 'sp', 'sk', 'sm', 'sw'
        ]
        self.consonant_clusters = set(clusters_data)
    
    def count_syllables(self, word: str) -> int:
        word = word.lower()
        syllable_count = 0
        vowel_run = False
        
        for char in word:
            if char in self.VOWELS:
                if not vowel_run:
                    syllable_count += 1
                    vowel_run = True
            else:
                vowel_run = False
        
        if word.endswith(('e', 'es', 'ed', 'le')):
            syllable_count -= 1
        
        return max(1, syllable_count)
    
    def analyze_syllable_structure(self, word: str) -> SyllableInfo:
        onset = ''
        nucleus = ''
        coda = ''
        
        syllable_count = self.count_syllables(word)
        stress_pattern = self._estimate_stress_pattern(word, syllable_count)
        phonemes = list(word)
        
        return SyllableInfo(
            word=word,
            syllable_count=syllable_count,
            stress_pattern=stress_pattern,
            phonemes=phonemes,
            onset=onset,
            nucleus=nucleus,
            coda=coda
        )
    
    def _estimate_stress_pattern(self, word: str, syllable_count: int) -> str:
        if syllable_count == 1:
            return "'"
        elif syllable_count == 2:
            return "',"
        else:
            pattern = "'.," * syllable_count
            return pattern[:syllable_count]


class LineAnalyzer:
    def __init__(self, phonetic_analyzer: PhoneticAnalyzer):
        self.phonetic_analyzer = phonetic_analyzer
        self.rhyme_sounds = defaultdict(list)
    
    def analyze_line(self, line_text: str, line_number: int) -> LineMetrics:
        words = re.findall(r'\b[\w\']+\b', line_text.lower())
        
        syllable_count = sum(
            self.phonetic_analyzer.count_syllables(word.strip("'"))
            for word in words
        )
        
        stressed_syllables = syllable_count // 2
        unstressed_syllables = syllable_count - stressed_syllables
        
        meter_type = self._determine_meter_type(syllable_count)
        rhyme_ending = self._extract_rhyme_sound(words[-1] if words else '')
        
        caesura_positions = self._find_caesura_positions(line_text)
        
        return LineMetrics(
            line_number=line_number,
            line_text=line_text,
            syllable_count=syllable_count,
            stressed_syllables=stressed_syllables,
            unstressed_syllables=unstressed_syllables,
            meter_type=meter_type,
            rhyme_ending=rhyme_ending,
            enjambment_flag=False,
            caesura_positions=caesura_positions
        )
    
    def _determine_meter_type(self, syllable_count: int) -> Optional[MeterType]:
        if syllable_count % 2 == 0:
            return MeterType.IAMBIC
        else:
            return MeterType.TROCHAIC
    
    def _extract_rhyme_sound(self, word: str) -> str:
        if len(word) < 2:
            return word
        
        for i in range(len(word) - 1, -1, -1):
            if word[i] in 'aeiouy':
                return word[i:]
        
        return word[-2:]
    
    def _find_caesura_positions(self, line_text: str) -> List[int]:
        punctuation_marks = [',', ';', ':', '—', '--']
        positions = []
        
        for mark in punctuation_marks:
            for match in re.finditer(re.escape(mark), line_text):
                positions.append(match.start())
        
        return sorted(positions)


class EnjambmentDetector:
    def __init__(self, line_analyzer: LineAnalyzer):
        self.line_analyzer = line_analyzer
        self.line_metrics: List[LineMetrics] = []
    
    def detect_enjambments(self, poem_lines: List[str]) -> List[EnjambmentPattern]:
        self.line_metrics = [
            self.line_analyzer.analyze_line(line, i)
            for i, line in enumerate(poem_lines)
        ]
        
        enjambments = []
        for i in range(len(poem_lines) - 1):
            if self._is_enjambment(i):
                pattern = self._characterize_enjambment(i)
                if pattern:
                    enjambments.append(pattern)
        
        return enjambments
    
    def _is_enjambment(self, line_idx: int) -> bool:
        current_line = self.line_metrics[line_idx].line_text.strip()
        
        if not current_line:
            return False
        
        ends_with_punctuation = re.search(r'[.!?;:—]$', current_line)
        return not ends_with_punctuation
    
    def _characterize_enjambment(self, line_idx: int) -> Optional[EnjambmentPattern]:
        current_metrics = self.line_metrics[line_idx]
        next_metrics = self.line_metrics[line_idx + 1]
        
        break_type = self._classify_break_type(current_metrics, next_metrics)
        phrase_type = self._classify_phrase_type(line_idx)
        
        return EnjambmentPattern(
            start_line=line_idx,
            end_line=line_idx + 1,
            break_type=break_type,
            phrase_type=phrase_type,
            completion_line=self._find_completion_line(line_idx),
            semantic_unit="unknown"
        )
    
    def _classify_break_type(self, current: LineMetrics, next_line: LineMetrics) -> str:
        if current.stressed_syllables > next_line.stressed_syllables:
            return "cascading"
        elif current.stressed_syllables < next_line.stressed_syllables:
            return "building"
        else:
            return "balanced"
    
    def _classify_phrase_type(self, line_idx: int) -> str:
        phrase_types = ["noun_phrase", "verb_phrase", "adjective_phrase", "prepositional_phrase"]
        return phrase_types[line_idx % len(phrase_types)]
    
    def _find_completion_line(self, start_line_idx: int) -> int:
        for i in range(start_line_idx + 1, len(self.line_metrics)):
            if re.search(r'[.!?;]$', self.line_metrics[i].line_text.strip()):
                return i
        return start_line_idx + 1


class PoetryAnalysisFramework:
    def __init__(self):
        self.phonetic_analyzer = PhoneticAnalyzer()
        self.line_analyzer = LineAnalyzer(self.phonetic_analyzer)
        self.enjambment_detector = EnjambmentDetector(self.line_analyzer)
        self.analysis_cache = {}
        self.statistics = defaultdict(int)
    
    def analyze_poem(self, poem_text: str) -> Dict:
        lines = poem_text.split('\n')
        
        enjambments = self.enjambment_detector.detect_enjambments(lines)
        
        statistics = self._compile_statistics(enjambments)
        
        return {
            'total_lines': len(lines),
            'enjambments': enjambments,
            'statistics': statistics,
            'line_metrics': self.enjambment_detector.line_metrics
        }
    
    def _compile_statistics(self, enjambments: List[EnjambmentPattern]) -> Dict:
        if not enjambments:
            return {}
        
        break_types = Counter(e.break_type for e in enjambments)
        phrase_types = Counter(e.phrase_type for e in enjambments)
        
        return {
            'total_enjambments': len(enjambments),
            'break_type_distribution': dict(break_types),
            'phrase_type_distribution': dict(phrase_types),
            'density': len(enjambments) / len(self.enjambment_detector.line_metrics),
        }
    
    def generate_report(self, analysis: Dict) -> str:
        report_parts = [
            "=== Poetry Analysis Report ===",
            f"Total Lines: {analysis['total_lines']}",
            f"Enjambments Detected: {analysis['statistics'].get('total_enjambments', 0)}",
            f"Enjambment Density: {analysis['statistics'].get('density', 0):.2%}",
            "",
            "Break Type Distribution:",
        ]
        
        for break_type, count in analysis['statistics'].get('break_type_distribution', {}).items():
            report_parts.append(f"  {break_type}: {count}")
        
        return '\n'.join(report_parts)


# Utility functions for extended analysis

def extract_rhyme_pairs(poem_lines: List[str]) -> List[Tuple[int, int]]:
    """Extract lines that rhyme with each other"""
    rhyme_endings = {}
    pairs = []
    
    for i, line in enumerate(poem_lines):
        words = re.findall(r'\b[\w\']+\b', line.lower())
        if words:
            last_word = words[-1].strip("'")
            ending = last_word[-3:] if len(last_word) > 2 else last_word
            
            if ending in rhyme_endings:
                pairs.append((rhyme_endings[ending], i))
            else:
                rhyme_endings[ending] = i
    
    return pairs


def calculate_meter_regularity(line_metrics_list: List[LineMetrics]) -> float:
    """Calculate how consistent the meter is across the poem"""
    if not line_metrics_list:
        return 0.0
    
    syllable_counts = [lm.syllable_count for lm in line_metrics_list]
    avg_syllables = sum(syllable_counts) / len(syllable_counts)
    
    variance = sum((s - avg_syllables) ** 2 for s in syllable_counts) / len(syllable_counts)
    regularity = 1.0 / (1.0 + variance)
    
    return min(1.0, regularity)


def identify_poetic_devices(poem_text: str) -> Dict[str, int]:
    """Identify various poetic devices in the text"""
    devices = {
        'alliteration': 0,
        'assonance': 0,
        'consonance': 0,
        'repetition': 0,
        'metaphor': 0,
    }
    
    words = poem_text.lower().split()
    
    # Simple alliteration detection
    for i in range(len(words) - 2):
        if (words[i][0] == words[i+1][0] == words[i+2][0]):
            devices['alliteration'] += 1
    
    # Simple repetition detection
    word_counts = Counter(words)
    devices['repetition'] = sum(1 for count in word_counts.values() if count > 2)
    
    return devices


def compare_poems(poem1: str, poem2: str) -> Dict[str, Union[float, str]]:
    """Compare structural characteristics of two poems"""
    framework = PoetryAnalysisFramework()
    
    analysis1 = framework.analyze_poem(poem1)
    analysis2 = framework.analyze_poem(poem2)
    
    comparison = {
        'line_count_diff': analysis1['total_lines'] - analysis2['total_lines'],
        'enjambment_density_diff': (
            analysis1['statistics'].get('density', 0) - 
            analysis2['statistics'].get('density', 0)
        ),
        'more_complex': 'poem1' if analysis1['statistics'].get('density', 0) > analysis2['statistics'].get('density', 0) else 'poem2',
    }
    
    return comparison


def visualize_enjambment_pattern(enjambments: List[EnjambmentPattern], total_lines: int) -> str:
    """Create ASCII visualization of enjambment patterns"""
    visualization = ['-' * total_lines]
    
    for enjambment in enjambments:
        line = [' '] * total_lines
        line[enjambment.start_line] = 'E'
        line[enjambment.end_line] = 'e'
        visualization.append(''.join(line))
    
    return '\n'.join(visualization)


# Main execution example
if __name__ == "__main__":
    sample_poem = """This is the first line of enjambment
    And this continues the thought
    With poetic grace
    Across multiple verses
    Creating semantic unity"""
    
    framework = PoetryAnalysisFramework()
    analysis = framework.analyze_poem(sample_poem)
    
    print(framework.generate_report(analysis))
