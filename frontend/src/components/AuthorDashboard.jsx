import React from "react";
import { useNavigate, Outlet } from "react-router";
import { toast } from "react-hot-toast";
import { useAuth } from "../store/authStore";

function AuthorDashboard() {

  const navigate = useNavigate();
  const currentUser = useAuth((state) => state.currentUser);
  const logout = useAuth((state) => state.logout);

  const onLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (

    <div className="p-6">

      {/* TOP BAR */}
      <div className="flex justify-between items-center mb-6">

        <h1 className="text-2xl font-bold">Author Dashboard</h1>

        <div className="flex items-center">
          {/* ✅ FIX: was profileImageUrl — backend returns ProfileImageUrl */}
          {currentUser?.ProfileImageUrl && (
            <img
              src={currentUser.ProfileImageUrl}
              alt="Profile"
              className="w-12 h-12 rounded-full mr-3"
            />
          )}

          <button
            onClick={onLogout}
            className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg"
          >
            Log Out
          </button>
        </div>

      </div>

      {/* NAV BUTTONS */}
      <div className="flex gap-4 mb-6 justify-center">

        <button
          onClick={() => navigate("/author-profile/articles")}
          className="bg-gray-200 px-4 py-2 rounded"
        >
          My Articles
        </button>

        <button
          onClick={() => navigate("/author-profile/add-article")}
          className="bg-teal-500 text-white px-4 py-2 rounded"
        >
          Add Article
        </button>

      </div>

      <Outlet />

    </div>
  );
}

export default AuthorDashboard;