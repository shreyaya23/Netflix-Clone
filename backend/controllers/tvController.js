import { fetchFromOMDB } from "../services/omdbService.js";

export async function getTrendingTv(req, res) {
  try {
    const keywords = ["Action", "Drama", "Comedy", "Thriller", "Horror", "Sci-Fi", "Romance", "Adventure"];
    const searchKeyword = keywords[Math.floor(Math.random() * keywords.length)];
    const searchResponse = await fetchFromOMDB({ search: searchKeyword });

    if (!searchResponse || searchResponse.Response === "False" || !searchResponse.Search) {
      return res.status(404).json({ success: false, message: "No TV shows found" });
    }

    const randomTv = searchResponse.Search[Math.floor(Math.random() * searchResponse.Search.length)];
    const tvDetails = await fetchFromOMDB({ id: randomTv.imdbID });

    res.json({
      success: true,
      content: {
        ...tvDetails,
        posterUrl: `http://img.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&i=${tvDetails.imdbID}`,
      },
    });
  } catch (error) {
    console.error("Error fetching trending TV shows:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function getTvTrailers(req, res) {
  const { id } = req.params;
  try {
    if (!id) {
      return res.status(400).json({ success: false, message: "IMDB ID is required" });
    }

    const posterUrl = `http://img.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&i=${id}`;
    const trailers = [{ url: posterUrl, description: "Poster of the TV Show" }];

    res.json({ success: true, trailers });
  } catch (error) {
    console.error("Error fetching TV show trailers:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function getTvDetails(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ success: false, message: "IMDB ID is required" });
    }

    const tvDetails = await fetchFromOMDB({ id });
    if (!tvDetails || tvDetails.Response === "False") {
      return res.status(404).json({ success: false, message: "TV show not found" });
    }

    res.json({
      success: true,
      tvDetails: {
        ...tvDetails,
        posterUrl: `http://img.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&i=${id}`,
      },
    });
  } catch (error) {
    console.error("Error fetching TV show details:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function getSimilarTv(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ success: false, message: "IMDB ID is required" });
    }

    const tvDetails = await fetchFromOMDB({ id });
    if (!tvDetails || tvDetails.Response === "False") {
      return res.status(404).json({ success: false, message: "TV show not found" });
    }

    const genreKeyword = tvDetails.Genre ? tvDetails.Genre.split(",")[0].trim() : "Drama";
    const searchResponse = await fetchFromOMDB({ search: genreKeyword });

    if (!searchResponse || searchResponse.Response === "False" || !searchResponse.Search) {
      return res.status(404).json({ success: false, message: "No similar TV shows found" });
    }

    const similartv = searchResponse.Search.map((tv) => ({
      Title: tv.Title,
      Year: tv.Year,
      imdbID: tv.imdbID,
      Poster: tv.Poster !== "N/A" ? tv.Poster : "https://via.placeholder.com/300x450?text=No+Poster+Available",
    }));

    res.json({ success: true, similartv });
  } catch (error) {
    console.error("Error fetching similar TV shows:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function getTvByCategory(req, res) {
  try {
    const { category } = req.params;

    if (!category) {
      return res.status(400).json({ success: false, message: "Category is required" });
    }

    const searchResponse = await fetchFromOMDB({ search: category });
    if (!searchResponse || searchResponse.Response === "False" || !searchResponse.Search) {
      return res.status(404).json({ success: false, message: "No TV shows found for this category" });
    }

    const tv = searchResponse.Search.map((tv) => ({
      title: tv.Title,
      year: tv.Year,
      imdbID: tv.imdbID,
      posterUrl: `http://img.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&i=${tv.imdbID}`,
    }));

    res.json({ success: true, tv });
  } catch (error) {
    console.error("Error fetching TV shows by category:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
