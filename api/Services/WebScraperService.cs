using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HtmlAgilityPack;
using System.Text.Json;

namespace api.Services
{
    public class WebScraperService
    {
        private readonly HttpClient _httpClient;

        public WebScraperService(HttpClient httpClient)
        {
            _httpClient = httpClient;
            _httpClient.DefaultRequestHeaders.Add("Accept-Charset", "utf-8");
        }

        public async Task<ScrapedData> ScrapeCarDataAsync(string url)
        {
            try
            {
                var response = await _httpClient.GetByteArrayAsync(url);
                var html = System.Text.Encoding.UTF8.GetString(response);
                var htmlDoc = new HtmlDocument();
                htmlDoc.LoadHtml(html);

                var titleNode = htmlDoc.DocumentNode.SelectSingleNode("//div[@class='obTitle']//h1");
                var title = CleanText(titleNode?.InnerText ?? "No title found");

                var yearNode = htmlDoc.DocumentNode.SelectSingleNode("//div[@class='proizvodstvo']//div[@class='mpInfo']");
                var year = CleanText(yearNode?.InnerText ?? "Unknown");

                var priceNode = htmlDoc.DocumentNode.SelectSingleNode("//div[@class='Price']");
                var price = CleanText(priceNode?.InnerText ?? "No price found");

                var locationNode = htmlDoc.DocumentNode.SelectSingleNode("//div[@class='dealer']//div[@class='location']");
                var location = CleanText(locationNode?.InnerText ?? "No location found");

                return new ScrapedData
                {
                    Title = title,
                    Year = year,
                    Price = price,
                    Location = location,
                    ScrapedAt = DateTime.UtcNow
                };
            }
            catch (Exception ex)
            {
                throw new Exception("Error scraping the page", ex);
            }
        }

        private string CleanText(string text)
        {
            if (string.IsNullOrEmpty(text)) return text;
            
            text = text.Replace("\uFFFD", ""); // Remove replacement character (�)
            text = text.Replace("\u0000", ""); // Remove null characters
            return text.Trim();
        }

        public async Task SaveDataToJsonAsync(ScrapedData data, string filePath)
        {
            var options = new JsonSerializerOptions
            {
                WriteIndented = true,
                Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping
            };
            
            var json = JsonSerializer.Serialize(data, options);
            await File.WriteAllTextAsync(filePath, json, System.Text.Encoding.UTF8);
        }
    }

    public class ScrapedData
    {
        public string Title { get; set; }
        public string Year { get; set; }
        public string Price { get; set; }
        public string Location { get; set; }
        public DateTime ScrapedAt { get; set; }
    }
}