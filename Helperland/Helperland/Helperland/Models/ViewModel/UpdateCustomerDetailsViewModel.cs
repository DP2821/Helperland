using System.ComponentModel.DataAnnotations;

namespace Helperland.Models.ViewModel
{
    public class UpdateCustomerDetailsViewModel
    {
        [Required]
        public string FirstName { get; set; } = null!;
        [Required]
        public string LastName { get; set; } = null!;
        [Required]
        public string Mobile { get; set; } = null!;
        public string DateOfBirth { get; set; } = null!;
    }
}