using FluentValidation;
using FluentValidation.Results;
using Microsoft.AspNetCore.Mvc.Filters;

namespace ChatApp.Application.Middlewares;

public class ModelStateToValidationExceptionFilter : IActionFilter
{
    public void OnActionExecuting(ActionExecutingContext context)
    {
        if (!context.ModelState.IsValid)
        {
            var failures = context.ModelState
                .Where(kvp => kvp.Value?.Errors.Count > 0)
                .SelectMany(kvp =>
                    kvp.Value!.Errors.Select(e =>
                        new ValidationFailure(kvp.Key, e.ErrorMessage)))
                .ToList();

            throw new ValidationException(failures);
        }
    }

    public void OnActionExecuted(ActionExecutedContext context)
    {
    }
}