using api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using Google.Cloud.Firestore;

var builder = WebApplication.CreateBuilder(args);

// === Firebase Setup ===
// Replace with your Firebase Project ID.
var firebaseProjectId = "<your-project-id>";

// Initialize Firebase Admin SDK using your service account JSON file.
// Make sure the path is correct and the file is stored securely.
FirebaseApp.Create(new AppOptions
{
    Credential = GoogleCredential.FromFile("path/to/serviceAccount.json")
});

// === Configure Firebase JWT Authentication ===
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        // Firebase issues tokens with issuer "https://securetoken.google.com/<your-project-id>"
        options.Authority = $"https://securetoken.google.com/{firebaseProjectId}";
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = $"https://securetoken.google.com/{firebaseProjectId}",
            ValidateAudience = true,
            // The audience should be your Firebase project ID.
            ValidAudience = firebaseProjectId,
            ValidateLifetime = true
        };
    });

// (Optional) Register FirestoreDb for Cloud Firestore access.
// If you are not using Firestore, you can remove this line.
builder.Services.AddSingleton(provider => FirestoreDb.Create(firebaseProjectId));

// === Register Your Existing Services ===
// Register your custom web scraping service.
builder.Services.AddSingleton<WebScraperService>();
builder.Services.AddHttpClient();

// Add controllers.
builder.Services.AddControllers();

// Add Swagger services.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// === Configure the Middleware Pipeline ===

// Enable Swagger and Swagger UI.
app.UseSwagger();
app.UseSwaggerUI();

// Redirect HTTP requests to HTTPS.
app.UseHttpsRedirection();

// IMPORTANT: Add Authentication and Authorization middleware.
app.UseAuthentication();
app.UseAuthorization();

// Map controller endpoints.
app.MapControllers();

// Health check endpoints and redirect root to Swagger.
app.MapGet("/", () => Results.Redirect("/swagger"));
app.MapGet("/health", () => Results.Ok("Healthy"));

app.Run();