import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-red-600 text-white p-4">
      <nav className="container mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          <Link to="/">8Banter</Link>
        </h1>

        <button
          className="block md:hidden text-white focus:outline-none"
          onClick={toggleMenu}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        </button>

        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } md:flex md:items-center md:space-x-4 md:ml-auto`}
        >
          {isLoggedIn ? (
            <>
              <span className="block md:inline">Hello, {username}!</span>
              <Link to="/memes" className="block md:inline hover:text-gray-300">
                Memes
              </Link>
              <Link to="/templates" className="block md:inline hover:text-gray-300">
                Templates
              </Link>
              <Link to="/memes/create" className="block md:inline hover:text-gray-300">
                Create Meme
              </Link>
              <button
                onClick={handleLogout}
                className="block md:inline hover:text-gray-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/" className="block md:inline hover:text-gray-300">
                Home
              </Link>
              <Link to="/memes" className="block md:inline hover:text-gray-300">
                Memes
              </Link>
              <Link to="/login" className="block md:inline hover:text-gray-300">
                Login
              </Link>
              <Link to="/register" className="block md:inline hover:text-gray-300">
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
