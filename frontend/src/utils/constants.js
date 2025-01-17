export const SMALL_IMG_BASE_URL = "https://img.omdbapi.com/?i=";
export const API_KEY = "f2a6d09b"; // Replace with your OMDb API key
export const SMALL_IMG_SIZE = "&h=500"; // Parameter for small image height

export const MOVIE_CATEGORIES = [
    { label: "Now Playing", query: "current" },
    { label: "Top Rated", query: "top" },
    { label: "Popular", query: "popular" },
    { label: "Upcoming", query: "upcoming" }
];

export const TV_CATEGORIES = [
    { label: "Airing Today", query: "airing_today" },
    { label: "On The Air", query: "on_the_air" },
    { label: "Popular", query: "popular" },
    { label: "Top Rated", query: "top" }
];

export const fetchPosterUrl = (imdbID) =>
    `${SMALL_IMG_BASE_URL}${imdbID}${SMALL_IMG_SIZE}&apikey=${API_KEY}`;

export const fetchOMDbUrl = (query, type = "movie") =>
    `https://www.omdbapi.com/?s=${query}&type=${type}&apikey=${API_KEY}`;
