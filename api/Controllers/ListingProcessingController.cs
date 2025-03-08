using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Services;  // Import types from the services

namespace api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ListingProcessingController : ControllerBase
    {
        private readonly WebScraperService _scraperService;
        private readonly IImageProcessingService _imageProcessingService;

        // Hard-coded demo repair prices for known broken parts:
        private readonly Dictionary<string, decimal> _repairPrices = new Dictionary<string, decimal>
        {
            { "Broken_front_bumper", 250 },
            { "Broken_front_left_door", 300 },
            { "Broken_front_right_bumper", 250 },
            { "Broken_front_right_door", 300 },
            { "Broken_headlight", 150 },
            { "Broken_hood", 400 },
            { "Broken_left_front_bumper", 275 },
            { "Broken_rear_left_door", 350 },
            { "Broken_rear_right_door", 350 }
        };

        public ListingProcessingController(WebScraperService scraperService, IImageProcessingService imageProcessingService)
        {
            _scraperService = scraperService;
            _imageProcessingService = imageProcessingService;
        }

        [HttpPost("process-listing")]
        public async Task<IActionResult> ProcessListing([FromBody] ListingRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Url))
                return BadRequest("Invalid URL provided.");

            // Call the scraper service. (Note: ScrapeCarDataAsync returns a ScrapedData.)
            ScrapedData scrapedData = await _scraperService.ScrapeCarDataAsync(request.Url);
            if (scrapedData == null)
                return NotFound("Could not scrape listing details.");

            if (scrapedData.PhotoUrls == null || !scrapedData.PhotoUrls.Any())
                return NotFound("No images found in listing.");

            // Select the first three images to process.
            var imagesToProcess = scrapedData.PhotoUrls.Take(3).ToList();

            // Call the image processing service.
            List<ImageProcessResult> imgResults = await _imageProcessingService.ProcessImagesAsync(imagesToProcess);

            var brokenParts = new List<BrokenPartResult>();
            foreach (var imgResult in imgResults)
            {
                if (imgResult?.Data?.Predictions != null)
                {
                    foreach (var prediction in imgResult.Data.Predictions)
                    {
                        if (prediction.Class.StartsWith("Broken_") && _repairPrices.ContainsKey(prediction.Class))
                        {
                            brokenParts.Add(new BrokenPartResult
                            {
                                PartName = prediction.Class,
                                RepairCost = _repairPrices[prediction.Class],
                                Confidence = prediction.Confidence
                            });
                        }
                    }
                }
            }

            decimal totalRepairCost = brokenParts.Sum(bp => bp.RepairCost);

            // Build the composite response.
            // Build the composite response.
            ListingProcessingResponse response = new ListingProcessingResponse
            {
                CarTitle = scrapedData.Title,
                Year = scrapedData.Year,
                Price = scrapedData.Price,
                BrokenParts = brokenParts,
                TotalRepairCost = totalRepairCost,
                PhotoUrls = scrapedData.PhotoUrls // Add this line
            };

            return Ok(response);
        }
    }

    // Request model for processing a listing.
    public class ListingRequest
    {
        public string Url { get; set; }
    }

    // Composite response returned to the frontend.
    public class ListingProcessingResponse
{
    public string CarTitle { get; set; }
    public string Year { get; set; }
    public string Price { get; set; }
    public List<BrokenPartResult> BrokenParts { get; set; }
    public decimal TotalRepairCost { get; set; }
    public List<string> PhotoUrls { get; set; } // Add this line
}

    // Represents each broken part and its estimated repair cost.
    public class BrokenPartResult
    {
        public string PartName { get; set; }
        public decimal RepairCost { get; set; }
        public double Confidence { get; set; }
    }
}
