using System.Text.Json;

namespace Cinapil.API.Services;

public class TmdbService
{
    private readonly HttpClient _http;
    private readonly string _apiKey;
    private readonly string _baseUrl = "https://api.themoviedb.org/3";

    public TmdbService(HttpClient http, IConfiguration config)
    {
        _http = http;
        _apiKey = config["Tmdb:ApiKey"]!;
    }

    public async Task<JsonElement> SearchMoviesAsync(string query)
    {
        var res = await _http.GetAsync(
            $"{_baseUrl}/search/movie?api_key={_apiKey}&query={Uri.EscapeDataString(query)}&include_adult=false&language=tr-TR");
        res.EnsureSuccessStatusCode();
        return await ParseAsync(res);
    }

    public async Task<JsonElement> GetPopularAsync()
    {
        var res = await _http.GetAsync($"{_baseUrl}/movie/popular?api_key={_apiKey}&language=tr-TR");
        res.EnsureSuccessStatusCode();
        return await ParseAsync(res);
    }

    public async Task<JsonElement> GetTrendingAsync()
    {
        var res = await _http.GetAsync($"{_baseUrl}/trending/movie/week?api_key={_apiKey}&language=tr-TR");
        res.EnsureSuccessStatusCode();
        return await ParseAsync(res);
    }

    public async Task<JsonElement> GetMovieDetailsAsync(int id)
    {
        var res = await _http.GetAsync($"{_baseUrl}/movie/{id}?api_key={_apiKey}&language=tr-TR");
        res.EnsureSuccessStatusCode();
        return await ParseAsync(res);
    }

    public async Task<JsonElement> GetMovieCreditsAsync(int id)
    {
        var res = await _http.GetAsync($"{_baseUrl}/movie/{id}/credits?api_key={_apiKey}&language=tr-TR");
        res.EnsureSuccessStatusCode();
        return await ParseAsync(res);
    }

    private static async Task<JsonElement> ParseAsync(HttpResponseMessage res)
    {
        var json = await res.Content.ReadAsStringAsync();
        return JsonSerializer.Deserialize<JsonElement>(json);
    }
}