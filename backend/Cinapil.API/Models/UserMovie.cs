using System.ComponentModel.DataAnnotations;

namespace Cinapil.API.Models;

public class UserMovie
{
    public int Id { get; set; }

    public int UserId { get; set; }
    public User User { get; set; } = null!;

    public int MovieId { get; set; }

    [MaxLength(255)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(255)]
    public string? OriginalTitle { get; set; }

    [MaxLength(255)]
    public string? PosterPath { get; set; }

    [MaxLength(255)]
    public string? BackdropPath { get; set; }

    public string? Overview { get; set; }

    public double VoteAverage { get; set; }

    [MaxLength(20)]
    public string? ReleaseDate { get; set; }

    [Required]
    [MaxLength(10)]
    public string ListType { get; set; } = "watchlist"; // "watchlist" or "watched"
}
