import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaHeart, FaRegHeart, FaComments, FaEdit } from "react-icons/fa";
import {
  FaFacebookSquare,
  FaTwitterSquare,
  FaWhatsappSquare,
} from "react-icons/fa";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";
import { fetchMemes, toggleLike } from "../features/memes/memeSlice";
import Chatbox from "../components/Chatbox";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";

const AllMemesPage = () => {
  const dispatch = useDispatch();
  const { memes, status, error } = useSelector((state) => state.memes);
  const access_token = localStorage.getItem("8Banter_access_token");
  const userId = access_token ? jwtDecode(access_token).id : null;

  useEffect(() => {
    if (access_token) {
      dispatch(fetchMemes(access_token));
    }
  }, [dispatch, access_token]);

  const handleLikeToggle = (memeId, isLiked) => {
    if (access_token) {
      dispatch(toggleLike({ memeId, isLiked, access_token }));
    }
  };

  if (status === "loading") {
    return (
      <div className="bg-accent p-4 rounded-lg shadow-lg max-w-xl mx-auto">
        Loading memes...
      </div>
    );
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <ToastContainer />
      {access_token && <Chatbox userId={userId} />}
      <div className="space-y-6">
        {memes.map((meme) => {
          const shareUrl = window.location.origin + `/memes/${meme.id}`;
          return (
            <div
              key={meme.id}
              className="bg-accent p-4 rounded-lg shadow-lg max-w-xl mx-auto"
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
                    to={`/memes/${meme.id}`}
                    className="bg-primary text-gray-700 px-4 py-2 rounded-full flex items-center hover:bg-gray-300"
                  >
                    <FaComments className="mr-2" />
                    Comments
                  </Link>
                  {userId === meme.userId && (
                    <Link
                      to={`/memes/${meme.id}/edit`}
                      className="bg-secondary text-blue-700 px-4 py-2 rounded-full flex items-center hover:bg-blue-300"
                    >
                      <FaEdit className="mr-2" />
                      Edit
                    </Link>
                  )}
                </div>
              </div>
              <div className="flex space-x-4 mt-2">
                <FacebookShareButton url={shareUrl} className="hover:scale-110">
                  <FaFacebookSquare className="text-blue-600" size={28} />
                </FacebookShareButton>
                <TwitterShareButton url={shareUrl} className="hover:scale-110">
                  <FaTwitterSquare className="text-blue-400" size={28} />
                </TwitterShareButton>
                <WhatsappShareButton url={shareUrl} className="hover:scale-110">
                  <FaWhatsappSquare className="text-green-500" size={28} />
                </WhatsappShareButton>
              </div>

              <div className="mt-2">
                {meme.Tags.map((tag) => (
                  <Link
                    key={tag.id}
                    to={`/memes/tag/${encodeURIComponent(tag.name)}`}
                    className="bg-neutral text-primary px-3 py-1 rounded-full text-sm font-medium mr-2 hover:bg-blue-300"
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
