import { createBrowserRouter, redirect } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import AuthLayout from "./layout/AuthLayout";
import PublicLayout from "./layout/PublicLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
// import AllUsersPage from "./pages/AllUsersPage";
import AllMemesPage from "./pages/AllMemesPage";
import MemeDetailPage from "./pages/MemeDetailPage";
import MemeTagPage from "./pages/MemeTagPage";
import CreateMemePage from "./pages/CreateMemePage";
import UpdateMemePage from "./pages/UpdateMemePage";
// import NotFoundPage from "./pages/NotFoundPage";
// import AllTagsPage from "./pages/AllTagsPage";
// import CreateTagPage from "./pages/CreateTagPage";
import MemeTemplatesPage from "./pages/MemeTemplatesPage";
import NotFoundPage from "./pages/NotFoundPage";

const checkAuth = () => {
  const token = localStorage.getItem("8Banter_access_token");
  if (!token) {
    throw redirect("/login");
  }
  return null;
};

const checkNoAuth = () => {
  const token = localStorage.getItem("8Banter_access_token");
  if (token) {
    throw redirect("/memes");
  }
  return null;
};

export const AppRoutes = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/memes",
        element: <AllMemesPage />,
      },
    ],
  },
  {
    path: "/",
    element: <AuthLayout />,
    loader: checkNoAuth,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
    ],
  },
  {
    path: "/",
    element: <MainLayout />,
    loader: checkAuth,
    children: [
      //     {
      //       path: "/users",
      //       element: <AllUsersPage />,
      //     },
      {
        path: "/memes/:id",
        element: <MemeDetailPage />,
      },
      {
        path: "/memes/tag/:tag",
        element: <MemeTagPage />,
      },
      {
        path: "/memes/create",
        element: <CreateMemePage />,
      },
      {
        path: "/memes/:id/edit",
        element: <UpdateMemePage />,
      },
      //     {
      //       path: "/tags",
      //       element: <AllTagsPage />,
      //     },
      //     {
      //       path: "/tags/create",
      //       element: <CreateTagPage />,
      //     },
      {
        path: "/templates",
        element: <MemeTemplatesPage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
