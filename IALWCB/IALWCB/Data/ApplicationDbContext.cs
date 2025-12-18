using Microsoft.EntityFrameworkCore;
using IALWCB.Models;

namespace IALWCB.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Product> Products { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // Seed initial data? Or leave it to JS? 
            // We'll leave product definition in JS for now as per plan, 
            // but we could seed here later if we move to dynamic rendering entirely from DB.
        }
    }
}
