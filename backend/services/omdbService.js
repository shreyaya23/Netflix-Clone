import axios from "axios";
import { ENV_VARS } from "../config/envVars.js";

export const fetchFromOMDB = async ({ title, search, id }) => {
  const OMDB_API_KEY = process.env.OMDB_API_KEY || ENV_VARS.OMDB_API_KEY;
  let url;

  if (title) {
    url = `http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&t=${encodeURIComponent(title)}`;
  } else if (search) {
    url = `http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(search)}`;
  } else if (id) {
    url = `http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${encodeURIComponent(id)}`;
  } else {
    throw new Error("Either 'title', 'search', or 'imdbID' parameter must be provided");
  }

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching data from OMDB:", error.response?.data || error.message);
    throw new Error("Failed to fetch data from OMDB.");
  }
};
