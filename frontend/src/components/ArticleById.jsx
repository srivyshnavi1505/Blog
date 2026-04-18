import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useParams, useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import { useAuth } from "../store/authStore";

function ArticleByID() {
  const location = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();

  const currentUser = useAuth((state) => state.currentUser);

  const [article, setArticle] = useState(location.state || null);
  const [comment, setComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  const getArticleById = async () => {
    try {
      const res = await axios.get(
        `http://localhost:4000/author-api/article/${id}`,
        { withCredentials: true }
      );
      setArticle(res.data.payload);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load article");
    }
  };

  useEffect(() => {
    if (!article) {
      getArticleById();
    }
  }, []);

  const handleAddComment = async () => {
    if (!comment.trim()) return;

    if (!currentUser) {
      toast.error("Please login to add a comment");
      return;
    }

    setSubmittingComment(true);
    try {
      const res = await axios.put(
        "http://localhost:4000/user-api/articles",
        {
          articleId: id,
          userId: currentUser._id,
          comment: comment.trim(),
        },
        { withCredentials: true }
      );

      // Update article comments locally
      setArticle(res.data.payload);
      setComment("");
      toast.success("Comment added!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add comment");
    } finally {
      setSubmittingComment(false);
    }
  };

  if (!article) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <p className="text-zinc-400 animate-pulse">Loading article...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-12">
      <div className="max-w-2xl mx-auto">

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="text-zinc-500 hover:text-zinc-300 text-sm mb-8 flex items-center gap-1 transition-colors"
        >
          ← Back
        </button>

        {/* Category */}
        <span className="text-teal-400 text-xs font-semibold uppercase tracking-wider">
          {article.category}
        </span>

        {/* Title */}
        <h1 className="text-3xl font-bold text-white mt-2 mb-4 leading-tight">
          {article.title}
        </h1>

        {/* Meta */}
        <div className="flex items-center gap-4 text-zinc-500 text-sm mb-8 pb-8 border-b border-zinc-800">
          <span>By {article.author?.firstName} {article.author?.lastName}</span>
          {article.createdAt && (
            <span>
              {new Date(article.createdAt).toLocaleString("en-IN", {
                dateStyle: "medium",
                timeZone: "Asia/Kolkata",
              })}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="text-zinc-300 leading-relaxed text-base whitespace-pre-wrap mb-16">
          {article.content}
        </div>

        {/* ── COMMENTS SECTION ── */}
        <div className="border-t border-zinc-800 pt-10">
          <h2 className="text-white font-bold text-xl mb-6">
            Comments
            {article.comments?.length > 0 && (
              <span className="text-zinc-500 font-normal text-base ml-2">
                ({article.comments.length})
              </span>
            )}
          </h2>

          {/* Add comment — only for logged-in USERs */}
          {currentUser?.role === "USER" && (
            <div className="mb-8">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts..."
                rows="3"
                className="w-full bg-zinc-900 border border-zinc-700 focus:border-teal-500 outline-none text-white rounded-xl px-4 py-3 text-sm resize-none transition-colors"
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={handleAddComment}
                  disabled={submittingComment || !comment.trim()}
                  className="bg-teal-500 hover:bg-teal-400 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
                >
                  {submittingComment ? "Posting..." : "Post Comment"}
                </button>
              </div>
            </div>
          )}

          {/* Not logged in nudge */}
          {!currentUser && (
            <div className="mb-8 bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 text-zinc-500 text-sm">
              <button
                onClick={() => navigate("/login")}
                className="text-teal-400 hover:underline"
              >
                Login
              </button>{" "}
              to join the conversation.
            </div>
          )}

          {/* Authors can read but not comment */}
          {currentUser?.role === "AUTHOR" && (
            <p className="text-zinc-600 text-sm mb-6 italic">
              Authors cannot comment on articles.
            </p>
          )}

          {/* Comments list */}
          {article.comments?.length > 0 ? (
            <div className="flex flex-col gap-4">
              {article.comments.map((c, i) => (
                <div
                  key={i}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-400 text-xs font-bold uppercase">
                      {c.user?.firstName?.[0] || "U"}
                    </div>
                    <span className="text-zinc-400 text-sm font-medium">
                      {c.user?.firstName
                        ? `${c.user.firstName} ${c.user.lastName || ""}`
                        : "User"}
                    </span>
                  </div>
                  <p className="text-zinc-300 text-sm leading-relaxed">{c.comments}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-zinc-600 text-sm">
              No comments yet. Be the first to share your thoughts!
            </p>
          )}
        </div>

      </div>
    </div>
  );
}

export default ArticleByID;