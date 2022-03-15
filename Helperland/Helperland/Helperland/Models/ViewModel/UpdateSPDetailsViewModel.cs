using System.ComponentModel.DataAnnotations;

namespace Helperland.Models.ViewModel
{
    public class UpdateSPDetailsViewModel
    {
        [Required]
        public string FirstName { get; set; } = null!;
        [Required]
        public string LastName { get; set; } = null!;
        [Required]
        public string Mobile { get; set; } = null!;
        public string DateOfBirth { get; set; } = null!;

        public int Gender { get; set; }
        public string AddressLine1 { get; set; } = null!;
        public string AddressLine2 { get; set; } = null!;
        public string ZipCode { get; set; } = null!;
        public string City { get; set; } = null!;
    }
}