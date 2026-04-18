import React from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../store/authStore";

function Home() {

  const navigate = useNavigate();
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const currentUser = useAuth((state) => state.currentUser);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      if (currentUser?.role === "AUTHOR") navigate("/author-profile");
      else navigate("/user-profile");
    } else {
      navigate("/register");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-6 text-center">

      {/* Badge */}
      <span className="text-teal-400 text-xs font-semibold uppercase tracking-widest border border-teal-400/30 bg-teal-400/10 px-3 py-1 rounded-full mb-6">
        A Modern Blog Platform
      </span>

      {/* Headline */}
      <h1 className="text-5xl sm:text-6xl font-bold text-white leading-tight max-w-2xl">
        Write. Share.{" "}
        <span className="text-teal-400">Inspire.</span>
      </h1>

      <p className="text-zinc-400 mt-5 text-lg max-w-md leading-relaxed">
        A clean space for authors to publish ideas and readers to discover them.
      </p>

      {/* CTA Buttons */}
      <div className="flex gap-4 mt-10">
        <button
          onClick={handleGetStarted}
          className="bg-teal-500 hover:bg-teal-400 text-white font-semibold px-7 py-3 rounded-xl transition-colors"
        >
          Get Started
        </button>
        <button
          onClick={() => navigate("/login")}
          className="border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white font-semibold px-7 py-3 rounded-xl transition-all"
        >
          Sign In
        </button>
      </div>

    </div>
  );
}

export default Home;
