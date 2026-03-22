using Microsoft.AspNetCore.Mvc;
using Cinapil.API.Services;

namespace Cinapil.API.Controllers;

[ApiController]
[Route("api/tmdb")]
public class TmdbController : ControllerBase
{
    private readonly TmdbService _tmdb;

    public TmdbController(TmdbService tmdb) => _tmdb = tmdb;

    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] string query)
    {
        if (string.IsNullOrWhiteSpace(query)) return BadRequest();
        var result = await _tmdb.SearchMoviesAsync(query);
        return Ok(result);
    }

    [HttpGet("popular")]
    public async Task<IActionResult> Popular()
    {
        var result = await _tmdb.GetPopularAsync();
        return Ok(result);
    }

    [HttpGet("trending")]
    public async Task<IActionResult> Trending()
    {
        var result = await _tmdb.GetTrendingAsync();
        return Ok(result);
    }

    [HttpGet("movies/{id}")]
    public async Task<IActionResult> Details(int id)
    {
        var result = await _tmdb.GetMovieDetailsAsync(id);
        return Ok(result);
    }

    [HttpGet("movies/{id}/credits")]
    public async Task<IActionResult> Credits(int id)
    {
        var result = await _tmdb.GetMovieCreditsAsync(id);
        return Ok(result);
    }
}