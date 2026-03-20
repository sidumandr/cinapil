using Microsoft.EntityFrameworkCore;
using Cinapil.API.Models;

namespace Cinapil.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<UserMovie> UserMovies => Set<UserMovie>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(u => u.Email).IsUnique();
            entity.HasIndex(u => u.Username).IsUnique();
        });

        modelBuilder.Entity<UserMovie>(entity =>
        {
            entity.HasIndex(um => new { um.UserId, um.MovieId }).IsUnique();

            entity.HasOne(um => um.User)
                  .WithMany(u => u.UserMovies)
                  .HasForeignKey(um => um.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
