using Microsoft.EntityFrameworkCore;

namespace IALWCB
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddControllersWithViews();

            // Database Configuration
            var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
                                   ?? "Host=db;Database=ialwcb_db;Username=postgres;Password=fazbear_secret";
            builder.Services.AddDbContext<IALWCB.Data.ApplicationDbContext>(options =>
                options.UseNpgsql(connectionString));

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (!app.Environment.IsDevelopment())
            {
                app.UseExceptionHandler("/Home/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseRouting();

            app.UseAuthorization();

            // Auto-migrate database on startup
            using (var scope = app.Services.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<IALWCB.Data.ApplicationDbContext>();
                db.Database.EnsureCreated();
            }

            app.UseStaticFiles();

            app.MapControllerRoute(
                name: "default",
                pattern: "{controller=Game}/{action=Index}/{id?}");

            app.Run();
        }
    }
}
