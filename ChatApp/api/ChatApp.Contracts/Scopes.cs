using System.Reflection.Metadata;

namespace ChatApp.Contracts;

public static class Scopes
{
    public static class ExternalConversation
    {
        public static string Read = $"{MetaData.ProductName}.{MetaData.ExternalConversation}.read";
        public static string Write = $"{MetaData.ProductName}.{MetaData.ExternalConversation}.create";
        public static string Delete = $"{MetaData.ProductName}.{MetaData.ExternalConversation}.delete";
        public static string Update = $"{MetaData.ProductName}.{MetaData.ExternalConversation}.update";
    }
}