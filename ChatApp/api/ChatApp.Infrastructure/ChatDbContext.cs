using ChatApp.Domain.Entities;
using ChatApp.Domain.Enum;
using ChatApp.Domain.Views;
using Microsoft.EntityFrameworkCore;

namespace ChatApp.Infrastructure;

public class ChatDbContext : DbContext
{
    public ChatDbContext(DbContextOptions<ChatDbContext> options) : base(options)
    {
    }

    public DbSet<Users> Users => Set<Users>();
    public DbSet<Conversations> Conversations => Set<Conversations>();
    public DbSet<ConversationMembers> ConversationMembers => Set<ConversationMembers>();
    public DbSet<Messages> Messages => Set<Messages>();
    public DbSet<ConversationReadState> ConversationReadStates => Set<ConversationReadState>();
    public DbSet<ConversationMetadata> ConversationMetadata => Set<ConversationMetadata>();
    public DbSet<ConversationAuditExternal> ConversationAuditExternals => Set<ConversationAuditExternal>();
    public DbSet<OAuthClients> OAuthClients => Set<OAuthClients>();
    public DbSet<OAuthClientSecrets> OAuthClientSecrets => Set<OAuthClientSecrets>();

    // Views
    public DbSet<ViewConversationLastMessage> VConversationLastMessages => Set<ViewConversationLastMessage>();
    public DbSet<ViewMyConversations> VMyConversations => Set<ViewMyConversations>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Schema mặc định
        modelBuilder.HasDefaultSchema("chat");

        // Map PostgreSQL enum
        // (Cách 1 - qua EF ModelBuilder)
        modelBuilder.HasPostgresEnum<ConversationType>("chat", "ConversationType");

        // USERS
        modelBuilder.Entity<Users>(b =>
        {
            b.ToTable("Users");
            b.Property(p => p.Id).HasDefaultValueSql("gen_random_uuid()");
            b.HasIndex(p => p.UserName).IsUnique();
            b.HasIndex(p => p.EmailAddress).IsUnique();
        });

        // CONVERSATIONS
        modelBuilder.Entity<Conversations>(b =>
        {
            b.ToTable("Conversations");
            b.Property(p => p.Id).HasDefaultValueSql("gen_random_uuid()");
            b.Property(p => p.Type).HasConversion<string>(); // giá trị enum giống PG enum, MapEnum đã cấu hình
            b.HasOne(p => p.CreatedByUser)
                .WithMany()
                .HasForeignKey(p => p.CreatedByUserId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // CONVERSATION MEMBERS (composite PK)
        modelBuilder.Entity<ConversationMembers>(b =>
        {
            b.ToTable("ConversationMembers");
            b.HasKey(k => new { k.ConversationId, k.UserId });
            b.HasIndex(i => i.UserId).HasDatabaseName("IxConvMembersUser");
            b.HasIndex(i => i.ConversationId)
                .HasDatabaseName("IxConvMembersConvActive")
                .HasFilter("\"IsActive\"");
            b.HasOne(x => x.Conversation)
                .WithMany(c => c.Members)
                .HasForeignKey(x => x.ConversationId)
                .OnDelete(DeleteBehavior.Cascade);
            b.HasOne(x => x.User)
                .WithMany(u => u.ConversationMembers)
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // MESSAGES
        modelBuilder.Entity<Messages>(b =>
        {
            b.ToTable("Messages");
            b.Property(p => p.Id).HasDefaultValueSql("gen_random_uuid()");
            b.HasOne(p => p.Conversation)
                .WithMany(c => c.Messages)
                .HasForeignKey(p => p.ConversationId)
                .OnDelete(DeleteBehavior.Cascade);
            b.HasOne(p => p.SenderUser)
                .WithMany(u => u.Messages)
                .HasForeignKey(p => p.SenderUserId)
                .OnDelete(DeleteBehavior.Restrict);

            b.HasIndex(p => new { p.ConversationId, p.CreatedAt }).HasDatabaseName("IxMessagesConvCreatedAtDesc");
            b.HasIndex(p => new { p.ConversationId, p.CreatedAt, p.Id })
                .HasDatabaseName("IxMessagesConvCreatedIdDesc")
                .HasFilter("\"IsDeleted\" = FALSE");
            b.HasIndex(p => new { p.ConversationId, p.CreatedAt })
                .HasDatabaseName("IxMessagesConvCreatedAt")
                .HasFilter("\"IsDeleted\" = FALSE");
        });

        // READ STATE
        modelBuilder.Entity<ConversationReadState>(b =>
        {
            b.ToTable("ConversationReadState");
            b.HasKey(k => new { k.ConversationId, k.UserId });
            b.HasIndex(i => i.UserId).HasDatabaseName("IxReadStateUser");
            b.HasOne(x => x.Conversation)
                .WithMany()
                .HasForeignKey(x => x.ConversationId)
                .OnDelete(DeleteBehavior.Cascade);
            b.HasOne(x => x.User)
                .WithMany(u => u.ConversationReadStates)
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Cascade);
            b.HasOne(x => x.LastReadMessage)
                .WithMany(m => m.ReadStatesPointingHere)
                .HasForeignKey(x => x.LastReadMessageId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        // METADATA (JSONB)
        modelBuilder.Entity<ConversationMetadata>(b =>
        {
            b.ToTable("ConversationMetadata");
            b.HasKey(k => k.ConversationId);
            b.Property(p => p.Metadata).HasColumnType("jsonb");
            b.HasOne(p => p.Conversation)
                .WithOne(c => c.ConversationMetadata)
                .HasForeignKey<ConversationMetadata>(p => p.ConversationId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // AUDIT
        modelBuilder.Entity<ConversationAuditExternal>(b =>
        {
            b.ToTable("ConversationAuditExternal");
            b.Property(p => p.Id).HasDefaultValueSql("gen_random_uuid()");
            b.Property(p => p.PayloadSnapshot).HasColumnType("jsonb");
            b.HasIndex(i => i.ConversationId).HasDatabaseName("IxExtAuditConv");
            b.HasIndex(i => i.CreatedAt).HasDatabaseName("IxExtAuditCreatedAt");
            b.HasOne(x => x.Conversation)
                .WithMany()
                .HasForeignKey(x => x.ConversationId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        // OAUTH CLIENTS
        modelBuilder.Entity<OAuthClients>(b =>
        {
            b.ToTable("OAuthClients");
            b.Property(p => p.Id).HasDefaultValueSql("gen_random_uuid()");
            b.Property(p => p.Scopes).HasColumnType("text[]");
            b.Property(p => p.IpAllowlist).HasColumnType("cidr[]");
            b.HasIndex(p => p.ClientId).IsUnique();
            b.HasOne(p => p.CreatedByUser)
                .WithMany()
                .HasForeignKey(p => p.CreatedByUserId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        // OAUTH CLIENT SECRETS
        modelBuilder.Entity<OAuthClientSecrets>(b =>
        {
            b.ToTable("OAuthClientSecrets");
            b.Property(p => p.Id).HasDefaultValueSql("gen_random_uuid()");
            b.HasIndex(p => p.ClientId).HasDatabaseName("IxClientSecretsClient");
            b.HasOne(p => p.Client)
                .WithMany(c => c.Secrets)
                .HasForeignKey(p => p.ClientId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // VIEWS (keyless)
        modelBuilder.Entity<ViewConversationLastMessage>(b =>
        {
            b.ToView("VConversationLastMessage");
            b.HasNoKey();
        });

        modelBuilder.Entity<ViewMyConversations>(b =>
        {
            b.ToView("VMyConversations");
            b.HasNoKey();
            // Enum cột ConversationType trong view cũng map theo Postgres enum
            b.Property(p => p.ConversationType).HasConversion<string>();
        });
    }
}