import { User } from "../models/userModel.js";
import { fetchFromOMDB } from "../services/omdbService.js";



export async function searchPerson(req, res) {
    const { query } = req.params;
  
    try {
      if (!query) {
        return res.status(400).json({ success: false, message: "Query parameter is required" });
      }
  
      // Fetch person details from OMDB
      const response = await fetchFromOMDB({ search: query });
  
      // Validate OMDB response
      if (!response || response.Response === "False" || !response.Search || response.Search.length === 0) {
        return res.status(404).json({ success: false, message: "No results found" });
      }
  
      const person = response.Search[0]; // Assume we're taking the first result
      console.log("Person details from OMDB:", person);
  
      // Update search history for the user
      if (req.user && req.user._id) {
        await User.findByIdAndUpdate(req.user._id, {
          $push: {
            searchHistory: {
              id: person.imdbID,
              image: person.Poster !== "N/A" ? person.Poster : "Placeholder image URL",
              title: person.Title,
              searchType: "person",
              createdAt: new Date(),
            },
          },
        });
      }
  
      // Send response
      res.status(200).json({ success: true, content: response.Search });
    } catch (error) {
      console.error("Error in searchPerson controller:", error.message);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }


export async function searchMovie(req, res) {
    const { query } = req.params;
  
    try {
      // Validate the query parameter
      if (!query) {
        return res.status(400).json({ success: false, message: "Query parameter is required" });
      }
  
      // Fetch movie details from OMDB
      const response = await fetchFromOMDB({ search: query });
  
      // Validate the OMDB response
      if (!response || response.Response === "False" || !response.Search || response.Search.length === 0) {
        return res.status(404).json({ success: false, message: "No results found" });
      }
  
      const movie = response.Search[0]; // Select the first result
      console.log("Movie details from OMDB:", movie);
  
      // Update search history for the user
      if (req.user && req.user._id) {
        await User.findByIdAndUpdate(req.user._id, {
          $push: {
            searchHistory: {
              id: movie.imdbID,
              image: movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/150", // Placeholder URL
              title: movie.Title,
              searchType: "movie",
              createdAt: new Date(),
            },
          },
        });
      } else {
        console.warn("No user information provided; search history not updated.");
      }
  
      // Send response
      res.status(200).json({ success: true, content: response.Search });
    } catch (error) {
      console.error("Error in searchMovie controller:", error.stack);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }



export async function searchTv(req, res) {
    const { query } = req.params;
  
    try {
      // Validate the query parameter
      if (!query) {
        return res.status(400).json({ success: false, message: "Query parameter is required" });
      }
  
      // Fetch TV details from OMDB
      const response = await fetchFromOMDB({ search: query });
  
      // Validate the OMDB response
      if (!response || response.Response === "False" || !response.Search || response.Search.length === 0) {
        return res.status(404).json({ success: false, message: "No results found" });
      }
  
      const tv = response.Search[0]; // Select the first result
      console.log("TV details from OMDB:", tv);
  
      // Update search history for the user
      if (req.user && req.user._id) {
        await User.findByIdAndUpdate(req.user._id, {
          $push: {
            searchHistory: {
              id: tv.imdbID,
              image: tv.Poster !== "N/A" ? tv.Poster : "https://via.placeholder.com/150", // Placeholder URL
              title: tv.Title,
              searchType: "tv",
              createdAt: new Date(),
            },
          },
        });
      } else {
        console.warn("No user information provided; search history not updated.");
      }
  
      // Send response
      res.status(200).json({ success: true, content: response.Search });
    } catch (error) {
      console.error("Error in searchTv controller:", error.message, error.stack);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }

export async function getSearchHistory(req, res){
    try {
		res.status(200).json({ success: true, content: req.user.searchHistory });
	} catch (error) {
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
}

export async function removeItemFromHistory(req, res){
    const {id} = req.params;
    // let { id } = req.params;
	// id = parseInt(id);
   // console.log(typeof id )

    try {
        await User.findByIdAndUpdate(req.user._id, {
            $pull: {
                searchHistory :{id: id},
            },
        });

        res.status(200).json({success : true, message : "Item removed from search history"});
    } catch(error){
        console.log("Error in removeItemFromSearchHistory controller: ", error.message);
        res.status(500).json({success : false, message : "Internal Server Error"});
    }
}