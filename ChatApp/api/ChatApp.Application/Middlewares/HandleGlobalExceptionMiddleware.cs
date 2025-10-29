using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace ChatApp.Application.Middlewares;

public class HandleGlobalExceptionMiddleware
{
    private readonly ILogger<HandleGlobalExceptionMiddleware> _logger;
    private readonly RequestDelegate _next;

    public HandleGlobalExceptionMiddleware(RequestDelegate next, ILogger<HandleGlobalExceptionMiddleware> logger)
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
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception occurred.");

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

            var result = JsonSerializer.Serialize(new
            {
                error = ex.GetType().Name,
                message = ex.Message
            });

            await context.Response.WriteAsync(result);
        }
    }
}