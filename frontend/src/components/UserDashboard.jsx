
import React, { useEffect, useState } from 'react'
import { useAuth } from '../store/authStore'
import { useNavigate } from 'react-router'
import axios from 'axios'
import { toast } from 'react-hot-toast'

function UserDashboard() {
  
  const logout = useAuth(state => state.logout)
  const currentUser = useAuth(state => state.currentUser)
  const navigate = useNavigate()
 
  const [articles, setArticles] = useState([])

  const onLogout = async () => {

    await logout()
    toast.success("Logged out successfully")
    navigate("/login")
  }

  // Fetching all articles
  const getArticles = async () => {
    try {

      let res = await axios.get(
        "http://localhost:4000/user-api/articles",
        { withCredentials: true }
      )

      console.log(res.data)

      setArticles(res.data.payload)

    }
    catch (err) {
      console.log("Error fetching articles:", err)
      toast.error("Failed to load articles")
    }
  }
  useEffect(() => {
    getArticles()
  }, [])
  return (
    <div className="min-h-screen bg-zinc-950 px-6 py-8">

      {/* TOP BAR */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Welcome back, <span className="text-teal-400">{currentUser?.firstName}</span>
          </h1>
          <p className="text-zinc-500 text-sm mt-1">Here's what's published today</p>
        </div>

        <div className="flex items-center gap-3">
          {currentUser?.ProfileImageUrl && (
            <img
              src={currentUser.ProfileImageUrl}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover border-2 border-zinc-700"
            />
          )}
          <button
            onClick={onLogout}
            className="border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white px-4 py-2 rounded-lg text-sm transition-all"
          >
            Logout
          </button>
        </div>
      </div>

      {/* ARTICLES GRID */}
      {articles.length === 0 ? (
        <div className="text-center text-zinc-600 mt-20">
          <p className="text-lg">No articles published yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {articles.map((article, index) => (
            <div
              key={index}
              onClick={() => navigate(`/article/${article._id}`, { state: article })}
              className="bg-zinc-900 border border-zinc-800 hover:border-teal-500/50 rounded-xl overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:shadow-teal-500/5 group"
            >
              <img
                src={
                  article.author?.ProfileImageUrl ||
                  `https://ui-avatars.com/api/?name=${article.author?.firstName}&background=14b8a6&color=fff`
                }
                alt="author"
                className="h-36 w-full object-cover group-hover:opacity-90 transition-opacity"
              />

              <div className="p-4">
                <span className="text-teal-400 text-xs font-semibold uppercase tracking-wider">
                  {article.category}
                </span>

                <h2 className="text-white font-bold mt-1 mb-2 leading-snug">
                  {article.title}
                </h2>

                <p className="text-zinc-500 text-sm line-clamp-2">
                  {article.content.slice(0, 100)}...
                </p>

                <p className="text-zinc-600 text-xs mt-3">
                  By {article.author?.firstName} {article.author?.lastName}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
 
}

export default UserDashboard