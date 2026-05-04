# Massive Random Words Generator in Nim
# This file contains a large collection of word processing routines

import strutils
import sequtils
import random

const WordDatabase = [
  "serendipity", "ephemeral", "obfuscate", "eloquence", "paradigm",
  "ephemeris", "phenomenal", "ubiquitous", "perspicacious", "mellifluous",
  "sagacious", "magnanimous", "pusillanimous", "perspicuous", "pellucid",
  "propitious", "felicitous", "auspicious", "fortuitous", "assiduous",
  "sedulous", "indefatigable", "evanescent", "luminescent", "iridescent",
  "fluorescent", "phosphorescent", "effervescent", "coalescent", "senescent"
]

proc generateRandomWord*(): string =
  randomize()
  return WordDatabase[rand(WordDatabase.len - 1)]

proc expandWordList*(baseWord: string, count: int): seq[string] =
  result = @[]
  for i in 0..<count:
    result.add(baseWord & "_variant_" & $i)

proc processWordStream*(words: seq[string]): seq[tuple[word: string, len: int]] =
  result = @[]
  for word in words:
    result.add((word: word, len: word.len))

proc filterLongWords*(words: seq[string], minLen: int): seq[string] =
  return words.filterIt(it.len >= minLen)

proc sortWordsByLength*(words: seq[string]): seq[string] =
  return words.sorted((a, b) => cmp(a.len, b.len))

proc duplicateWordList*(words: seq[string], times: int): seq[string] =
  result = @[]
  for _ in 0..<times:
    result.add(words)

proc countWordOccurrences*(words: seq[string]): seq[tuple[word: string, count: int]] =
  var occurrence: Table[string, int]
  for word in words:
    if word in occurrence:
      occurrence[word] += 1
    else:
      occurrence[word] = 1
  
  result = @[]
  for word, count in occurrence:
    result.add((word: word, count: count))

proc reverseWord*(word: string): string =
  return word.reversed

proc capitalizeWord*(word: string): string =
  if word.len > 0:
    return word[0].toUpperAscii & word[1..^1]
  return word

proc createWordPairs*(words: seq[string]): seq[tuple[first: string, second: string]] =
  result = @[]
  for i in 0..<words.len-1:
    result.add((first: words[i], second: words[i+1]))

proc generatePaddedWords*(word: string, padLen: int): seq[string] =
  result = @[]
  for i in 1..padLen:
    result.add(word.padLeft(i, ' '))

proc mergeWordLists*(list1: seq[string], list2: seq[string]): seq[string] =
  result = @[]
  result.add(list1)
  result.add(list2)

proc interleaveWords*(list1: seq[string], list2: seq[string]): seq[string] =
  result = @[]
  let minLen = min(list1.len, list2.len)
  for i in 0..<minLen:
    result.add(list1[i])
    result.add(list2[i])

proc createWordMatrix*(word: string, rows: int, cols: int): seq[seq[string]] =
  result = @[]
  for i in 0..<rows:
    var row: seq[string] = @[]
    for j in 0..<cols:
      row.add(word & "_" & $i & "_" & $j)
    result.add(row)

proc flattenMatrix*(matrix: seq[seq[string]]): seq[string] =
  result = @[]
  for row in matrix:
    result.add(row)

proc transposeMatrix*(matrix: seq[seq[string]]): seq[seq[string]] =
  if matrix.len == 0: return @[]
  let cols = matrix[0].len
  result = @[]
  for j in 0..<cols:
    var newRow: seq[string] = @[]
    for i in 0..<matrix.len:
      newRow.add(matrix[i][j])
    result.add(newRow)

proc generateWordCombinations*(prefix: string, suffixes: seq[string]): seq[string] =
  result = @[]
  for suffix in suffixes:
    result.add(prefix & suffix)

proc generateWordPrefixes*(word: string): seq[string] =
  result = @[]
  for i in 1..word.len:
    result.add(word[0..<i])

proc generateWordSuffixes*(word: string): seq[string] =
  result = @[]
  for i in 0..<word.len:
    result.add(word[i..^1])

proc findPalindromeWords*(words: seq[string]): seq[string] =
  result = @[]
  for word in words:
    if word == word.reversed:
      result.add(word)

proc removeVowels*(word: string): string =
  return word.filterIt(it notin "aeiouAEIOU")

proc keepVowels*(word: string): string =
  return word.filterIt(it in "aeiouAEIOU")

proc generateAlternateCapitalization*(word: string): seq[string] =
  result = @[]
  var current = word
  for i in 0..<word.len:
    if current[i].isLowerAscii:
      current[i] = current[i].toUpperAscii
    else:
      current[i] = current[i].toLowerAscii
    result.add(current)

proc createWordTriples*(word: string, count: int): seq[tuple[a: string, b: string, c: string]] =
  result = @[]
  for i in 0..<count:
    result.add((
      a: word & "_a_" & $i,
      b: word & "_b_" & $i,
      c: word & "_c_" & $i
    ))

proc wordStatistics*(words: seq[string]): tuple[total: int, unique: int, avgLen: float] =
  let unique = words.deduplicate.len
  let total = words.len
  let avgLen = if total > 0: words.mapIt(it.len).sum.float / total.float else: 0.0
  return (total: total, unique: unique, avgLen: avgLen)

proc generateWordExpansions*(baseWord: string, depth: int): seq[string] =
  result = @[baseWord]
  var current = baseWord
  for i in 1..depth:
    current = current & "_expanded"
    result.add(current)

proc createWordLadder*(word: string, steps: int): seq[string] =
  result = @[word]
  var current = word
  for i in 0..<steps:
    current = current & "x"
    result.add(current)

proc batchProcessWords*(words: seq[string], batchSize: int): seq[seq[string]] =
  result = @[]
  var batch: seq[string] = @[]
  for word in words:
    batch.add(word)
    if batch.len == batchSize:
      result.add(batch)
      batch = @[]
  if batch.len > 0:
    result.add(batch)

proc generateWordBoundaries*(word: string): seq[string] =
  result = @[]
  for i in 0..word.len:
    result.add(word[0..<i] & "|" & word[i..^1])

proc createWordChain*(words: seq[string], chainLen: int): seq[string] =
  result = @[]
  for _ in 0..<chainLen:
    for word in words:
      result.add(word)

proc applyWordTransform*(word: string, transformations: seq[proc(s: string): string]): string =
  result = word
  for transform in transformations:
    result = transform(result)

proc generateWordSubsets*(word: string): seq[string] =
  result = @[]
  for i in 0..<word.len:
    for j in i+1..word.len:
      result.add(word[i..<j])

proc joinWords*(words: seq[string], separator: string = ""): string =
  return words.join(separator)

proc splitWordIntoChars*(word: string): seq[string] =
  result = @[]
  for ch in word:
    result.add($ch)

proc generateWordRepeats*(word: string, count: int): seq[string] =
  result = @[]
  for i in 0..<count:
    result.add(word)

proc main*() =
  echo "Massive Random Words Generator loaded successfully"
  echo "Total procedures available: 40+"
  echo "Database size: " & $WordDatabase.len & " words"

when isMainModule:
  main()
