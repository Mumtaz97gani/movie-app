import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMovieDetails } from "../services/movieApi";

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    getMovieDetails(id).then(setMovie);
  }, [id]);

  if (!movie) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-blue-600 hover:underline"
      >
        ← Back
      </button>

      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow p-6 flex flex-col md:flex-row gap-6">
        {movie.poster_path && (
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="w-full md:w-[300px] rounded-lg"
          />
        )}

        <div>
          <h2 className="text-2xl font-bold mb-2">{movie.title}</h2>
          <p className="text-gray-600 mb-2">
            Release Date: {movie.release_date}
          </p>
          <p className="text-yellow-500 font-semibold mb-4">
            ⭐ {movie.vote_average}
          </p>
          <p className="text-gray-700 leading-relaxed">
            {movie.overview}
          </p>
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;
