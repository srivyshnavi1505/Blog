import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import API from "../config/axiosConfig";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router";

function EditArticle() {
  const { articleId } = useParams();
  const navigate = useNavigate();

  const [loadingArticle, setLoadingArticle] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await API.get(`/author-api/article/${articleId}`);
        const { title, category, content } = res.data.payload;
        reset({ title, category, content });
      } catch (err) {
        toast.error("Failed to load article");
        navigate("/author-profile/articles");
      } finally {
        setLoadingArticle(false);
      }
    };

    fetchArticle();
  }, [articleId]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await API.put(`/author-api/articles/${articleId}`, data);
      toast.success("Article updated successfully!");
      navigate("/author-profile/articles");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update article");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingArticle) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-zinc-400 text-lg animate-pulse">Loading article...</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-start min-h-screen bg-zinc-950 px-4 py-12">
      <div className="w-full max-w-2xl">

        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="text-zinc-500 hover:text-zinc-300 text-sm mb-4 flex items-center gap-1 transition-colors"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold text-white">Edit Article</h1>
          <p className="text-zinc-500 mt-1 text-sm">Update your article details below</p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 flex flex-col gap-5"
        >
          {/* Title */}
          <div>
            <label className="text-zinc-400 text-sm font-medium mb-1 block">Title</label>
            <input
              placeholder="Article title"
              className="w-full bg-zinc-800 border border-zinc-700 focus:border-teal-500 outline-none text-white rounded-lg px-4 py-2.5 transition-colors"
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && (
              <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="text-zinc-400 text-sm font-medium mb-1 block">Category</label>
            <input
              placeholder="e.g. Technology, Travel, Food"
              className="w-full bg-zinc-800 border border-zinc-700 focus:border-teal-500 outline-none text-white rounded-lg px-4 py-2.5 transition-colors"
              {...register("category", { required: "Category is required" })}
            />
            {errors.category && (
              <p className="text-red-400 text-xs mt-1">{errors.category.message}</p>
            )}
          </div>

          {/* Content */}
          <div>
            <label className="text-zinc-400 text-sm font-medium mb-1 block">Content</label>
            <textarea
              placeholder="Write your article content..."
              rows="10"
              className="w-full bg-zinc-800 border border-zinc-700 focus:border-teal-500 outline-none text-white rounded-lg px-4 py-2.5 transition-colors resize-none"
              {...register("content", { required: "Content is required" })}
            />
            {errors.content && (
              <p className="text-red-400 text-xs mt-1">{errors.content.message}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 py-2.5 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl transition-colors"
            >
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

export default EditArticle;
