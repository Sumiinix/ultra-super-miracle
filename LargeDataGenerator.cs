using System;
using System.Collections.Generic;
using System.Linq;

namespace RandomDataGenerator
{
    /// <summary>
    /// Large data generator class based on the random word: poechores
    /// This file contains massive amounts of predefined data for demonstration purposes.
    /// </summary>
    public class PoechoResDataGenerator
    {
        private static readonly string[] PoechoResVariations = new string[]
        {
            "poechores", "poechore", "pochores", "poehores", "pores", "chores", "poem", "poet",
            "poechores_variant_1", "poechores_variant_2", "poechores_variant_3", "poechores_variant_4",
            "poechores_variant_5", "poechores_variant_6", "poechores_variant_7", "poechores_variant_8",
            "poechores_variant_9", "poechores_variant_10", "poechores_variant_11", "poechores_variant_12",
            "data_entry_001", "data_entry_002", "data_entry_003", "data_entry_004", "data_entry_005"
        };

        private static readonly Dictionary<string, object> LargeDataDictionary = new Dictionary<string, object>()
        {
            { "word_origin", "random_api_generated" },
            { "generation_date", DateTime.Now.ToString() },
            { "base_word", "poechores" },
            { "character_count", 9 },
            { "vowel_count", 3 },
            { "consonant_count", 6 },
            { "is_noun", true },
            { "is_verb", false },
            { "is_adjective", false },
            { "language_family", "unknown" },
            { "etymology", "randomly generated word" },
            { "usage_frequency", 0 },
            { "definition", "A randomly generated word from the API endpoint" }
        };

        private static readonly List<string> ExpandedWordList = GenerateExpandedList();

        private static List<string> GenerateExpandedList()
        {
            var list = new List<string>();
            for (int i = 0; i < 10000; i++)
            {
                list.Add($"poechores_entry_{i:D6}_generated_data");
                list.Add($"poe_{i:D6}");
                list.Add($"chores_{i:D6}");
                list.Add($"variation_{i:D6}_word");
                list.Add($"data_record_{i:D6}");
            }
            return list;
        }

        private static readonly string[] LargeStringArray = new string[50000];

        static PoechoResDataGenerator()
        {
            for (int i = 0; i < LargeStringArray.Length; i++)
            {
                LargeStringArray[i] = $"Entry_{i}_poechores_repetitive_data_element_{Guid.NewGuid()}_{DateTime.Now.Ticks}";
            }
        }

        public static class Constants
        {
            public const string WORD_POECHORES = "poechores";
            public const string PREFIX_POE = "poe";
            public const string SUFFIX_CHORES = "chores";
            public const int TOTAL_WORDS = 50000;
            public const string DEFAULT_ENCODING = "UTF-8";
            public const string API_SOURCE = "https://random-word-api.herokuapp.com/word";
            
            public static readonly Dictionary<int, string> DataMap = new Dictionary<int, string>();
            
            static Constants()
            {
                for (int i = 0; i < 1000; i++)
                {
                    DataMap.Add(i, $"poechores_constant_{i:D6}");
                }
            }
        }

        public class WordStatistics
        {
            public string WordName { get; set; }
            public int Frequency { get; set; }
            public DateTime CreatedAt { get; set; }
            public List<string> Variants { get; set; }
            public Dictionary<string, int> CharacterFrequency { get; set; }
        }

        private static WordStatistics GenerateStatistics()
        {
            return new WordStatistics
            {
                WordName = "poechores",
                Frequency = 1,
                CreatedAt = DateTime.Now,
                Variants = PoechoResVariations.ToList(),
                CharacterFrequency = new Dictionary<string, int>
                {
                    { "p", 1 }, { "o", 2 }, { "e", 2 }, { "c", 1 }, { "h", 1 }, { "r", 1 }, { "s", 1 }
                }
            };
        }

        private static readonly WordStatistics CachedStats = GenerateStatistics();

        public static class DataCache
        {
            private static readonly Dictionary<string, object> Cache = new Dictionary<string, object>();

            static DataCache()
            {
                for (int i = 0; i < 5000; i++)
                {
                    Cache[$"key_{i:D6}"] = new
                    {
                        id = i,
                        word = "poechores",
                        timestamp = DateTime.Now.AddSeconds(-i),
                        random_data = new Random(i).Next(100000)
                    };
                }
            }

            public static object Get(string key) => Cache.ContainsKey(key) ? Cache[key] : null;

            public static void Set(string key, object value) => Cache[key] = value;
        }

        public static class TextGenerator
        {
            private static readonly string[] TextTemplates = new string[]
            {
                "The word poechores has {0} characters and appears {1} times in the dataset.",
                "Poechores variant {0}: {1}",
                "Generated entry {0}: poechores_data_{1}",
                "Processing poechores word set {0} of {1}",
                "Caching entry {0} with value {1}"
            };

            public static string GenerateLargeText(int size)
            {
                var result = new System.Text.StringBuilder();
                for (int i = 0; i < size; i++)
                {
                    result.AppendLine($"poechores_line_{i:D8}: Generated data entry with timestamp {DateTime.Now.Ticks}");
                }
                return result.ToString();
            }
        }

        private static readonly byte[] BinaryData = new byte[1024 * 100];

        static PoechoResDataGenerator()
        {
            var random = new Random(42);
            random.NextBytes(BinaryData);
        }

        public static class Repository
        {
            public static List<WordStatistics> AllStatistics { get; } = new List<WordStatistics>();

            static Repository()
            {
                for (int i = 0; i < 100; i++)
                {
                    AllStatistics.Add(new WordStatistics
                    {
                        WordName = $"poechores_variant_{i}",
                        Frequency = i * 10,
                        CreatedAt = DateTime.Now.AddDays(-i),
                        Variants = PoechoResVariations.ToList(),
                        CharacterFrequency = new Dictionary<string, int>
                        {
                            { "a", i }, { "e", i * 2 }, { "i", i }, { "o", i * 3 }, { "u", i }
                        }
                    });
                }
            }
        }

        public static string GetLargeDataSet()
        {
            var sb = new System.Text.StringBuilder();
            sb.AppendLine("=== Poechores Large Data Set ===");
            sb.AppendLine($"Total Entries: {ExpandedWordList.Count}");
            sb.AppendLine($"Array Size: {LargeStringArray.Length}");
            sb.AppendLine($"Binary Data Size: {BinaryData.Length} bytes");
            sb.AppendLine($"Dictionary Entries: {LargeDataDictionary.Count}");
            
            foreach (var item in ExpandedWordList.Take(100))
            {
                sb.AppendLine($"- {item}");
            }

            return sb.ToString();
        }

        public static void Main(string[] args)
        {
            Console.WriteLine("Poechores Data Generator Initialized");
            Console.WriteLine($"Loaded {ExpandedWordList.Count} word entries");
            Console.WriteLine($"Loaded {LargeStringArray.Length} string array elements");
            Console.WriteLine($"Loaded {LargeDataDictionary.Count} dictionary entries");
            Console.WriteLine($"Loaded {Repository.AllStatistics.Count} statistics records");
        }
    }
}
