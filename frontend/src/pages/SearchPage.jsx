import { useState } from "react";
import Navbar from "../components/Navbar.jsx";
import { Search } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

const OMDB_API_KEY = "f2a6d09b"; 
const OMDB_BASE_URL = "https://www.omdbapi.com/";

const SearchPage = () => {
    const [activeTab, setActiveTab] = useState("movie");
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState([]);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        setResults([]);
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchTerm.trim()) {
            toast.error("Please enter a search term.");
            return;
        }

        try {
            const typeMap = {
                movie: "movie",
                tv: "series",
                person: null, 
            };

            const type = typeMap[activeTab];
            if (activeTab === "person") {
                toast.error("OMDb API does not support searching for persons.");
                return;
            }

            const res = await axios.get(OMDB_BASE_URL, {
                params: {
                    apikey: OMDB_API_KEY,
                    s: searchTerm,
                    type, 
                },
            });

            if (res.data.Response === "True") {
                setResults(res.data.Search || []);
            } else {
                toast.error(res.data.Error || "No results found.");
            }
        } catch (error) {
            toast.error("An error occurred. Please try again later.");
        }
    };

    return (
        <div className="bg-black min-h-screen text-white">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-center gap-3 mb-4">
                    <button
                        className={`py-2 px-4 rounded ${
                            activeTab === "movie" ? "bg-red-600" : "bg-gray-800"
                        } hover:bg-red-700`}
                        onClick={() => handleTabClick("movie")}
                    >
                        Movies
                    </button>
                    <button
                        className={`py-2 px-4 rounded ${
                            activeTab === "tv" ? "bg-red-600" : "bg-gray-800"
                        } hover:bg-red-700`}
                        onClick={() => handleTabClick("tv")}
                    >
                        TV Shows
                    </button>
                    <button
                        className={`py-2 px-4 rounded ${
                            activeTab === "person" ? "bg-red-600" : "bg-gray-800"
                        } hover:bg-red-700`}
                        onClick={() => handleTabClick("person")}
                    >
                        Person
                    </button>
                </div>

                <form
                    className="flex gap-2 items-stretch mb-8 max-w-2xl mx-auto"
                    onSubmit={handleSearch}
                >
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={"Search for a " + activeTab}
                        className="w-full p-2 rounded bg-gray-800 text-white"
                    />
                    <button className="bg-red-600 hover:bg-red-700 text-white p-2 rounded">
                        <Search className="size-6" />
                    </button>
                </form>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {results.map((result) => (
                        <div key={result.imdbID} className="bg-gray-800 p-4 rounded">
                            <img
                                src={result.Poster !== "N/A" ? result.Poster : "/placeholder.jpg"}
                                alt={result.Title}
                                className="w-full h-auto rounded"
                            />
                            <h2 className="mt-2 text-xl font-bold">{result.Title}</h2>
                            <p className="text-sm text-gray-400">{result.Year}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SearchPage;
