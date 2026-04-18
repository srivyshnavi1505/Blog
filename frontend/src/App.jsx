import { createBrowserRouter, RouterProvider } from "react-router"; 
import './App.css'

import RootLayout from './components/RootLayout'
import Register from './components/Register'
import AddArticle from './components/AddArticle'
import Login from './components/Login'
import Home from './components/Home'
import UserDashboard from './components/UserDashboard'
import AuthorDashboard from './components/AuthorDashboard'
import ArticleByID from "./components/ArticleById";
import { Toaster } from 'react-hot-toast'
import ProtectedRoute from "./components/ProtectedRoute";
import Unauthorized from "./components/Unauthorized";
import AuthorArticles from "./components/AuthorArticles";
import EditArticle from "./components/EditArticle"; // ✅ added

function App() {

  const routerObj = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      errorElement: <h1 className="text-white">Page not found</h1>,
      children: [

        {
          index: true,
          element: <Home />
        },

        {
          path: "register",
          element: <Register />
        },
        {
          path: "login",
          element: <Login />
        },

        {
          path: "user-profile",
          element: (
            <ProtectedRoute allowedRoles={["USER"]}>
              <UserDashboard />
            </ProtectedRoute>
          )
        },

        {
          path: "unauthorized",
          element: <Unauthorized />
        },

        {
          path: "author-profile",
          element: (
            <ProtectedRoute allowedRoles={["AUTHOR"]}>
              <AuthorDashboard />
            </ProtectedRoute>
          ),
          children: [
            {
              index: true,
              element: <AuthorArticles />,
            },
            {
              path: "articles",
              element: <AuthorArticles />,
            },
            {
              path: "add-article",
              element: <AddArticle />,
            },
            {
              path: "edit-article/:articleId", // ✅ added
              element: <EditArticle />,
            },
          ],
        },

        {
          path: "article/:id",
          element: <ArticleByID />
        }

      ]
    }
  ])

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <RouterProvider router={routerObj} />
    </>
  )
}

export default App;