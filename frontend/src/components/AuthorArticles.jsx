import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { useAuth } from "../store/authStore";
import { toast } from "react-hot-toast";

function AuthorArticles() {
  const navigate = useNavigate();
  const user = useAuth((state) => state.currentUser);

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ FIX: after refresh, check-auth returned JWT payload { userId } not { _id }
  // Now check-auth returns full DB user so _id is always present,
  // but keep userId fallback for safety
  const authorId = user?._id || user?.userId;

  const fetchArticles = async () => {
    if (!authorId) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:4000/author-api/articles/${authorId}`,
        { withCredentials: true }
      );
      setArticles(res.data.payload);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch articles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [authorId]);

  const openArticle = (article) => {
    navigate(`/article/${article._id}`, { state: article });
  };

  const editArticle = (article) => {
    navigate(`/author-profile/edit-article/${article._id}`);
  };

  const toggleStatus = async (article) => {
    const newStatus = !article.isArticleActive;
    try {
      await axios.patch(
        `http://localhost:4000/author-api/articles/${article._id}/status`,
        { isArticleActive: newStatus },
        { withCredentials: true }
      );
      toast.success(newStatus ? "Article restored!" : "Article deleted!");
      setArticles((prev) =>
        prev.map((a) =>
          a._id === article._id ? { ...a, isArticleActive: newStatus } : a
        )
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
    });
  };

  if (loading) return <p className="text-xl text-center text-zinc-400 mt-10">Loading articles...</p>;
  if (error) return <p className="text-red-400 text-center mt-10">{error}</p>;

  if (articles.length === 0) {
    return (
      <div className="text-center text-zinc-500 mt-16">
        <p className="text-lg">You haven't published any articles yet.</p>
        <button
          onClick={() => navigate("/author-profile/add-article")}
          className="mt-4 bg-teal-500 hover:bg-teal-400 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Write your first article
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {articles.map((article) => (
        <div
          key={article._id}
          className={`bg-zinc-900 border rounded-xl p-5 flex flex-col transition-all hover:shadow-lg
            ${article.isArticleActive
              ? "border-zinc-800 hover:border-teal-500/50 hover:shadow-teal-500/5"
              : "border-red-900/40 opacity-60"
            }`}
        >
          {!article.isArticleActive && (
            <span className="text-xs text-red-400 font-semibold mb-2">● Deleted</span>
          )}

          <span className="text-teal-400 text-xs font-semibold uppercase tracking-wider">
            {article.category}
          </span>

          <p className="text-white font-bold mt-1 mb-2 leading-snug">{article.title}</p>

          <p className="text-zinc-500 text-sm flex-1">
            {article.content.slice(0, 80)}...
          </p>

          <p className="text-zinc-600 text-xs mt-3">{formatDate(article.createdAt)}</p>

          <div className="flex gap-2 mt-4">
            <button
              className="text-teal-400 hover:text-teal-300 text-sm font-medium transition-colors"
              onClick={() => openArticle(article)}
            >
              Read →
            </button>

            <button
              className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors ml-auto"
              onClick={() => editArticle(article)}
            >
              Edit
            </button>

            <button
              className={`text-sm font-medium transition-colors ${
                article.isArticleActive
                  ? "text-red-400 hover:text-red-300"
                  : "text-green-400 hover:text-green-300"
              }`}
              onClick={() => toggleStatus(article)}
            >
              {article.isArticleActive ? "Delete" : "Restore"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AuthorArticles;