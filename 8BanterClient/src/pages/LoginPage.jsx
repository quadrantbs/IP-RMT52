import { useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { Link, useNavigate } from "react-router-dom";
import serverApi from "../helpers/baseUrl";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await serverApi.post("users/login", {
        email,
        password,
      });
      localStorage.setItem("8Banter_access_token", response.data.token);
      localStorage.setItem("8Banter_username", response.data.username);
      toast.success("Login successful!");
      console.log(response);
      navigate("/memes");
    } catch (error) {
      toast.error("Failed to login - " + error.response.data.error);
      console.log(error);
    }
  };

  const handleGoogleLoginSuccess = async (googleResponse) => {
    try {
      const { credential } = googleResponse;
      const response = await serverApi.post("/auth/google", {
        id_token: credential,
      });
      localStorage.setItem("8Banter_access_token", response.data.token);
      localStorage.setItem("8Banter_username", response.data.username);

      toast.success("Google login successful!");
      navigate("/memes");
    } catch (error) {
      toast.error("Google login failed - " + error?.response?.data.error);
      console.log(error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <ToastContainer />
      <div className="max-w-md mx-auto bg-primary p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-neutral px-3 py-2 rounded-lg"
            placeholder="Enter your email"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-neutral px-3 py-2 rounded-lg"
            placeholder="Enter your password"
          />
        </div>
        <button
          onClick={handleLogin}
          className="bg-neutral text-primary px-4 py-2 rounded-lg hover:bg-accent hover:text-neutral w-full mb-4"
        >
          Login
        </button>
        <div className="text-center">
          <p className="text-sm mb-2">Or login with Google</p>
          <button>
            <GoogleOAuthProvider clientId="177930775716-007cdki2fsr1jvbeai7jec95tal4en3h.apps.googleusercontent.com">
              <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onFailure={() => toast.error("Google login failed")}
              />
            </GoogleOAuthProvider>
          </button>
          <p className="text-sm my-3">Or Register if you have no account yet</p>
          <button className="bg-primary text-neutral border border-neutral px-4 py-2 rounded-lg hover:bg-neutral hover:text-primary w-full mb-4">
            <Link to={"/register"}>Register</Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
