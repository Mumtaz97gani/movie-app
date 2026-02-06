import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  getPopularMovies,
  searchMovies,
  getTrendingMovies,
  getTopRatedMovies,
} from "../services/movieApi";
import Navbar from "../components/Navbar";
import { Heart } from "lucide-react";
import {
  getUserFavoriteMovieIds,
  removeFavorite,
  toggleFavorite,
} from "../services/favoritesApi";

function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [category, setCategory] = useState("popular");
  const [movies, setMovies] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const loaderRef = useRef(null);

  /* 🔹 Load favorites */
  useEffect(() => {
    if (!user) return;
    getUserFavoriteMovieIds(user.uid).then(setFavoriteIds);
  }, [user]);

  /* 🔹 Load movies */
  useEffect(() => {
    if (!user || loading || !hasMore) return;

    const loadMovies = async () => {
      setLoading(true);
      try {
        let data;

        if (isSearching) {
          data = await searchMovies(searchTerm, page);
        } else if (category === "trending") {
          data = await getTrendingMovies(page);
        } else if (category === "top") {
          data = await getTopRatedMovies(page);
        } else {
          data = await getPopularMovies(page);
        }

        setMovies((prev) =>
          page === 1 ? data.results : [...prev, ...data.results]
        );
        setHasMore(page < data.total_pages);
      } catch (error) {
        console.error("Movie load error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, [user, page, category, isSearching, searchTerm]);

  /* 🔹 Infinite scroll */
  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((p) => p + 1);
        }
      },
      { rootMargin: "300px" }
    );

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading]);

  /* 🔹 Search */
  const handleSearch = (e) => {
    e.preventDefault();
    setMovies([]);
    setPage(1);
    setHasMore(true);

    if (!searchTerm.trim()) {
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
  };

  /* 🔹 Category change */
  const handleCategoryChange = (key) => {
    setCategory(key);
    setMovies([]);
    setPage(1);
    setHasMore(true);
    setIsSearching(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar user={user} />

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Search movies..."
            className="flex-1 p-2 border rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700">
            Search
          </button>
        </form>

        {/* Category Tabs */}
        <div className="flex gap-3 mb-6">
          {[
            { key: "popular", label: "🎬 Popular" },
            { key: "trending", label: "🔥 Trending" },
            { key: "top", label: "⭐ Top Rated" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleCategoryChange(tab.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                category === tab.key
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Movies Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {movies.map((movie) => (
            <div
              key={movie.id}
              onClick={() => navigate(`/movie/${movie.id}`)}
              className="group relative bg-white rounded-lg shadow hover:shadow-xl transition cursor-pointer overflow-hidden"
            >
              {/* ❤️ Favorite */}
              <button
                onClick={async (e) => {
                  e.stopPropagation();
                  const isFav = favoriteIds.includes(movie.id);
                  if (isFav) {
                    await removeFavorite(user.uid, movie.id);
                    setFavoriteIds((ids) =>
                      ids.filter((id) => id !== movie.id)
                    );
                  } else {
                    await toggleFavorite(user.uid, movie);
                    setFavoriteIds((ids) => [...ids, movie.id]);
                  }
                }}
                className="absolute top-2 right-2 z-30 rounded-full bg-black/60 p-2"
              >
                <Heart
                  size={20}
                  className={
                    favoriteIds.includes(movie.id)
                      ? "fill-red-500 text-red-500"
                      : "text-white"
                  }
                />
              </button>

              {/* Hover Overlay */}
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent
                              opacity-0 group-hover:opacity-100 transition duration-300
                              flex flex-col justify-end p-4 pointer-events-none">
                <p className="text-white text-sm font-semibold">
                  ⭐ {movie.vote_average?.toFixed(1)}
                </p>
                <p className="text-gray-300 text-xs mb-2">
                  {movie.release_date?.slice(0, 4)}
                </p>
                <span className="pointer-events-auto text-xs px-3 py-1 rounded bg-white text-black font-medium w-fit">
                  View Details
                </span>
              </div>

              {/* Poster */}
              {movie.poster_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-[300px] object-cover"
                />
              )}

              <div className="p-3">
                <p className="font-semibold text-sm text-center">
                  {movie.title}
                </p>
              </div>
            </div>
          ))}

          {/* Skeleton loaders */}
          {loading &&
            Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-[340px] bg-gray-300 animate-pulse rounded-lg"
              />
            ))}
        </div>

        {/* Infinite scroll trigger */}
        <div ref={loaderRef} className="h-10" />

        {!hasMore && (
          <div className="text-center py-6 text-gray-400">
            You’ve reached the end 🎬
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
