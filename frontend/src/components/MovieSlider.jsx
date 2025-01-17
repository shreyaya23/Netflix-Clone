import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { API_KEY, SMALL_IMG_BASE_URL, SMALL_IMG_SIZE } from "../utils/constants.js";
import { ChevronLeft, ChevronRight } from "lucide-react";

const MovieSlider = ({ category }) => {
    const [content, setContent] = useState([]);
    const [showArrows, setShowArrows] = useState(false);

    const sliderRef = useRef(null);

    // Format category name for display
    const formattedCategoryName =
        category.replaceAll("_", " ")[0].toUpperCase() + category.replaceAll("_", " ").slice(1);

    useEffect(() => {
        const getContent = async () => {
            try {
                const API_KEY = "f2a6d09b"; // Load API key from environment variable
                const res = await axios.get(
                    `https://www.omdbapi.com/?s=${category}&type=movie&apikey=${API_KEY}`
                );
                if (res.data && res.data.Search) {
                    setContent(res.data.Search);
                } else {
                    console.error("No data found for the given category.");
                }
            } catch (error) {
                console.error("Error fetching data from OMDB API:", error);
            }
        };

        getContent();
    }, [category]);

    const scrollLeft = () => {
        if (sliderRef.current) {
            sliderRef.current.scrollBy({ left: -sliderRef.current.offsetWidth, behavior: "smooth" });
        }
    };
    const scrollRight = () => {
        sliderRef.current.scrollBy({ left: sliderRef.current.offsetWidth, behavior: "smooth" });
    };

    return (
        <div
            className='bg-black text-white relative px-5 md:px-20'
            onMouseEnter={() => setShowArrows(true)}
            onMouseLeave={() => setShowArrows(false)}
        >
            <h2 className='mb-4 text-2xl font-bold'>{formattedCategoryName}</h2>

            <div className='flex space-x-4 overflow-x-scroll scrollbar-hide' ref={sliderRef}>
                {content.map((item) => (
                    <Link to={`/watch/${item.imdbID}`} className='min-w-[250px] relative group' key={item.imdbID}>
                        <div className='rounded-lg overflow-hidden'>
                            <img
                                src={`${SMALL_IMG_BASE_URL}${item.imdbID}${SMALL_IMG_SIZE}&apikey=${API_KEY}`}
                                alt={item.Title}
                                className='transition-transform duration-300 ease-in-out group-hover:scale-125'
                            />
                        </div>
                        <p className='mt-2 text-center'>{item.Title}</p>
                    </Link>
                ))}
            </div>

            {showArrows && (
                <>
                    <button
                        className='absolute top-1/2 -translate-y-1/2 left-5 md:left-24 flex items-center justify-center
            size-12 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 text-white z-10
            '
                        onClick={scrollLeft}
                    >
                        <ChevronLeft size={24} />
                    </button>

                    <button
                        className='absolute top-1/2 -translate-y-1/2 right-5 md:right-24 flex items-center justify-center
            size-12 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 text-white z-10
            '
                        onClick={scrollRight}
                    >
                        <ChevronRight size={24} />
                    </button>
                </>
            )}
        </div>
    );
};

export default MovieSlider;
