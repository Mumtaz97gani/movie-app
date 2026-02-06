import { useEffect, useRef, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, useLocation } from "react-router-dom";

function Navbar({ user }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const getInitials = (name) => {
    if (!name) return "";
    const parts = name.split(" ");
    return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase();
  };

  const navItem = (path, label) => (
    <button
      onClick={() => navigate(path)}
      className={`relative text-sm font-medium transition ${
        location.pathname === path
          ? "text-white"
          : "text-gray-400 hover:text-white"
      }`}
    >
      {label}
      {location.pathname === path && (
        <span className="absolute -bottom-2 left-0 h-[2px] w-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
      )}
    </button>
  );

  return (
    <nav
      className="sticky top-0 z-50 h-16 min-h-16 bg-gradient-to-r from-gray-900 via-gray-900/80 to-gray-900 backdrop-blur border-b border-white/10"
      style={{ willChange: "transform" }}
    >
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        {/* Brand */}
        <div
          onClick={() => navigate("/home")}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-105 transition">
            🎬
          </div>
          <span className="text-lg font-semibold text-white tracking-wide">
            MovieApp
          </span>
        </div>

        {/* Center nav */}
        <div className="hidden md:flex items-center gap-8">
          {navItem("/home", "Home")}
          {navItem("/favorites", "Favorites")}
        </div>

        {/* Right profile */}
        <div className="relative" ref={dropdownRef}>
          <div
            onClick={() => setOpen((prev) => !prev)}
            className="relative w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white cursor-pointer shadow-lg hover:scale-105 transition"
          >
            {getInitials(user?.displayName)}
            <span className="absolute inset-0 rounded-full blur-md bg-gradient-to-br from-blue-500 to-purple-600 opacity-40 -z-10" />
          </div>

          {/* Dropdown */}
          <div
            className={`absolute right-0 mt-4 w-56 rounded-2xl bg-gray-900 border border-white/10 shadow-2xl overflow-hidden transition-all duration-150 ${
              open
                ? "opacity-100 translate-y-0 pointer-events-auto"
                : "opacity-0 -translate-y-1 pointer-events-none"
            }`}
            style={{ willChange: "opacity, transform" }}
          >
            <div className="px-4 py-3 border-b border-white/10">
              <p className="text-sm font-semibold text-white">
                {user?.displayName}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {user?.email}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="w-full px-4 py-3 text-left text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
