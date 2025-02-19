using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using api.Services;

namespace api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ScraperController : ControllerBase
    {
        private readonly WebScraperService _scraperService;

        public ScraperController(WebScraperService scraperService)
        {
            _scraperService = scraperService;
        }

        [HttpGet("scrape")]
        public async Task<IActionResult> Scrape([FromQuery] string url)
        {
            if (string.IsNullOrWhiteSpace(url))
            {
                return BadRequest("URL is required");
            }

            try
            {
                var data = await _scraperService.ScrapeCarDataAsync(url);
                await _scraperService.SaveDataToJsonAsync(data, "scrapedData.json");
                return Ok(data);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error occurred: {ex.Message}");
            }
        }
    }
}