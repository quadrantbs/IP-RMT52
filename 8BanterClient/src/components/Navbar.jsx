import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("8Banter_access_token");
    const user = localStorage.getItem("8Banter_username");
    if (token) {
      setIsLoggedIn(true);
      setUsername(user);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("8Banter_access_token");
    localStorage.removeItem("8Banter_username");
    setIsLoggedIn(false);
    setUsername("");
    navigate("/login");
  };

  return (
    <header className="bg-red-600 text-white p-4">
      <nav className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          <Link to="/">8Banter</Link>
        </h1>
        <div>
          {isLoggedIn ? (
            <>
              <span className="mx-2">Hello, {username}!</span>
              <Link to="/memes" className="mx-2 hover:text-gray-300">
                Memes
              </Link>
              <Link to="/memes/create" className="mx-2 hover:text-gray-300">
                Create Meme
              </Link>
              <button
                onClick={handleLogout}
                className="mx-2 hover:text-gray-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/" className="mx-2 hover:text-gray-300">
                Home
              </Link>
              <Link to="/memes" className="mx-2 hover:text-gray-300">
                Memes
              </Link>
              <Link to="/login" className="mx-2 hover:text-gray-300">
                Login
              </Link>
              <Link to="/register" className="mx-2 hover:text-gray-300">
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
