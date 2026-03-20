using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Cinapil.API.Data;
using Cinapil.API.DTOs;
using Cinapil.API.Models;

namespace Cinapil.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MoviesController : ControllerBase
{
    private readonly AppDbContext _db;

    public MoviesController(AppDbContext db)
    {
        _db = db;
    }

    private int GetUserId() =>
        int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

    // GET /api/movies/watchlist
    [HttpGet("watchlist")]
    public async Task<ActionResult> GetWatchlist()
    {
        var movies = await _db.UserMovies
            .Where(um => um.UserId == GetUserId() && um.ListType == "watchlist")
            .OrderByDescending(um => um.Id)
            .ToListAsync();

        return Ok(movies.Select(MapToResponse));
    }

    // GET /api/movies/watched
    [HttpGet("watched")]
    public async Task<ActionResult> GetWatched()
    {
        var movies = await _db.UserMovies
            .Where(um => um.UserId == GetUserId() && um.ListType == "watched")
            .OrderByDescending(um => um.Id)
            .ToListAsync();

        return Ok(movies.Select(MapToResponse));
    }

    // POST /api/movies/watchlist
    [HttpPost("watchlist")]
    public async Task<ActionResult> AddToWatchlist(MovieDto dto)
    {
        return await AddMovie(dto, "watchlist");
    }

    // POST /api/movies/watched
    [HttpPost("watched")]
    public async Task<ActionResult> AddToWatched(MovieDto dto)
    {
        return await AddMovie(dto, "watched");
    }

    // DELETE /api/movies/watchlist/{movieId}
    [HttpDelete("watchlist/{movieId}")]
    public async Task<ActionResult> RemoveFromWatchlist(int movieId)
    {
        return await RemoveMovie(movieId, "watchlist");
    }

    // DELETE /api/movies/watched/{movieId}
    [HttpDelete("watched/{movieId}")]
    public async Task<ActionResult> RemoveFromWatched(int movieId)
    {
        return await RemoveMovie(movieId, "watched");
    }

    // PUT /api/movies/move-to-watched/{movieId}
    [HttpPut("move-to-watched/{movieId}")]
    public async Task<ActionResult> MoveToWatched(int movieId)
    {
        return await MoveMovie(movieId, "watchlist", "watched");
    }

    // PUT /api/movies/move-to-watchlist/{movieId}
    [HttpPut("move-to-watchlist/{movieId}")]
    public async Task<ActionResult> MoveToWatchlist(int movieId)
    {
        return await MoveMovie(movieId, "watched", "watchlist");
    }

    // --- Helper methods ---

    private async Task<ActionResult> AddMovie(MovieDto dto, string listType)
    {
        var userId = GetUserId();
        var existing = await _db.UserMovies
            .FirstOrDefaultAsync(um => um.UserId == userId && um.MovieId == dto.MovieId);

        if (existing != null)
            return BadRequest(new { message = "Bu film zaten listenizde." });

        var movie = new UserMovie
        {
            UserId = userId,
            MovieId = dto.MovieId,
            Title = dto.Title,
            OriginalTitle = dto.OriginalTitle,
            PosterPath = dto.PosterPath,
            BackdropPath = dto.BackdropPath,
            Overview = dto.Overview,
            VoteAverage = dto.VoteAverage,
            ReleaseDate = dto.ReleaseDate,
            ListType = listType,
        };

        _db.UserMovies.Add(movie);
        await _db.SaveChangesAsync();

        return Ok(MapToResponse(movie));
    }

    private async Task<ActionResult> RemoveMovie(int movieId, string listType)
    {
        var userId = GetUserId();
        var movie = await _db.UserMovies
            .FirstOrDefaultAsync(um => um.UserId == userId && um.MovieId == movieId && um.ListType == listType);

        if (movie == null)
            return NotFound(new { message = "Film bulunamadı." });

        _db.UserMovies.Remove(movie);
        await _db.SaveChangesAsync();

        return Ok(new { message = "Film listeden kaldırıldı." });
    }

    private async Task<ActionResult> MoveMovie(int movieId, string from, string to)
    {
        var userId = GetUserId();
        var movie = await _db.UserMovies
            .FirstOrDefaultAsync(um => um.UserId == userId && um.MovieId == movieId && um.ListType == from);

        if (movie == null)
            return NotFound(new { message = "Film bulunamadı." });

        movie.ListType = to;
        await _db.SaveChangesAsync();

        return Ok(MapToResponse(movie));
    }

    private static object MapToResponse(UserMovie um) => new
    {
        id = um.MovieId,
        title = um.Title,
        original_title = um.OriginalTitle,
        poster_path = um.PosterPath,
        backdrop_path = um.BackdropPath,
        overview = um.Overview,
        vote_average = um.VoteAverage,
        release_date = um.ReleaseDate,
    };
}
