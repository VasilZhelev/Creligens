using api.Services;

var builder = WebApplication.CreateBuilder(args);

// Register services for web scraping
builder.Services.AddSingleton<WebScraperService>();
builder.Services.AddHttpClient();

// Add controllers to the container
builder.Services.AddControllers();

// Add Swagger services
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();  // Make sure this line is here

var app = builder.Build();

// Swagger setup (for development environment)
// if (app.Environment.IsDevelopment())
// {
//     app.UseSwagger();
//     app.UseSwaggerUI(); // Swagger UI for testing
// }

app.UseSwagger();
app.UseSwaggerUI(); // Swagger UI for testing

app.UseHttpsRedirection();

// Map controllers (make sure API controllers are properly registered)
app.MapControllers();

// Health check and redirect to Swagger
app.MapGet("/", () => Results.Redirect("/swagger"));
app.MapGet("/health", () => Results.Ok("Healthy"));

app.Run();