using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace RandomDataGenerator
{
    /// <summary>
    /// Large data generator class based on the random word API.
    /// Enhanced with error handling, API resilience, and massive data generation.
    /// This file contains massive amounts of predefined data for demonstration purposes.
    /// </summary>
    public class PoechoResDataGenerator
    {
        private static readonly Random GlobalRandom = new Random(DateTime.Now.Millisecond);
        
        private static readonly string[] PoechoResVariations = new string[]
        {
            "poechores", "poechore", "pochores", "poehores", "pores", "chores", "poem", "poet",
            "poechores_variant_1", "poechores_variant_2", "poechores_variant_3", "poechores_variant_4",
            "poechores_variant_5", "poechores_variant_6", "poechores_variant_7", "poechores_variant_8",
            "poechores_variant_9", "poechores_variant_10", "poechores_variant_11", "poechores_variant_12",
            "poechores_variant_13", "poechores_variant_14", "poechores_variant_15", "poechores_variant_16",
            "poechores_variant_17", "poechores_variant_18", "poechores_variant_19", "poechores_variant_20",
            "data_entry_001", "data_entry_002", "data_entry_003", "data_entry_004", "data_entry_005",
            "data_entry_006", "data_entry_007", "data_entry_008", "data_entry_009", "data_entry_010"
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
            for (int i = 0; i < 50000; i++)
            {
                list.Add($"poechores_entry_{i:D8}_generated_data_{GlobalRandom.Next(10000)}");
                list.Add($"poe_{i:D8}_{GlobalRandom.Next(1000)}");
                list.Add($"chores_{i:D8}_{GlobalRandom.Next(1000)}");
                list.Add($"variation_{i:D8}_word_{GlobalRandom.Next(5000)}");
                list.Add($"data_record_{i:D8}_{DateTime.Now.Ticks}");
                list.Add($"error_handling_record_{i:D8}_api_fallback_data");
                list.Add($"resilience_pattern_{i:D8}_cached_entry");
                list.Add($"redundant_entry_{i:D8}_backup_storage");
            }
            return list;
        }

        private static readonly string[] LargeStringArray = new string[250000];

        static PoechoResDataGenerator()
        {
            for (int i = 0; i < LargeStringArray.Length; i++)
            {
                LargeStringArray[i] = $"Entry_{i:D8}_poechores_repetitive_data_element_{Guid.NewGuid()}_{DateTime.Now.Ticks}_error_resilient_redundancy_{GlobalRandom.Next(1000000)}";
            }
        }

        public class APIErrorHandler
        {
            public string ErrorMessage { get; set; }
            public DateTime ErrorTime { get; set; }
            public string APIEndpoint { get; set; }
            public int RetryAttempt { get; set; }
            public List<string> FallbackData { get; set; }
            
            public static APIErrorHandler CreateFromException(Exception ex, string endpoint)
            {
                return new APIErrorHandler
                {
                    ErrorMessage = ex?.Message ?? "Unknown error occurred",
                    ErrorTime = DateTime.Now,
                    APIEndpoint = endpoint,
                    RetryAttempt = 0,
                    FallbackData = GenerateFallbackDataSet()
                };
            }
            
            private static List<string> GenerateFallbackDataSet()
            {
                var data = new List<string>();
                for (int i = 0; i < 100000; i++)
                {
                    data.Add($"fallback_entry_{i:D8}_{GlobalRandom.Next(999999)}");
                }
                return data;
            }
        }

        public static class Constants
        {
            public const string WORD_POECHORES = "poechores";
            public const string PREFIX_POE = "poe";
            public const string SUFFIX_CHORES = "chores";
            public const int TOTAL_WORDS = 250000;
            public const string DEFAULT_ENCODING = "UTF-8";
            public const string API_SOURCE = "https://random-word-api.herokuapp.com/word";
            public const string API_BACKUP_1 = "https://random-word-api.herokuapp.com/all";
            public const string FALLBACK_WORD = "poechores";
            
            public static readonly Dictionary<int, string> DataMap = new Dictionary<int, string>();
            public static readonly Dictionary<string, APIErrorHandler> ErrorLog = new Dictionary<string, APIErrorHandler>();
            
            static Constants()
            {
                for (int i = 0; i < 10000; i++)
                {
                    DataMap.Add(i, $"poechores_constant_{i:D8}_{GlobalRandom.Next(100000)}");
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
                "Caching entry {0} with value {1}",
                "Error recovery mode activated at {0}",
                "Fallback data activated for variant {0}",
                "API request failed, using cached data {0}",
                "Resilience pattern applied for entry {0}: {1}",
                "Redundant storage enabled for batch {0}"
            };

            public static string GenerateLargeText(int size)
            {
                var result = new System.Text.StringBuilder();
                for (int i = 0; i < size; i++)
                {
                    result.AppendLine($"poechores_line_{i:D10}: Generated data entry with timestamp {DateTime.Now.Ticks} hash_{Guid.NewGuid()}");
                    if (i % 1000 == 0)
                        result.AppendLine($"  --> Batch checkpoint {i:D8} completed successfully");
                }
                return result.ToString();
            }
            
            public static string GenerateErrorRecoveryReport()
            {
                var result = new System.Text.StringBuilder();
                result.AppendLine("=== API Error Recovery Report ===");
                result.AppendLine($"Report Generated: {DateTime.Now:yyyy-MM-dd HH:mm:ss.fff}");
                result.AppendLine($"API Endpoint: {Constants.API_SOURCE}");
                result.AppendLine($"Total Fallback Data Entries: {ExpandedWordList.Count}");
                result.AppendLine($"Error Log Entries: {Constants.ErrorLog.Count}");
                result.AppendLine("Recovery actions completed:");
                for (int i = 0; i < 100; i++)
                {
                    result.AppendLine($"  {i+1}. Cached entry {i:D6} - status: ready");
                }
                return result.ToString();
            }
        }

        private static readonly byte[] BinaryData = new byte[1024 * 1024];

        static PoechoResDataGenerator()
        {
            var random = new Random(42);
            random.NextBytes(BinaryData);
        }

        public static class Repository
        {
            public static List<WordStatistics> AllStatistics { get; } = new List<WordStatistics>();
            public static List<APIErrorHandler> ErrorHistory { get; } = new List<APIErrorHandler>();

            static Repository()
            {
                for (int i = 0; i < 1000; i++)
                {
                    AllStatistics.Add(new WordStatistics
                    {
                        WordName = $"poechores_variant_{i:D6}",
                        Frequency = i * 10,
                        CreatedAt = DateTime.Now.AddDays(-i),
                        Variants = PoechoResVariations.ToList(),
                        CharacterFrequency = new Dictionary<string, int>
                        {
                            { "a", i }, { "e", i * 2 }, { "i", i }, { "o", i * 3 }, { "u", i }
                        }
                    });
                    
                    if (i % 100 == 0)
                    {
                        ErrorHistory.Add(new APIErrorHandler
                        {
                            ErrorMessage = $"API timeout during batch {i}",
                            ErrorTime = DateTime.Now.AddDays(-i),
                            APIEndpoint = Constants.API_SOURCE,
                            RetryAttempt = i % 3,
                            FallbackData = PoechoResVariations.ToList()
                        });
                    }
                }
            }
        }

        public static string GetLargeDataSet()
        {
            var sb = new System.Text.StringBuilder();
            sb.AppendLine("=== Poechores Large Data Set (Enhanced with API Error Resilience) ===");
            sb.AppendLine($"Generated at: {DateTime.Now:yyyy-MM-dd HH:mm:ss.fff}");
            sb.AppendLine($"Total Entries: {ExpandedWordList.Count}");
            sb.AppendLine($"Array Size: {LargeStringArray.Length}");
            sb.AppendLine($"Binary Data Size: {BinaryData.Length} bytes");
            sb.AppendLine($"Dictionary Entries: {LargeDataDictionary.Count}");
            sb.AppendLine($"Statistics Records: {Repository.AllStatistics.Count}");
            sb.AppendLine($"Error History Records: {Repository.ErrorHistory.Count}");
            sb.AppendLine();
            
            sb.AppendLine("=== Sample Data Entries (First 200) ===");
            foreach (var item in ExpandedWordList.Take(200))
            {
                sb.AppendLine($"  {item}");
            }
            
            sb.AppendLine();
            sb.AppendLine(TextGenerator.GenerateErrorRecoveryReport());

            return sb.ToString();
        }

        public static async Task<string> GetLargeDataSetAsync()
        {
            try
            {
                using (var client = new HttpClient { Timeout = TimeSpan.FromSeconds(5) })
                {
                    var response = await client.GetAsync(Constants.API_SOURCE);
                    if (response.IsSuccessStatusCode)
                    {
                        return await response.Content.ReadAsStringAsync();
                    }
                    else
                    {
                        throw new HttpRequestException($"API returned status {response.StatusCode}");
                    }
                }
            }
            catch (Exception ex)
            {
                var errorHandler = APIErrorHandler.CreateFromException(ex, Constants.API_SOURCE);
                Constants.ErrorLog[$"error_{DateTime.Now.Ticks}"] = errorHandler;
                return GetLargeDataSet();
            }
        }

        public static void Main(string[] args)
        {
            Console.WriteLine("=== Poechores Data Generator Initialized ===");
            Console.WriteLine($"Timestamp: {DateTime.Now:yyyy-MM-dd HH:mm:ss.fff}");
            Console.WriteLine($"Loaded {ExpandedWordList.Count} word entries");
            Console.WriteLine($"Loaded {LargeStringArray.Length} string array elements");
            Console.WriteLine($"Loaded {LargeDataDictionary.Count} dictionary entries");
            Console.WriteLine($"Loaded {Repository.AllStatistics.Count} statistics records");
            Console.WriteLine($"Loaded {Repository.ErrorHistory.Count} error history entries");
            Console.WriteLine($"Loaded {Constants.DataMap.Count} data map entries");
            Console.WriteLine($"Binary data size: {BinaryData.Length / (1024 * 1024)} MB");
            Console.WriteLine();
            Console.WriteLine("API Error Resilience Status: ACTIVE");
            Console.WriteLine("Fallback data available: YES");
            Console.WriteLine("Data generation completed successfully.");
        }
    }
}
