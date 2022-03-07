using System.ComponentModel.DataAnnotations;

namespace Helperland.Models.ViewModel
{
    public class NewAddressBookServiceViewModel{

        public string StreetName { get; set; } = null!;
        
        public string HouseNumber { get; set; } = null!;

        public string PostalCode { get; set; } = null!;

        public string City { get; set; } = null!;

        public string Phone { get; set; } = null!;
    }
}