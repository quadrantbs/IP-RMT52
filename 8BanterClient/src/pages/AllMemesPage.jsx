import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import serverApi from "../helpers/baseUrl";
import { FaHeart, FaRegHeart, FaComments, FaEdit } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AllMemesPage = () => {
  const [memes, setMemes] = useState([]);
  const access_token = localStorage.getItem("8Banter_access_token");

  const fetchMemes = async () => {
    try {
      const response = await serverApi.get("/memes");
      const memesWithLikes = await Promise.all(
        response.data.map(async (meme) => {
          const likeResponse = await serverApi.get(
            `/memes/${meme.id}/likes/status`,
            {
              headers: {
                Authorization: `Bearer ${access_token}`,
              },
            }
          );
          return { ...meme, isLiked: likeResponse.data.isLiked };
        })
      );
      setMemes(memesWithLikes);
    } catch (error) {
      toast.error("Failed to fetch memes - " + error.response.data.error);
    }
  };

  useEffect(() => {
    fetchMemes();
  }, []);

  const handleLikeToggle = async (memeId, isLiked) => {
    try {
      if (isLiked) {
        await serverApi.delete(`/memes/${memeId}/likes`, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });
      } else {
        await serverApi.post(
          `/memes/${memeId}/likes`,
          {},
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
      }

      await fetchMemes();
    } catch (error) {
      if (error.response.data.error === "Invalid Token") {
        toast.error("Invalid Token - You need to login first!");
      } else {
        toast.error("Failed To Like/Dislike!");
      }
      console.log(error.response);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <ToastContainer />
      <div className="space-y-6">
        {memes.map((meme) => {
          const isLiked = meme.isLiked;
          return (
            <div
              key={meme.id}
              className="bg-white p-4 rounded-lg shadow-lg max-w-xl mx-auto"
            >
              <h2 className="text-2xl font-bold mb-2">{meme.title}</h2>
              <img
                src={meme.imageUrl}
                alt={meme.title}
                style={{ maxHeight: "28rem" }}
                className="w-full h-auto object-contain rounded-lg mb-4"
              />
              <div className="flex items-center justify-between">
                <div
                  onClick={() => handleLikeToggle(meme.id, meme.isLiked)}
                  className={
                    "flex items-center cursor-pointer transition-transform duration-300 text-red-600 scale-110 hover:text-red-700"
                  }
                >
                  {meme.isLiked ? (
                    <FaHeart className="mr-1" />
                  ) : (
                    <FaRegHeart className="mr-1" />
                  )}
                  <span>{meme.likes}</span>
                </div>
                <div className="flex space-x-4">
                  <Link
                    to={`/memes/${meme.id}/comments`}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full flex items-center hover:bg-gray-300"
                  >
                    <FaComments className="mr-2" />
                    Comments
                  </Link>
                  <Link
                    to={`/memes/${meme.id}/edit`}
                    className="bg-blue-200 text-blue-700 px-4 py-2 rounded-full flex items-center hover:bg-blue-300"
                  >
                    <FaEdit className="mr-2" />
                    Edit
                  </Link>
                </div>
              </div>
              <div className="mt-2">
                {meme.Tags.map((tag) => (
                  <Link
                    key={tag.id}
                    to={`/memes/tag/${encodeURIComponent(tag.name)}`}
                    className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mr-2 hover:bg-blue-300"
                  >
                    {tag.name}
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AllMemesPage;
