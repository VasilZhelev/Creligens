using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace api.Services
{
    public interface IImageProcessingService
    {
        Task<List<ImageProcessResult>> ProcessImagesAsync(List<string> imageUrls);
    }

    public class ImageProcessingService : IImageProcessingService
    {
        private readonly HttpClient _httpClient;

        public ImageProcessingService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<List<ImageProcessResult>> ProcessImagesAsync(List<string> imageUrls)
        {
            var response = await _httpClient.PostAsJsonAsync("/api/ImageProcessing/process-images", imageUrls);
            if (response.IsSuccessStatusCode)
            {
                var results = await response.Content.ReadFromJsonAsync<List<ImageProcessResult>>();
                return results;
            }
            return new List<ImageProcessResult>();
        }
    }

    public class ImageProcessResult
    {
        public string ImageUrl { get; set; }
        public ProcessData Data { get; set; }
    }

    public class ProcessData
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
