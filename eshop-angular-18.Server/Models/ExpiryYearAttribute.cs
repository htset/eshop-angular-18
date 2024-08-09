using System.ComponentModel.DataAnnotations;

namespace eshop_angular_18.Server.Models
{
  public class ExpiryYearAttribute : ValidationAttribute
  {
    protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
    {
      int currentYear = DateTime.Now.Year;
      if (value != null 
        && (int)value >= currentYear && (int)value <= currentYear + 4)
      {
        return ValidationResult.Success;
      }

      return new ValidationResult(ErrorMessage 
        ?? "Expiration year is out of range (" 
            + currentYear + "-" + currentYear + 4 + ")");
    }
  }
}
