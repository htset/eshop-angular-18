using System.ComponentModel.DataAnnotations;

namespace eshop_angular_18.Server.Models
{
  public class CreditCardDTO : IValidatableObject
  {
    [Required]
    public int Id { get; set; }
    [Required]
    [CreditCard]
    public string? CardNumber { get; set; }
    [Required]
    public string? HolderName { get; set; }
    [Required]
    [RegularExpression(@"^[0-9]{3}$", ErrorMessage = "CVV consists of 3 numbers")]
    public string? Code { get; set; }
    [Required]
    [Range(1, 12)]
    public int ExpiryMonth { get; set; }
    [Required]
    [ExpiryYear]
    public int ExpiryYear { get; set; }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
      if (ExpiryYear < DateTime.Now.Year 
        || (ExpiryYear == DateTime.Now.Year && ExpiryMonth < DateTime.Now.Month))
      {
        yield return new ValidationResult(
            $"Credit Card has expired",
            new[] { nameof(ExpiryYear) });
      }
    }
  }
}
