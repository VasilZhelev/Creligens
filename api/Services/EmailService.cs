using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace api.Services
{
    public interface IEmailService
    {
        Task SendVerificationEmail(string email, string verificationCode);
        Task SendPasswordResetEmail(string email, string resetCode);
    }

    public class EmailService : IEmailService
    {
        private readonly ILogger<EmailService> _logger;
        private readonly IConfiguration _configuration;
        private readonly string _fromEmail;
        private readonly string _smtpHost;
        private readonly int _smtpPort;
        private readonly string _smtpUsername;
        private readonly string _smtpPassword;
        private readonly string _applicationUrl;

        public EmailService(ILogger<EmailService> logger, IConfiguration configuration)
        {
            _logger = logger;
            _configuration = configuration;
            
            // Load configuration
            _fromEmail = _configuration["Email:FromAddress"];
            _smtpHost = _configuration["Email:SmtpHost"];
            _smtpPort = int.Parse(_configuration["Email:SmtpPort"]);
            _smtpUsername = _configuration["Email:SmtpUsername"];
            _smtpPassword = _configuration["Email:SmtpPassword"];
            _applicationUrl = _configuration["ApplicationUrl"];
        }

        public async Task SendVerificationEmail(string email, string verificationCode)
        {
            var subject = "Verify Your Email";
            var body = $@"
                <html>
                <head>
                    <style>
                        body {{ font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333; }}
                        .container {{ max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border-radius: 5px; }}
                        .header {{ background-color: #4285F4; color: white; padding: 10px; text-align: center; border-radius: 5px 5px 0 0; }}
                        .content {{ padding: 20px; }}
                        .code {{ font-size: 24px; font-weight: bold; text-align: center; margin: 20px 0; letter-spacing: 5px; color: #4285F4; }}
                        .button {{ display: inline-block; background-color: #4285F4; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; margin-top: 20px; }}
                        .footer {{ margin-top: 20px; font-size: 12px; color: #777; text-align: center; }}
                    </style>
                </head>
                <body>
                    <div class='container'>
                        <div class='header'>
                            <h1>Email Verification</h1>
                        </div>
                        <div class='content'>
                            <p>Thank you for signing up! Please use the following code to verify your email address:</p>
                            <div class='code'>{verificationCode}</div>
                            <p>Alternatively, you can click the button below to verify your email:</p>
                            <div style='text-align: center;'>
                                <a href='{_applicationUrl}/verify-email?email={WebUtility.UrlEncode(email)}&code={verificationCode}' class='button'>Verify Email</a>
                            </div>
                            <p>If you did not create an account with us, please ignore this email.</p>
                        </div>
                        <div class='footer'>
                            <p>This is an automated message, please do not reply to this email.</p>
                        </div>
                    </div>
                </body>
                </html>
            ";

            await SendEmailAsync(email, subject, body);
        }

        public async Task SendPasswordResetEmail(string email, string resetCode)
        {
            var subject = "Reset Your Password";
            var body = $@"
                <html>
                <head>
                    <style>
                        body {{ font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333; }}
                        .container {{ max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border-radius: 5px; }}
                        .header {{ background-color: #4285F4; color: white; padding: 10px; text-align: center; border-radius: 5px 5px 0 0; }}
                        .content {{ padding: 20px; }}
                        .code {{ font-size: 24px; font-weight: bold; text-align: center; margin: 20px 0; letter-spacing: 5px; color: #4285F4; }}
                        .button {{ display: inline-block; background-color: #4285F4; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; margin-top: 20px; }}
                        .footer {{ margin-top: 20px; font-size: 12px; color: #777; text-align: center; }}
                    </style>
                </head>
                <body>
                    <div class='container'>
                        <div class='header'>
                            <h1>Password Reset</h1>
                        </div>
                        <div class='content'>
                            <p>We received a request to reset your password. Please use the following code to reset your password:</p>
                            <div class='code'>{resetCode}</div>
                            <p>Alternatively, you can click the button below to reset your password:</p>
                            <div style='text-align: center;'>
                                <a href='{_applicationUrl}/reset-password?email={WebUtility.UrlEncode(email)}&code={resetCode}' class='button'>Reset Password</a>
                            </div>
                            <p>If you did not request a password reset, please ignore this email.</p>
                        </div>
                        <div class='footer'>
                            <p>This is an automated message, please do not reply to this email.</p>
                        </div>
                    </div>
                </body>
                </html>
            ";

            await SendEmailAsync(email, subject, body);
        }

        private async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            try
            {
                var message = new MailMessage
                {
                    From = new MailAddress(_fromEmail),
                    Subject = subject,
                    Body = body,
                    IsBodyHtml = true
                };
                message.To.Add(new MailAddress(toEmail));

                using (var client = new SmtpClient(_smtpHost, _smtpPort))
                {
                    client.EnableSsl = true;
                    client.UseDefaultCredentials = false;
                    client.Credentials = new NetworkCredential(_smtpUsername, _smtpPassword);
                    
                    await client.SendMailAsync(message);
                }

                _logger.LogInformation($"Email sent to {toEmail} with subject '{subject}'");
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex, $"Failed to send email to {toEmail} with subject '{subject}'");
                throw;
            }
        }
    }
}