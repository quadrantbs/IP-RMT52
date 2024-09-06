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
    <header className="bg-neutral text-accent p-4">
      <nav className="container mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          <Link to="/">8Banter</Link>
        </h1>

        <button
          className="block md:hidden text-accent focus:outline-none"
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

        <div className="hidden md:flex md:items-center md:space-x-4 md:ml-auto">
          {isLoggedIn ? (
            <>
              <div className="px-4 py-2 hover:bg-primary hover:text-neutral rounded-md">
                <span className="block md:inline">Hello, {username}!</span>
              </div>
              <div className="px-4 py-2 hover:bg-primary hover:text-neutral rounded-md">
                <Link
                  to="/memes"
                  className="block md:inline"
                >
                  Memes
                </Link>
              </div>
              <div className="px-4 py-2 hover:bg-primary hover:text-neutral rounded-md">
                <Link
                  to="/templates"
                  className="block md:inline"
                >
                  Templates
                </Link>
              </div>
              <div className="px-4 py-2 hover:bg-primary hover:text-neutral rounded-md">
                <Link
                  to="/memes/create"
                  className="block md:inline "
                >
                  Create Meme
                </Link>
              </div>
              <div className="px-4 py-2 hover:bg-primary hover:text-neutral rounded-md">
                <button
                  onClick={handleLogout}
                  className="block md:inline "
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="px-4 py-2 hover:bg-primary hover:text-neutral rounded-md">
                <Link to="/" className="block md:inline ">
                  Home
                </Link>
              </div>
              <div className="px-4 py-2 hover:bg-primary hover:text-neutral rounded-md">
                <Link
                  to="/memes"
                  className="block md:inline "
                >
                  Memes
                </Link>
              </div>
              <div className="px-4 py-2 hover:bg-primary hover:text-neutral rounded-md">
                <Link
                  to="/login"
                  className="block md:inline "
                >
                  Login
                </Link>
              </div>
              <div className="px-4 py-2 hover:bg-primary hover:text-neutral rounded-md">
                <Link
                  to="/register"
                  className="block md:inline "
                >
                  Register
                </Link>
              </div>
            </>
          )}
        </div>

        {isMenuOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end">
            <div className="bg-neutral text-accent w-64 h-full p-4">
              <button
                className="text-accent focus:outline-none mb-4"
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
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>

              <div className="flex flex-col space-y-4">
                {isLoggedIn ? (
                  <>
                    <span className="block">Hello, {username}!</span>
                    <Link
                      to="/memes"
                      className="text-center hover:text-accent bg-secondary text-neutral p-2 rounded-md"
                      onClick={toggleMenu}
                    >
                      Memes
                    </Link>
                    <Link
                      to="/templates"
                      className="text-center hover:text-accent bg-secondary text-neutral p-2 rounded-md"
                      onClick={toggleMenu}
                    >
                      Templates
                    </Link>
                    <Link
                      to="/memes/create"
                      className="text-center hover:text-accent bg-secondary text-neutral p-2 rounded-md"
                      onClick={toggleMenu}
                    >
                      Create Meme
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        toggleMenu();
                      }}
                      className="text-center hover:text-accent bg-secondary text-neutral p-2 rounded-md"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/"
                      className="text-center hover:text-accent bg-secondary text-neutral p-2 rounded-md"
                      onClick={toggleMenu}
                    >
                      Home
                    </Link>
                    <Link
                      to="/memes"
                      className="text-center hover:text-accent bg-secondary text-neutral p-2 rounded-md"
                      onClick={toggleMenu}
                    >
                      Memes
                    </Link>
                    <Link
                      to="/login"
                      className="text-center hover:text-accent bg-secondary text-neutral p-2 rounded-md"
                      onClick={toggleMenu}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="text-center hover:text-accent bg-secondary text-neutral p-2 rounded-md"
                      onClick={toggleMenu}
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
