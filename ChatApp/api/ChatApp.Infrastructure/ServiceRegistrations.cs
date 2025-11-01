using ChatApp.Application.Abstractions;
using ChatApp.Application.Abstractions.Services;
using ChatApp.Infrastructure.Persistence;
using ChatApp.Infrastructure.Persistence.Conversation;
using ChatApp.Infrastructure.Services;
using ChatApp.Infrastructure.Services.User;
using ChatApp.Infrastructure.Stores;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.DependencyInjection;
using WebApplication.Application.Abstractions.Services;
using WebApplication.Infrastructure.Services;

namespace ChatApp.Infrastructure;

public static class ServiceRegistrations
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services)
    {
        services.AddScoped<IJwtService, JwtService>();
        services.AddScoped<IPasswordHashing, PasswordHashing>();
        services.AddSingleton<IUserIdProvider, AppUserCodeProvider>();

        //add stores
        services.AddSingleton<IGroupMembershipStore, InMemoryGroupStore>();
        services.AddSingleton<IPresenceStore, InMemoryPresenceStore>();
        //add repositories
        services.AddScoped<IOAuthClientsRepository, OAuthClientsRepository>();
        services.AddScoped<IOAuthClientSecretsRepository, OAuthClientSecretsRepository>();
        services.AddScoped<IUsersRepository, UsersRepository>();
        services.AddScoped<IConversationRepository, ConversationRepository>();
        services.AddScoped<ICurrentUserService, CurrentUserService>();
        services.AddScoped<IMessageRepository, MessageRepository>();
        return services;
    }
}