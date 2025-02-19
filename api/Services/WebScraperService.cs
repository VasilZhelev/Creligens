using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using HtmlAgilityPack;

namespace api.Services
{
    public class WebScraperService
    {
        private readonly HttpClient _httpClient;

        public WebScraperService(HttpClient httpClient)
        {
            _httpClient = httpClient;
            _httpClient.DefaultRequestHeaders.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36");
        }

        public async Task<ScrapedData> ScrapeCarDataAsync(string url)
        {
            try
            {
                var response = await _httpClient.GetByteArrayAsync(url);
                var html = Encoding.UTF8.GetString(response);
                var htmlDoc = new HtmlDocument();
                htmlDoc.LoadHtml(html);

                // --- Title Extraction ---
                var h1Node = htmlDoc.DocumentNode.SelectSingleNode("//div[@class='obTitle']//h1");
                string title = h1Node?.FirstChild?.InnerText?.Trim() ?? "No title found";

                // --- Year Extraction ---
                var yearNode = htmlDoc.DocumentNode.SelectSingleNode("//div[contains(@class, 'proizvodstvo')]/div[@class='mpInfo']");
                string yearText = yearNode?.InnerText ?? "No year found";
                var yearMatch = Regex.Match(yearText, @"\b(19|20)\d{2}\b");
                yearText = yearMatch.Success ? yearMatch.Value : "Unknown Year";

                // --- Price Extraction ---
                var priceNode = htmlDoc.DocumentNode.SelectSingleNode("//div[@class='Price']");
                string priceText = priceNode?.InnerText ?? "No price found";
                // Use a regex that matches digits and spaces (e.g., "20 000"), then remove spaces.
                var priceMatch = Regex.Match(priceText, @"(\d[\d\s]*)");
                priceText = priceMatch.Success ? priceMatch.Groups[1].Value.Replace(" ", "") : "Unknown Price";

                // --- Photo URLs Extraction ---
                var photoUrls = new List<string>();
                var photoNodes = htmlDoc.DocumentNode.SelectNodes("//div[@id='owlcarousel']//img[contains(@class, 'carouselimg')]");
                if (photoNodes != null)
                {
                    foreach (var imgNode in photoNodes)
                    {
                        var photoUrl = imgNode.GetAttributeValue("data-src", "").Trim();
                        if (string.IsNullOrEmpty(photoUrl))
                        {
                            photoUrl = imgNode.GetAttributeValue("src", "").Trim();
                        }
                        if (!string.IsNullOrEmpty(photoUrl))
                        {
                            photoUrls.Add(photoUrl);
                        }
                    }
                }

                return new ScrapedData
                {
                    Title = title,
                    Year = yearText,
                    Price = priceText,
                    PhotoUrls = photoUrls,
                    ScrapedAt = DateTime.UtcNow
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error scraping: {ex.Message}");
                throw new Exception("Error scraping the page", ex);
            }
        }

        public async Task SaveDataToJsonAsync(ScrapedData data, string filePath)
        {
            var options = new JsonSerializerOptions
            {
                WriteIndented = true,
                Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping
            };

            var json = JsonSerializer.Serialize(data, options);
            await System.IO.File.WriteAllTextAsync(filePath, json, Encoding.UTF8);
            Console.WriteLine("Data saved to JSON.");
        }
    }

    public class ScrapedData
    {
        public string Title { get; set; }
        public string Year { get; set; }
        public string Price { get; set; }
        public List<string> PhotoUrls { get; set; } = new List<string>();
        public DateTime ScrapedAt { get; set; }
    }
}
