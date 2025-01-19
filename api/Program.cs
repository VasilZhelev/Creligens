using api.Services;

var builder = WebApplication.CreateBuilder(args);

// Register services for web scraping
builder.Services.AddSingleton<WebScraperService>(); // WebScraperService registration
builder.Services.AddHttpClient(); // HttpClient for scraping

// Add controllers to the container
builder.Services.AddControllers(); // Register controllers

// Register Swagger for API documentation (optional)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Swagger setup
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(); // Swagger UI for easy testing
}

app.UseHttpsRedirection();

// Map API controllers
app.MapControllers(); // Ensure controllers are properly mapped

app.Run(); // Run the app