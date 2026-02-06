import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Login() {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate("/home");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#05060a] text-white flex items-center justify-center px-6">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-blue-600/20 blur-3xl rounded-full" />
        <div className="absolute bottom-[-200px] right-[-200px] w-[600px] h-[600px] bg-purple-600/20 blur-3xl rounded-full" />
      </div>

      {/* MAIN CONTAINER (mixed content) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-5xl rounded-3xl bg-[#0c0f18] border border-white/10 shadow-[0_40px_120px_rgba(0,0,0,0.7)]"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 p-12">
          {/* LEFT CONTENT */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl shadow-lg">
                🎬
              </div>
              <span className="text-xl font-semibold">MovieApp</span>
            </div>

            <h1 className="text-4xl font-extrabold leading-tight">
              Movies that{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                stay with you
              </span>
            </h1>

            <p className="mt-5 text-lg text-gray-300 leading-relaxed">
              Discover trending movies, explore new stories,
              and save your favorites — all in one beautifully
              crafted experience.
            </p>

            <div className="mt-8 flex gap-4 flex-wrap">
              {["Trending", "Search", "Favorites", "Fast"].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-gray-200"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* RIGHT CONTENT (LOGIN – visually connected) */}
          <div className="flex flex-col justify-center">
            <div className="rounded-2xl bg-[#111528] border border-white/10 p-8">
              <h2 className="text-2xl font-semibold">
                Welcome back
              </h2>

              <p className="mt-2 text-sm text-gray-400">
                Sign in to continue your movie journey
              </p>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGoogleLogin}
                className="mt-8 w-full flex items-center justify-center gap-3 rounded-xl bg-white py-3.5 text-sm font-semibold text-gray-900 hover:bg-gray-100 transition"
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  className="h-5 w-5"
                />
                Continue with Google
              </motion.button>

              <p className="mt-6 text-xs text-gray-400 leading-relaxed">
                Secure Google authentication.  
                We never store your password.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;
