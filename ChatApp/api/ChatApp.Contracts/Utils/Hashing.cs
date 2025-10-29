using System.Text;
using Isopoh.Cryptography.Argon2;
using Isopoh.Cryptography.SecureArray;

namespace ChatApp.Contracts.Utils;

public static class Hashing
{
    // Cấu hình Argon2id được khuyến nghị.
    // Time Cost (T): Số lần lặp
    // Memory Cost (M): Kích thước bộ nhớ (KB)
    // Parallelism (P): Số luồng
    private const int TimeCost = 3;
    private const int MemoryCost = 65536; // 64MB
    private const int Parallelism = 4;

    private const int SaltLength = 16; // 16 bytes (128 bits)

    //hash secret with argon2id algorithm
    public static string Argon2IdHasherSecretKey(string secretKey)
    {
        if (string.IsNullOrEmpty(secretKey))
            throw new ArgumentNullException(nameof(secretKey), "Secret key cannot be null or empty.");

        // Tạo Salt ngẫu nhiên
        var salt = new byte[SaltLength];
        var random = new Random();
        random.NextBytes(salt);

        // Cấu hình Argon2
        var config = new Argon2Config
        {
            Type = Argon2Type.DataIndependentAddressing,
            Version = Argon2Version.Nineteen,
            TimeCost = TimeCost,
            MemoryCost = MemoryCost,
            Lanes = Parallelism,
            Threads = Parallelism,
            Salt = salt,
            Password = Encoding.UTF8.GetBytes(secretKey),
            HashLength = 16 // Độ dài Hash: 16 bytes (128 bits)
        };

        // Tạo Argon2Context và tính toán Hash
        using var argon2 = new Argon2(config);
        var hash = argon2.Hash();
        var hashString = config.EncodeString(hash.Buffer);
        return hashString;
    }

    public static bool VerifyArgon2IdHash(string secretKey, string hash)
    {
        if (string.IsNullOrEmpty(secretKey))
            throw new ArgumentNullException(nameof(secretKey), "Secret key cannot be null or empty.");

        if (string.IsNullOrEmpty(hash)) throw new ArgumentNullException(nameof(hash), "Hash cannot be null or empty.");

        return Argon2.Verify(hash, secretKey);
    }
}