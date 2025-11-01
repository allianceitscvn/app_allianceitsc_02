namespace ChatApp.Domain.Common;

public class PagingRequest
{
    public int PageIndex { get; set; } = 1;
    public int PageSize { get; set; } = 50;
}

public class PagingResponse<T>(int totalCount, List<T> data, int pageIndex = 1, int pageSize = 50)
{
    public int PageIndex { get; set; } = pageIndex;
    public int PageSize { get; set; } = pageSize;

    public int TotalPages
    {
        get
        {
            if (PageSize == 0) return 0;
            return (int)Math.Ceiling((double)TotalCount / PageSize);
        }
    }
    private int TotalCount { get; set; } = totalCount;
    public List<T> Data { get; set; } = data;
}