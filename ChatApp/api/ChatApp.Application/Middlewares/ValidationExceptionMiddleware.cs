using System.Net;
using System.Text.Json;
using FluentValidation;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace WebApplication.Application.Middlewares;

// Middleware/ValidationExceptionMiddleware.cs

public class ValidationExceptionMiddleware
{
    private readonly ILogger<ValidationExceptionMiddleware> _logger;
    private readonly RequestDelegate _next;

    public ValidationExceptionMiddleware(RequestDelegate next, ILogger<ValidationExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (ValidationException ex)
        {
            _logger.LogWarning(ex, "FluentValidation failed");

            context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
            context.Response.ContentType = "application/json";

            var errors = ex.Errors.FirstOrDefault()!;

            var result = new
            {
                error = ex.GetType().Name,
                message = errors.ErrorMessage
            };

            var json = JsonSerializer.Serialize(result);
            await context.Response.WriteAsync(json);
        }
    }
}