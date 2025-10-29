using FluentValidation;

namespace ChatApp.Application.Features.CreateClient;

public class CreateClientValidation : AbstractValidator<CreateClientCommand>
{
    public CreateClientValidation()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Client name is required.")
            .MaximumLength(100).WithMessage("Client name must not exceed 100 characters.");
        RuleFor(x => x.Scopes)
            .NotEmpty().WithMessage("At least one scope is required.");
        RuleFor(x => x.Secret)
            .NotEmpty().WithMessage("Client secret is required.");
    }
}