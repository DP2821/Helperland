using System.ComponentModel.DataAnnotations;

namespace Helperland.Models.ViewModel
{
    public class BookServiceViewModel
    {
        [Required]
        [Display(Name ="Postal code")]
        [MinLength(6, ErrorMessage = "Postal code should be 6 digit")]
        [MaxLength(6, ErrorMessage = "Postal code should be 6 digit")]
        public int ZipCode { get; set; }

        [Required]
        public DateOnly Date { get; set; }

        [Required]
        public TimeOnly Time { get; set; }

        [Required]
        public double ServiceHours { get; set; }

        public List<int>? ExtraServices { get; set; }
       
        public string? Comments { get; set; }

        public bool HasPets { get; set; }

        public List<UserAddress>? CustomerAddresses { get; set; }

        public List<FavoriteServiceProvider>? FavoriteServiceProvider { get; set; }

        public int? ServiceProviderId { get; set; }

    }

    public class FavoriteServiceProvider
    {
        public int? Id { get;}
        public string? Name { get;}

    }
}
