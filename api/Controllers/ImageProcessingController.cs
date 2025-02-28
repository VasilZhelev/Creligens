using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ImageProcessingController : ControllerBase
    {
        private readonly HttpClient _httpClient;
        // Replace with your actual Roboflow model endpoint and API key
        private readonly string _roboflowModelUrl = "https://detect.roboflow.com/your-project/your-model";
        private readonly string _roboflowApiKey = "YOUR_ROBOFLOW_API_KEY";

        public ImageProcessingController(IHttpClientFactory httpClientFactory)
        {
            _httpClient = httpClientFactory.CreateClient();
        }

        // POST api/ImageProcessing/process-images
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
                // Build the request URL for Roboflow.
                // Roboflow’s API typically accepts the image (or its URL) along with your API key.
                var requestUrl = $"{_roboflowModelUrl}?api_key={_roboflowApiKey}&image={WebUtility.UrlEncode(imageUrl)}";

                try
                {
                    // Send GET request to Roboflow API.
                    var response = await _httpClient.GetAsync(requestUrl);
                    if (response.IsSuccessStatusCode)
                    {
                        // Assume the response is in JSON format.
                        // Define RoboflowResponse to match the returned JSON structure.
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
                    // Log exception details here if needed.
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

    // Define this class based on the Roboflow API response structure.
    // Common properties might include predictions, confidence, bounding box coordinates, etc.
    public class RoboflowResponse
    {
        public List<Prediction> Predictions { get; set; }
        // You might get a URL for an annotated image, or additional metadata.
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
