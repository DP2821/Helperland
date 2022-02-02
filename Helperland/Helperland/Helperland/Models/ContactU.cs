using System;
using System.Collections.Generic;

namespace Helperland.Models
{
    public partial class ContactU
    {
        public int ContactUsId { get; set; }
        public string Name { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string? Subject { get; set; }
        public string PhoneNumber { get; set; } = null!;
        public string Message { get; set; } = null!;
        public string? UploadFileName { get; set; }
        public DateTime? CreatedOn { get; set; }
        public int? CreatedBy { get; set; }
        public string? FileName { get; set; }
    }
}
