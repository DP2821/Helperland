using System;
using System.Collections.Generic;

namespace Helperland.Models
{
    public partial class City
    {
        public City()
        {
            Zipcodes = new HashSet<Zipcode>();
        }

        public int Id { get; set; }
        public string CityName { get; set; } = null!;
        public int StateId { get; set; }

        public virtual State State { get; set; } = null!;
        public virtual ICollection<Zipcode> Zipcodes { get; set; }
    }
}
