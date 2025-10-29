using ChatApp.Application.Abstractions;
using ChatApp.Application.BackgroundServices;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.DependencyInjection;
using WebApplication.Application.Abstractions.Services;

namespace ChatApp.Application;

public static class ServiceRegistrations
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddHostedService<CleanUpUserBackgroundService>();
        return services;
    }
}