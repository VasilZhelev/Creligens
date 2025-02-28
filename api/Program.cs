using api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using Google.Cloud.Firestore;

var builder = WebApplication.CreateBuilder(args);

// === Firebase Setup === //
var firebaseProjectId = "creligens"; 

// Try to load Firebase service account credentials from an environment variable (for production on Render)
var firebaseServiceAccountJson = Environment.GetEnvironmentVariable("FIREBASE_SERVICE_ACCOUNT_JSON");

if (!string.IsNullOrEmpty(firebaseServiceAccountJson))
{
    // Load credentials from the JSON string provided in the environment variable.
    FirebaseApp.Create(new AppOptions
    {
        Credential = GoogleCredential.FromJson(firebaseServiceAccountJson)
    });
}
else
{
    // Fallback: load credentials from a file (for local development).
    var serviceAccountPath = Environment.GetEnvironmentVariable("FIREBASE_SERVICE_ACCOUNT_PATH");
    if (!string.IsNullOrEmpty(serviceAccountPath))
    {
        FirebaseApp.Create(new AppOptions
        {
            Credential = GoogleCredential.FromFile(serviceAccountPath)
        });
    }
    else
    {
        throw new Exception("No Firebase service account credentials found. Set either FIREBASE_SERVICE_ACCOUNT_JSON (for production) or FIREBASE_SERVICE_ACCOUNT_PATH (for development).");
    }
}

// === Configure Firebase JWT Authentication ===
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        // Firebase issues tokens with the issuer: "https://securetoken.google.com/<your-project-id>"
        options.Authority = $"https://securetoken.google.com/{firebaseProjectId}";
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = $"https://securetoken.google.com/{firebaseProjectId}",
            ValidateAudience = true,
            // The audience is your Firebase project ID.
            ValidAudience = firebaseProjectId,
            ValidateLifetime = true
        };
    });

// (Optional) Register Firestore for Cloud Firestore access.
// Remove this if you do not need Firestore.
builder.Services.AddSingleton(provider => FirestoreDb.Create(firebaseProjectId));

// === Register Additional Services ===
// Email Service
builder.Services.AddSingleton<IEmailService, EmailService>();

// Example: a custom web scraping service
builder.Services.AddSingleton<WebScraperService>();
builder.Services.AddHttpClient();

// Add controllers.
builder.Services.AddControllers();

// Add CORS for development
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

// Add Swagger services.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "MyFirebaseApi", Version = "v1" });

    // Add JWT Bearer security definition
    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. \r\n\r\nEnter 'Bearer' [space] and then your token.",
        Name = "Authorization",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    // Add a global security requirement
    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                },
                Scheme = "oauth2",
                Name = "Bearer",
                In = Microsoft.OpenApi.Models.ParameterLocation.Header,
            },
            new List<string>()
        }
    });
});

var app = builder.Build();

// === Middleware Pipeline ===

// Enable Swagger and Swagger UI.
app.UseSwagger();
app.UseSwaggerUI();

// Apply CORS policy
app.UseCors("AllowAll");

// Redirect HTTP to HTTPS.
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