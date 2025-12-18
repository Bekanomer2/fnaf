using System.ComponentModel.DataAnnotations;

namespace IALWCB.Models
{
    public class Product
    {
        [Key]
        public string Id { get; set; } = string.Empty; // e.g., "pizza_chili"
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty; // pizza, plush, merch, key
    }
}
