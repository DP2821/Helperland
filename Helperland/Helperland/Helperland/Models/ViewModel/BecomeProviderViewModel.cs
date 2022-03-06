using System.ComponentModel.DataAnnotations;

namespace Helperland.Models.ViewModel
{
    public class BecomeProviderViewModel
    {
        [Required]
        [Display(Name = "First name")]
        public string? FirstName { get; set; }

        [Required]
        [Display(Name = "Last name")]
        public string? LastName { get; set; }

        [Required]
        [Display(Name = "E-mail")]
        [EmailAddress]
        public string? Email { get; set; }

        [Required]
        [Display(Name = "Phone number")]
        [DataType(DataType.PhoneNumber)]
        public string? PhoneNumber { get; set; }

        [Required]
        [Display(Name = "Password")]
        [DataType(DataType.Password)]
        [RegularExpression("^((?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])|(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[^a-zA-Z0-9])|(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[^a-zA-Z0-9])|(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^a-zA-Z0-9])).{8,}$", ErrorMessage = "Passwords must be at least 8 characters and contain at 3 of 4 of the following: upper case (A-Z), lower case (a-z), number (0-9) and special character (e.g. !@#$%^&*)")]
        public string? Password { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "Confirm password")]
        [Compare("Password", ErrorMessage = "The passwords do not match.")]
        public string? ConfirmPassword { get; set; }

        [Required]
        public bool IsTermsAndCondition { get; set; }

        [Required]
        public bool IsRobot { get; set; }
    }
}
