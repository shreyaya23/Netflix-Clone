import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { Info, Play } from "lucide-react";
import useGetTrendingContent from "../../hooks/useGetTrendingContent"; // Update or replace with OMDb-compatible hook
import { MOVIE_CATEGORIES, TV_CATEGORIES } from "../../utils/constants";
import { useContentStore } from "../../store/content";
import MovieSlider from "../../components/MovieSlider.jsx"; // Ensure this is compatible with OMDb
import { useState } from "react";

// Constants for OMDb
const API_KEY = "f2a6d09b"; // Replace with your OMDb API key

const fetchPosterUrl = (imdbID) =>
    `https://img.omdbapi.com/?i=${imdbID}&h=500&apikey=${API_KEY}`;

const HomeScreen = () => {
    const { trendingContent } = useGetTrendingContent(); // Update this hook to fetch trending content using OMDb API
    const { contentType } = useContentStore();
    const [imgLoading, setImgLoading] = useState(true);

    if (!trendingContent)
        return (
            <div className='h-screen text-white relative'>
                <Navbar />
                <div className='absolute top-0 left-0 w-full h-full bg-black/70 flex items-center justify-center -z-10 shimmer' />
            </div>
        );

    return (
        <>
            <div className='relative h-screen text-white'>
                <Navbar />

                {/* Loading Indicator for Image */}
                {imgLoading && (
                    <div className='absolute top-0 left-0 w-full h-full bg-black/70 flex items-center justify-center shimmer -z-10' />
                )}

                {/* Hero Image */}
                <img
                    src={fetchPosterUrl(trendingContent?.imdbID)}
                    alt='Hero img'
                    className='absolute top-0 left-0 w-full h-full object-cover -z-50'
                    onLoad={() => {
                        setImgLoading(false);
                    }}
                />

                <div className='absolute top-0 left-0 w-full h-full bg-black/50 -z-50' aria-hidden='true' />

                <div className='absolute top-0 left-0 w-full h-full flex flex-col justify-center px-8 md:px-16 lg:px-32'>
                    <div
                        className='bg-gradient-to-b from-black via-transparent to-transparent 
                        absolute w-full h-full top-0 left-0 -z-10'
                    />

                    <div className='max-w-2xl'>
                        <h1 className='mt-4 text-6xl font-extrabold text-balance'>
                            {trendingContent?.Title}
                        </h1>
                        <p className='mt-2 text-lg'>
                            {trendingContent?.Year} | {trendingContent?.Rated || "N/A"}
                        </p>

                        <p className='mt-4 text-lg'>
                            {trendingContent?.Plot?.length > 200
                                ? trendingContent?.Plot.slice(0, 200) + "..."
                                : trendingContent?.Plot}
                        </p>
                    </div>

                    <div className='flex mt-8'>
                        <Link
                            to={`/watch/${trendingContent?.imdbID}`}
                            className='bg-white hover:bg-white/80 text-black font-bold py-2 px-4 rounded mr-4 flex
                             items-center'
                        >
                            <Play className='size-6 mr-2 fill-black' />
                            Play
                        </Link>

                        <Link
                            to={`/watch/${trendingContent?.imdbID}`}
                            className='bg-gray-500/70 hover:bg-gray-500 text-white py-2 px-4 rounded flex items-center'
                        >
                            <Info className='size-6 mr-2' />
                            More Info
                        </Link>
                    </div>
                </div>
            </div>

            {/* Movie/TV Sliders */}
            <div className='flex flex-col gap-10 bg-black py-10'>
                {contentType === "movie"
                    ? MOVIE_CATEGORIES.map((category) => (
                          <MovieSlider key={category.label} category={category.query} />
                      ))
                    : TV_CATEGORIES.map((category) => (
                          <MovieSlider key={category.label} category={category.query} />
                      ))}
            </div>
        </>
    );
};
export default HomeScreen;
