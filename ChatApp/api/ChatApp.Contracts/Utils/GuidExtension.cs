using System.Security.Cryptography;

namespace ChatApp.Contracts.Utils;

public static class GuidExtensions
{
    public static Guid CreateVersion7()
    {
        return CreateVersion7(DateTimeOffset.UtcNow);
    }

    public static Guid CreateVersion7(DateTimeOffset timestamp)
    {
        // Lấy 10 byte ngẫu nhiên an toàn
        // 2 byte đầu cho rand_a (bytes 6-7)
        // 8 byte sau cho rand_b (bytes 8-15)
        byte[] randomBytes = new byte[10];
        RandomNumberGenerator.Fill(randomBytes);

        long unixTimeMs = timestamp.ToUnixTimeMilliseconds();
        byte[] bytes = new byte[16];

        // 1. Timestamp (48 bits / 6 bytes) - Bytes 0-5
        // Đặt theo thứ tự Big-Endian (yêu cầu của RFC)
        bytes[0] = (byte)(unixTimeMs >> 40);
        bytes[1] = (byte)(unixTimeMs >> 32);
        bytes[2] = (byte)(unixTimeMs >> 24);
        bytes[3] = (byte)(unixTimeMs >> 16);
        bytes[4] = (byte)(unixTimeMs >> 8);
        bytes[5] = (byte)(unixTimeMs);

        // 2. Version + rand_a (16 bits / 2 bytes) - Bytes 6-7
        // Ghi đè 4 bit cao nhất của byte 6 với Version (0111)
        bytes[6] = (byte)((randomBytes[0] & 0x0F) | 0x70); // 0111xxxx
        bytes[7] = randomBytes[1]; // 12-bit ngẫu nhiên (phần rand_a)

        // 3. Variant + rand_b (64 bits / 8 bytes) - Bytes 8-15
        // Ghi đè 2 bit cao nhất của byte 8 với Variant (10)
        bytes[8] = (byte)((randomBytes[2] & 0x3F) | 0x80); // 10xxxxxx

        // Copy 7 byte ngẫu nhiên còn lại (phần rand_b)
        bytes[9] = randomBytes[3];
        bytes[10] = randomBytes[4];
        bytes[11] = randomBytes[5];
        bytes[12] = randomBytes[6];
        bytes[13] = randomBytes[7];
        bytes[14] = randomBytes[8];
        bytes[15] = randomBytes[9];

        // 4. [RẤT QUAN TRỌNG] Xử lý Endianness của .NET
        // .NET Guid(byte[]) constructor sẽ đảo ngược 3 nhóm byte đầu
        // Ta phải đảo ngược chúng trước để "hủy" đi thao tác đó.
        // Chỉ làm điều này trên .NET, các nền tảng khác (như Java, Postgre)
        // thường không có hành vi kỳ lạ này.

        // Đảo data 1 (bytes 0-3)
        Swap(bytes, 0, 3);
        Swap(bytes, 1, 2);

        // Đảo data 2 (bytes 4-5)
        Swap(bytes, 4, 5);

        // Đảo data 3 (bytes 6-7)
        Swap(bytes, 6, 7);

        return new Guid(bytes);
    }

    private static void Swap(byte[] bytes, int a, int b)
    {
        (bytes[a], bytes[b]) = (bytes[b], bytes[a]);
    }
}