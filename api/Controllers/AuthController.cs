using Microsoft.AspNetCore.Mvc;
using FirebaseAdmin.Auth;
using System.Threading.Tasks;
using System;
using System.Collections.Generic;
using api.Services;

namespace api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ILogger<AuthController> _logger;
        private readonly IEmailService _emailService;

        public AuthController(ILogger<AuthController> logger, IEmailService emailService)
        {
            _logger = logger;
            _emailService = emailService;
        }

        [HttpPost("signup")]
        public async Task<IActionResult> SignUp([FromBody] SignUpRequest request)
        {
            try
            {
                // Validate request
                if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
                {
                    return BadRequest(new { Message = "Email and password are required" });
                }

                // Create the user in Firebase
                var userArgs = new UserRecordArgs
                {
                    Email = request.Email,
                    Password = request.Password,
                    DisplayName = request.DisplayName,
                    EmailVerified = false // Email not verified yet
                };

                var userRecord = await FirebaseAuth.DefaultInstance.CreateUserAsync(userArgs);

                // Generate email verification link/code
                string verificationCode = GenerateVerificationCode();
                
                // Store verification code with user UID in a custom claims
                var claims = new Dictionary<string, object>
                {
                    { "verificationCode", verificationCode },
                    { "verificationCodeExpiry", DateTime.UtcNow.AddHours(24).ToString("o") }
                };
                
                await FirebaseAuth.DefaultInstance.SetCustomUserClaimsAsync(userRecord.Uid, claims);

                // Here you would send the verification email (we'll create this service later)
                await _emailService.SendVerificationEmail(request.Email, verificationCode);

                return Ok(new { 
                    Message = "User created successfully. Verification email has been sent.",
                    UserId = userRecord.Uid,
                    // For demo purposes only - remove in production
                    VerificationCode = verificationCode 
                });
            }
            catch (FirebaseAuthException ex)
            {
                _logger.LogError(ex, "Firebase auth error during sign up");
                return BadRequest(new { Message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during sign up");
                return StatusCode(500, new { Message = "An error occurred during sign up" });
            }
        }

        [HttpPost("verify-email")]
        public async Task<IActionResult> VerifyEmail([FromBody] VerifyEmailRequest request)
        {
            try
            {
                // Get user by email
                var userRecord = await FirebaseAuth.DefaultInstance.GetUserByEmailAsync(request.Email);
                
                // Get custom claims
                var customClaims = userRecord.CustomClaims;
                
                if (!customClaims.TryGetValue("verificationCode", out object storedCode) || 
                    !customClaims.TryGetValue("verificationCodeExpiry", out object expiryStr))
                {
                    return BadRequest(new { Message = "Verification code not found or expired" });
                }
                
                // Check expiry
                if (DateTime.TryParse(expiryStr.ToString(), out DateTime expiry) && 
                    expiry < DateTime.UtcNow)
                {
                    return BadRequest(new { Message = "Verification code has expired" });
                }
                
                // Verify code
                if (storedCode.ToString() != request.VerificationCode)
                {
                    return BadRequest(new { Message = "Invalid verification code" });
                }
                
                // Mark email as verified
                var userArgs = new UserRecordArgs
                {
                    Uid = userRecord.Uid,
                    EmailVerified = true
                };
                
                await FirebaseAuth.DefaultInstance.UpdateUserAsync(userArgs);
                
                // Remove verification code from claims
                var updatedClaims = new Dictionary<string, object>();
                foreach (var claim in customClaims)
                {
                    if (claim.Key != "verificationCode" && claim.Key != "verificationCodeExpiry")
                    {
                        updatedClaims[claim.Key] = claim.Value;
                    }
                }
                
                await FirebaseAuth.DefaultInstance.SetCustomUserClaimsAsync(userRecord.Uid, updatedClaims);
                
                return Ok(new { Message = "Email verified successfully" });
            }
            catch (FirebaseAuthException ex)
            {
                _logger.LogError(ex, "Firebase auth error during email verification");
                return BadRequest(new { Message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during email verification");
                return StatusCode(500, new { Message = "An error occurred during email verification" });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                // Validate user exists
                var userRecord = await FirebaseAuth.DefaultInstance.GetUserByEmailAsync(request.Email);
                
                // Check if email is verified
                if (!userRecord.EmailVerified && true)  // Set to false if you want to allow unverified emails
                {
                    return BadRequest(new { 
                        Message = "Email not verified. Please verify your email before logging in.",
                        RequiresVerification = true
                    });
                }
                
                // Create a custom token for the user
                string customToken = await FirebaseAuth.DefaultInstance.CreateCustomTokenAsync(userRecord.Uid);
                
                // Return the token with clear instructions for the client
                return Ok(new { 
                    Message = "Login successful",
                    Token = customToken,
                    TokenType = "Bearer",
                    UserId = userRecord.Uid,
                    DisplayName = userRecord.DisplayName,
                    Email = userRecord.Email,
                    // Include instructions for the client
                    Instructions = "Include this token in subsequent requests as: Authorization: Bearer {token}"
                });
            }
            catch (Exception ex)
            {
                // Error handling
                _logger.LogError(ex, "Error during login");
                return StatusCode(500, new { Message = "An error occurred during login" });
            }
        }

        [HttpPost("resend-verification")]
        public async Task<IActionResult> ResendVerification([FromBody] ResendVerificationRequest request)
        {
            try
            {
                var userRecord = await FirebaseAuth.DefaultInstance.GetUserByEmailAsync(request.Email);
                
                if (userRecord.EmailVerified)
                {
                    return BadRequest(new { Message = "Email is already verified" });
                }
                
                // Generate new verification code
                string verificationCode = GenerateVerificationCode();
                
                // Update the verification code and expiry in the custom claims
                var claims = new Dictionary<string, object>(userRecord.CustomClaims ?? new Dictionary<string, object>());
                claims["verificationCode"] = verificationCode;
                claims["verificationCodeExpiry"] = DateTime.UtcNow.AddHours(24).ToString("o");
                
                await FirebaseAuth.DefaultInstance.SetCustomUserClaimsAsync(userRecord.Uid, claims);
                
                // Here you would send the verification email
                await _emailService.SendVerificationEmail(request.Email, verificationCode);
                
                return Ok(new { 
                    Message = "Verification email has been resent",
                    // For demo purposes only - remove in production
                    VerificationCode = verificationCode 
                });
            }
            catch (FirebaseAuthException ex)
            {
                _logger.LogError(ex, "Firebase auth error during resend verification");
                return BadRequest(new { Message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during resend verification");
                return StatusCode(500, new { Message = "An error occurred during resend verification" });
            }
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            try
            {
                // Check if user exists
                var userRecord = await FirebaseAuth.DefaultInstance.GetUserByEmailAsync(request.Email);
                
                // Generate password reset link
                // In a production environment, you would use Firebase's built-in password reset functionality
                // For demo, we'll create a similar system with reset codes
                
                string resetCode = GenerateVerificationCode();
                
                // Store reset code in custom claims
                var claims = new Dictionary<string, object>(userRecord.CustomClaims ?? new Dictionary<string, object>());
                claims["passwordResetCode"] = resetCode;
                claims["passwordResetExpiry"] = DateTime.UtcNow.AddHours(1).ToString("o");
                
                await FirebaseAuth.DefaultInstance.SetCustomUserClaimsAsync(userRecord.Uid, claims);
                
                // Here you would send the password reset email
                await _emailService.SendPasswordResetEmail(request.Email, resetCode);
                
                return Ok(new { 
                    Message = "Password reset instructions have been sent to your email",
                    // For demo purposes only - remove in production
                    ResetCode = resetCode 
                });
            }
            catch (FirebaseAuthException ex)
            {
                // Don't reveal whether a user exists or not for security
                _logger.LogWarning(ex, "Firebase auth error during forgot password");
                return Ok(new { Message = "If your email is registered, password reset instructions have been sent" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during forgot password");
                return StatusCode(500, new { Message = "An error occurred during password reset request" });
            }
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            try
            {
                // Validate request
                if (string.IsNullOrEmpty(request.Email) || 
                    string.IsNullOrEmpty(request.ResetCode) || 
                    string.IsNullOrEmpty(request.NewPassword))
                {
                    return BadRequest(new { Message = "Email, reset code, and new password are required" });
                }
                
                // Get user by email
                var userRecord = await FirebaseAuth.DefaultInstance.GetUserByEmailAsync(request.Email);
                
                // Validate reset code
                var customClaims = userRecord.CustomClaims ?? new Dictionary<string, object>();
                
                if (!customClaims.TryGetValue("passwordResetCode", out object storedCode) || 
                    !customClaims.TryGetValue("passwordResetExpiry", out object expiryStr))
                {
                    return BadRequest(new { Message = "Reset code not found or expired" });
                }
                
                // Check expiry
                if (DateTime.TryParse(expiryStr.ToString(), out DateTime expiry) && 
                    expiry < DateTime.UtcNow)
                {
                    return BadRequest(new { Message = "Reset code has expired" });
                }
                
                // Verify code
                if (storedCode.ToString() != request.ResetCode)
                {
                    return BadRequest(new { Message = "Invalid reset code" });
                }
                
                // Update password
                var userArgs = new UserRecordArgs
                {
                    Uid = userRecord.Uid,
                    Password = request.NewPassword
                };
                
                await FirebaseAuth.DefaultInstance.UpdateUserAsync(userArgs);
                
                // Remove reset code from claims
                var updatedClaims = new Dictionary<string, object>();
                foreach (var claim in customClaims)
                {
                    if (claim.Key != "passwordResetCode" && claim.Key != "passwordResetExpiry")
                    {
                        updatedClaims[claim.Key] = claim.Value;
                    }
                }
                
                await FirebaseAuth.DefaultInstance.SetCustomUserClaimsAsync(userRecord.Uid, updatedClaims);
                
                return Ok(new { Message = "Password has been reset successfully" });
            }
            catch (FirebaseAuthException ex)
            {
                _logger.LogError(ex, "Firebase auth error during password reset");
                return BadRequest(new { Message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during password reset");
                return StatusCode(500, new { Message = "An error occurred during password reset" });
            }
        }

        // Helper method to generate a verification code
        private string GenerateVerificationCode()
        {
            // Generate a 6-digit code
            Random random = new Random();
            return random.Next(100000, 999999).ToString();
        }
    }
}