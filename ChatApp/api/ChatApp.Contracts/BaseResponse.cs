using System.Net;

namespace WebApplication.Contracts;

public class BaseResponse<T>
{
    public HttpStatusCode StatusCode { get; set; }
    public string? Message { get; set; }
    public T? Data { get; set; }
    public bool IsError => StatusCode != HttpStatusCode.OK && StatusCode != HttpStatusCode.Created;

    public static BaseResponse<T> Success(T data, string message = "Successfully",
        HttpStatusCode statusCode = HttpStatusCode.OK)
    {
        return new BaseResponse<T>
        {
            StatusCode = statusCode,
            Message = message,
            Data = data
        };
    }

    public static BaseResponse<T> Error(string message = "Error", HttpStatusCode statusCode = HttpStatusCode.BadRequest)
    {
        return new BaseResponse<T>
        {
            StatusCode = statusCode,
            Message = message,
            Data = default
        };
    }
}