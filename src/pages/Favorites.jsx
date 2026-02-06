import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";
import { db } from "../firebase";
import Navbar from "../components/Navbar";
import { deleteDoc, doc } from "firebase/firestore";

function Favorites() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    fetchFavorites();
  }, [user]);

  const fetchFavorites = async () => {
    try {
      const snapshot = await getDocs(collection(db, "favorites"));

      const userFavorites = snapshot.docs
        .map((doc) => doc.data())
        .filter((fav) => fav.userId === user.uid);

      setFavorites(userFavorites);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromFavorites = async (movieId) => {
    const docId = `${user.uid}_${movieId}`;
    const ref = doc(db, "favorites", docId);

    await deleteDoc(ref);

    // Update UI instantly
    setFavorites((prev) => prev.filter((movie) => movie.movieId !== movieId));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar user={user} />

      <div className="max-w-7xl mx-auto px-6 py-6">
        <h2 className="text-2xl font-bold mb-6">❤️ My Favorite Movies</h2>

        {loading ? (
          <p>Loading favorites...</p>
        ) : favorites.length === 0 ? (
          <p className="text-gray-600">No favorite movies yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {favorites.map((movie) => (
              <div
                key={movie.movieId}
                className="relative bg-white rounded-lg shadow hover:shadow-xl transition overflow-hidden"
              >
                {/* ❌ Remove Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromFavorites(movie.movieId);
                  }}
                  className="absolute top-2 right-2 z-10 rounded-full bg-black/60 p-2 hover:bg-black/80 transition"
                  title="Remove from favorites"
                >
                  ❌
                </button>

                {/* Movie Click */}
                <div
                  onClick={() => navigate(`/movie/${movie.movieId}`)}
                  className="cursor-pointer"
                >
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Favorites;
