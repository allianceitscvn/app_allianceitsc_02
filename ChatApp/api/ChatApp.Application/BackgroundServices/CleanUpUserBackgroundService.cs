using ChatApp.Application.Abstractions;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace ChatApp.Application.BackgroundServices;

public class CleanUpUserBackgroundService(
    ILogger<CleanUpUserBackgroundService> logger,
    IGroupMembershipStore groupMembershipStore)
    : IHostedService, IDisposable
{
    private Timer _timer;
    private readonly IGroupMembershipStore _groupMembershipStore = groupMembershipStore;

    public Task StartAsync(CancellationToken cancellationToken)
    {
        logger.LogInformation("CleanUpUserBackgroundService is starting.");

        _timer = new Timer(DoWork, null, TimeSpan.Zero,
            TimeSpan.FromMinutes(10)); // Chạy mỗi 5 phút

        return Task.CompletedTask;
    }

    private void DoWork(object? state)
    {
        logger.LogInformation("CleanUpUserBackgroundService is working.");
        groupMembershipStore.CleanUpUser();
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        logger.LogInformation("CleanUpUserBackgroundService is stopping.");
        _timer?.Change(Timeout.Infinite, 0);
        return Task.CompletedTask;
    }

    public void Dispose()
    {
        _timer?.Dispose();
    }
}