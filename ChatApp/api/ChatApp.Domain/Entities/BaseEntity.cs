namespace ChatApp.Domain.Entities;

public class BaseEntity
{
    public int Id { get; set; }
    public int CreatedBy { get; set; }
    public DateTime CreatedAt { get; set; }
    public int UpdatedBy { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class DeletedEntity : BaseEntity
{
    public bool IsDeleted { get; set; }
    public int DeletedBy { get; set; }
}