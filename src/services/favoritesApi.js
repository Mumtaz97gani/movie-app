import { collection, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../firebase";

// Get all favorite movieIds for current user
export async function getUserFavoriteMovieIds(userId) {
  const snap = await getDocs(collection(db, "favorites"));
  return snap.docs
    .map((d) => d.data())
    .filter((x) => x.userId === userId)
    .map((x) => x.movieId);
}

// Toggle favorite for a movie
export async function toggleFavorite(userId, movie) {
  const docId = `${userId}_${movie.id}`;
  const ref = doc(db, "favorites", docId);

  // Save minimal movie info
  await setDoc(ref, {
    userId,
    movieId: movie.id,
    title: movie.title,
    poster_path: movie.poster_path ?? null,
    createdAt: Date.now(),
  });
}

export async function removeFavorite(userId, movieId) {
  const docId = `${userId}_${movieId}`;
  const ref = doc(db, "favorites", docId);
  await deleteDoc(ref);
}
