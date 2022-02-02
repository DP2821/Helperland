using System;
using System.Collections.Generic;

namespace Helperland.Models
{
    public partial class UserAddress
    {
        public int AddressId { get; set; }
        public int UserId { get; set; }
        public string AddressLine1 { get; set; } = null!;
        public string? AddressLine2 { get; set; }
        public string City { get; set; } = null!;
        public string? State { get; set; }
        public string PostalCode { get; set; } = null!;
        public bool IsDefault { get; set; }
        public bool IsDeleted { get; set; }
        public string? Mobile { get; set; }
        public string? Email { get; set; }

        public virtual User User { get; set; } = null!;
    }
}
