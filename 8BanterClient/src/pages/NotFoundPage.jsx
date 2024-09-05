import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Page Not Found</h1>
      <p className="text-lg text-gray-600 mb-8">
        This page is still under development. Please check out the following pages:
      </p>
      <div className="flex space-x-4">
        <Link
          to="/"
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-blue-600"
        >
          Home
        </Link>
        <Link
          to="/memes"
          className="px-4 py-2 bg-red-700 text-white rounded hover:bg-green-600"
        >
          Memes
        </Link>
        <Link
          to="/create-meme"
          className="px-4 py-2 bg-red-800 text-white rounded hover:bg-red-600"
        >
          Create Meme
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
