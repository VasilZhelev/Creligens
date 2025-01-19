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
        }

        public async Task<ScrapedData> ScrapeCarDataAsync(string url)
        {
            try
            {
                var html = await _httpClient.GetStringAsync(url);
                var htmlDoc = new HtmlDocument();
                htmlDoc.LoadHtml(html);

                var titleNode = htmlDoc.DocumentNode.SelectSingleNode("//div[@class='obTitle']//h1");
                var title = titleNode?.InnerText.Trim() ?? "No title found";

                var yearNode = htmlDoc.DocumentNode.SelectSingleNode("//div[@class='proizvodstvo']//div[@class='mpInfo']");
                var year = yearNode?.InnerText.Trim() ?? "Unknown";

                var priceNode = htmlDoc.DocumentNode.SelectSingleNode("//div[@class='Price']");
                var price = priceNode?.InnerText.Trim() ?? "No price found";

                var locationNode = htmlDoc.DocumentNode.SelectSingleNode("//div[@class='dealer']//div[@class='location']");
                var location = locationNode?.InnerText.Trim() ?? "No location found";


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

        public async Task SaveDataToJsonAsync(ScrapedData data, string filePath)
        {
            var options = new JsonSerializerOptions {WriteIndented = true};
            var json = JsonSerializer.Serialize(data, options);
            await File.WriteAllTextAsync(filePath, json);
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