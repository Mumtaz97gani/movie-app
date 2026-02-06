const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export const getPopularMovies = async (page = 1) => {
  const res = await fetch(
    `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`
  );
  if (!res.ok) throw new Error("Failed to fetch popular movies");
  return res.json();
};

export const searchMovies = async (query, page = 1) => {
  const res = await fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}&page=${page}`
  );
  if (!res.ok) throw new Error("Failed to search movies");
  return res.json();
};

export const getTrendingMovies = async (page = 1) => {
  const res = await fetch(
    `${BASE_URL}/trending/movie/week?api_key=${API_KEY}&page=${page}`
  );
  if (!res.ok) throw new Error("Failed to fetch trending movies");
  return res.json();
};

export const getTopRatedMovies = async (page = 1) => {
  const res = await fetch(
    `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&page=${page}`
  );
  if (!res.ok) throw new Error("Failed to fetch top rated movies");
  return res.json();
};

export const getMovieDetails = async (movieId) => {
  const res = await fetch(
    `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`
  );
  if (!res.ok) throw new Error("Failed to fetch movie details");
  return res.json();
};
