import { fetchFromOMDB } from "../services/omdbService.js";

export async function getTrendingMovie(req, res) {
  try {
    // Define keywords to simulate "trending" searches
    const keywords = ["Action", "Drama", "Comedy", "Thriller", "Horror", "Sci-Fi", "Romance", "Adventure"];
    const searchKeyword = keywords[Math.floor(Math.random() * keywords.length)]; // Pick a random keyword

    // Fetch movies using the selected keyword
    const searchResponse = await fetchFromOMDB({ search: searchKeyword });

    // Ensure results exist
    if (!searchResponse || searchResponse.Response === "False" || !searchResponse.Search) {
      return res.status(404).json({ success: false, message: "No movies found" });
    }

    // Select a random movie from the search results
    const randomMovie = searchResponse.Search[Math.floor(Math.random() * searchResponse.Search.length)];

    // Fetch full details of the selected movie
    const movieDetails = await fetchFromOMDB({ title: randomMovie.Title });

    // Fetch the movie poster using the IMDB ID
    const posterUrl = `http://img.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&i=${movieDetails.imdbID}`;

    // Include the poster URL in the response
    res.json({
      success: true,
      content: {
        ...movieDetails,
        posterUrl,
      },
    });
  } catch (error) {
    console.error("Error fetching trending movie details:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function getMovieTrailers(req, res) {
  const { id } = req.params; // IMDB ID is expected as a parameter in the request
  try {
    if (!id) {
      return res.status(400).json({ success: false, message: "IMDB ID is required" });
    }

    // Use the IMDB ID to fetch the movie poster or other details
    const posterUrl = `http://img.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&i=${id}`;
    
    // Simulate trailer fetching (OMDB API does not provide trailer data directly)
    // Add any logic here to map `id` to trailers from another source, if applicable.
    const trailers = [
      { url: `${posterUrl}`, description: "Poster of the movie" },
    ];

    res.json({ success: true, trailers });
  } catch (error) {
    console.error("Error fetching movie trailers:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}



export async function getMovieDetails(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ success: false, message: "IMDB ID is required" });
    }

    // Fetch movie details using the provided IMDB ID
    const movieDetails = await fetchFromOMDB({ id });

    if (!movieDetails || movieDetails.Response === "False") {
      return res.status(404).json({ success: false, message: "Movie not found" });
    }

    // Construct poster URL
    const posterUrl = `http://img.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&i=${id}`;

    // Send response with movie details and poster URL
    res.json({
      success: true,
      movieDetails: {
        ...movieDetails,
        posterUrl,
      },
    });
  } catch (error) {
    console.error("Error fetching movie details:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}


export async function getSimilarMovies(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ success: false, message: "IMDB ID is required" });
    }

    // Fetch movie details to get genre and other related info
    const movieDetails = await fetchFromOMDB({ id });

    if (!movieDetails || movieDetails.Response === "False") {
      return res.status(404).json({ success: false, message: "Movie not found" });
    }

    // Extract a keyword (e.g., genre) to search for similar movies
    const genreKeyword = movieDetails.Genre.split(",")[0]; // Use the first genre as the keyword

    // Search for movies with the selected keyword
    const searchResponse = await fetchFromOMDB({ search: genreKeyword });

    if (!searchResponse || searchResponse.Response === "False" || !searchResponse.Search) {
      return res.status(404).json({ success: false, message: "No similar movies found" });
    }

    // Return a list of similar movies
    const similarMovies = searchResponse.Search.map((movie) => ({
      Title: movie.Title,
      Year: movie.Year,
      imdbID: movie.imdbID,
      Poster: movie.Poster !== "N/A" ? movie.Poster : "Placeholder for unavailable poster",
    }));

    res.json({
      success: true,
      similarMovies,
    });
  } catch (error) {
    console.error("Error fetching similar movies:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}




export async function getMoviesByCategory(req, res) {
  try {
    const { category } = req.params; // Category like 'Action', 'Comedy', etc.

    if (!category) {
      return res.status(400).json({ success: false, message: "Category is required" });
    }

    // Fetch movies using the category as a search keyword
    const searchResponse = await fetchFromOMDB({ search: category });

    // Ensure results exist
    if (!searchResponse || searchResponse.Response === "False" || !searchResponse.Search) {
      return res.status(404).json({ success: false, message: "No movies found for this category" });
    }

    // Format the results to include poster URLs
    const movies = searchResponse.Search.map(movie => ({
      title: movie.Title,
      year: movie.Year,
      imdbID: movie.imdbID,
      posterUrl: `http://img.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&i=${movie.imdbID}`,
    }));

    res.json({ success: true, movies });
  } catch (error) {
    console.error("Error fetching movies by category:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
