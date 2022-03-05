using System.ComponentModel.DataAnnotations;

namespace Helperland.Models.ViewModel
{
    public class UpdateCustomerDetailsViewModel
    {
        [Required]
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }    
        [Required]
        public string Mobile { get; set; }
        public string DateOfBirth { get; set; }
    }
}