import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Outlet,
  useNavigate,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AllUsersPage from "./pages/AllUsersPage";
import AllMemesPage from "./pages/AllMemesPage";
import MemeDetailPage from "./pages/MemeDetailPage";
import MemeTagPage from "./pages/MemeTagPage";
import CreateMemePage from "./pages/CreateMemePage";
import UpdateMemePage from "./pages/UpdateMemePage";
import NotFoundPage from "./pages/NotFoundPage";
import AllTagsPage from "./pages/AllTagsPage";
import CreateTagPage from "./pages/CreateTagPage";
import MemeTemplatesPage from "./pages/MemeTemplatesPage";
import NotImplementedPage from "./pages/NotImplementedPage"; // Halaman placeholder

const checkAuth = () => {
  const token = localStorage.getItem("8Banter_access_token");
  return !!token;
};

const AuthLoader = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!checkAuth()) {
      navigate("/login");
    }
  }, [navigate]);

  return children;
};

const MainLayout = () => {
  return (
    <div>
        
      <Outlet />
    </div>
  );
};

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/users"
            element={
              <AuthLoader>
                <AllUsersPage />
              </AuthLoader>
            }
          />
          <Route
            path="/memes"
            element={
              <AuthLoader>
                <AllMemesPage />
              </AuthLoader>
            }
          />
          <Route
            path="/memes/:id"
            element={
              <AuthLoader>
                <MemeDetailPage />
              </AuthLoader>
            }
          />
          <Route
            path="/memes/tag/:tag"
            element={
              <AuthLoader>
                <MemeTagPage />
              </AuthLoader>
            }
          />
          <Route
            path="/memes/create"
            element={
              <AuthLoader>
                <CreateMemePage />
              </AuthLoader>
            }
          />
          <Route
            path="/memes/:id/update"
            element={
              <AuthLoader>
                <UpdateMemePage />
              </AuthLoader>
            }
          />
          <Route
            path="/tags"
            element={
              <AuthLoader>
                <AllTagsPage />
              </AuthLoader>
            }
          />
          <Route
            path="/tags/create"
            element={
              <AuthLoader>
                <CreateTagPage />
              </AuthLoader>
            }
          />
          <Route
            path="/templates"
            element={
              <AuthLoader>
                <MemeTemplatesPage />
              </AuthLoader>
            }
          />
          <Route
            path="/memes/:id/comments"
            element={
              <AuthLoader>
                <NotImplementedPage />
              </AuthLoader>
            }
          />
          <Route
            path="/memes/:id/comments/:commentId"
            element={
              <AuthLoader>
                <NotImplementedPage />
              </AuthLoader>
            }
          />
          <Route
            path="/memes/:id/likes"
            element={
              <AuthLoader>
                <NotImplementedPage />
              </AuthLoader>
            }
          />
          <Route
            path="/memes/:id/likes/remove"
            element={
              <AuthLoader>
                <NotImplementedPage />
              </AuthLoader>
            }
          />

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
