using System.ComponentModel.DataAnnotations;

namespace Helperland.Models.ViewModel
{
    public class NewAddressBookServiceViewModel{

        public string? StreetName { get; set; }
        
        public string? HouseNumber { get; set; }

        public string? PostalCode { get; set; }

        public string? City { get; set; }

        public string? Phone { get; set; }
    }
}