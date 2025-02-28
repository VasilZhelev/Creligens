using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Net.Http.Json;

namespace ImageProcessingApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ImageProcessingController : ControllerBase
    {
        private readonly HttpClient _httpClient;
        private readonly string _roboflowApiKey;
        // Set your Roboflow model URL (update with your actual project/model)
        private readonly string _roboflowModelUrl = "https://detect.roboflow.com/car_damage_detection_main_-f10/1";

        // The constructor now accepts IConfiguration, which gives access to environment variables.
        public ImageProcessingController(IHttpClientFactory httpClientFactory, IConfiguration configuration)
        {
            _httpClient = httpClientFactory.CreateClient();
            _roboflowApiKey = configuration["ROBOFLOW_API_KEY"]; // Retrieve the API key
        }

        // POST: api/ImageProcessing/process-images
        [HttpPost("process-images")]
        public async Task<IActionResult> ProcessImages([FromBody] List<string> imageUrls)
        {
            if (imageUrls == null || !imageUrls.Any())
            {
                return BadRequest("No image URLs provided.");
            }

            var results = new List<object>();

            foreach (var imageUrl in imageUrls)
            {
                var requestUrl = $"{_roboflowModelUrl}?api_key={_roboflowApiKey}&image={WebUtility.UrlEncode(imageUrl)}";
                try
                {
                    var response = await _httpClient.GetAsync(requestUrl);
                    if (response.IsSuccessStatusCode)
                    {
                        var roboflowResult = await response.Content.ReadFromJsonAsync<RoboflowResponse>();
                        results.Add(new
                        {
                            ImageUrl = imageUrl,
                            Data = roboflowResult
                        });
                    }
                    else
                    {
                        results.Add(new
                        {
                            ImageUrl = imageUrl,
                            Error = $"Roboflow returned status code: {response.StatusCode}"
                        });
                    }
                }
                catch (Exception ex)
                {
                    results.Add(new
                    {
                        ImageUrl = imageUrl,
                        Error = $"Exception: {ex.Message}"
                    });
                }
            }
            return Ok(results);
        }
    }

    // Define classes to map the Roboflow API response
    public class RoboflowResponse
    {
        public List<Prediction> Predictions { get; set; }
        public string AnnotatedImage { get; set; }
    }

    public class Prediction
    {
        public string Class { get; set; }
        public double Confidence { get; set; }
        public Box Bbox { get; set; }
    }

    public class Box
    {
        public int X { get; set; }
        public int Y { get; set; }
        public int Width { get; set; }
        public int Height { get; set; }
    }
}
