import { useEffect, useState } from "react";
import serverApi from "../helpers/baseUrl";
import { Link, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaHeart, FaRegHeart, FaEdit, FaTrashAlt } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { toggleLike } from "../features/memes/memeSlice";
import { jwtDecode } from "jwt-decode";
import {
  FaFacebookSquare,
  FaTwitterSquare,
  FaWhatsappSquare,
} from "react-icons/fa";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";

const MemeDetailPage = () => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [memeId, setMemeId] = useState(0);
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [creatorId, setCreatorId] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { id } = useParams();
  const access_token = localStorage.getItem("8Banter_access_token");
  const userId = access_token ? jwtDecode(access_token).id : null;

  const fetchMeme = async () => {
    try {
      const response = await serverApi.get(`/memes/${id}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      const {
        title,
        Tags,
        imageUrl,
        id: memeId,
        likes,
        userId: creatorId,
      } = response.data;
      setTitle(title);
      setTags(Tags);
      setImageUrl(imageUrl);
      setMemeId(memeId);
      setLikes(likes);
      setCreatorId(creatorId);

      const likeResponse = await serverApi.get(`/memes/${id}/likes/status`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      setIsLiked(likeResponse.data.isLiked);
      fetchComments();
    } catch (error) {
      toast.error("Failed to fetch meme - " + error?.response?.data.error);
      console.log(error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await serverApi.get(`/memes/${id}/comments`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      setComments(response.data);
    } catch (error) {
      if (error.response.data.error === "No comments found for this meme") {
        return null;
      } else {
        toast.error(
          "Failed to fetch comments - " + error?.response?.data.error
        );
        console.log(error);
      }
    }
  };

  const postComment = async () => {
    if (newComment.trim() === "") return;

    try {
      await serverApi.post(
        `/memes/${id}/comments`,
        { text: newComment },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      setNewComment("");
      fetchComments();
    } catch (error) {
      toast.error("Failed to post comment - " + error?.response?.data?.error);
    }
  };

  const deleteComment = async (commentId) => {
    try {
      await serverApi.delete(`/memes/${id}/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      fetchComments();
    } catch (error) {
      toast.error("Failed to delete comment - " + error?.response?.data?.error);
    }
  };

  useEffect(() => {
    fetchMeme();
  }, []);

  const handleLikeToggle = async (memeId, isLiked) => {
    try {
      await dispatch(toggleLike({ memeId, isLiked, access_token }));
      fetchMeme();
    } catch (error) {
      toast.error("Failed to toggle like - " + error?.response?.data?.error);
    }
  };

  const shareUrl = window.location.origin + `/memes/${id}`;

  return (
    <>
      <ToastContainer />
      <div
        key={memeId}
        className="bg-primary p-4 rounded-lg shadow-lg max-w-xl mx-auto"
      >
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <img
          src={imageUrl}
          alt={title}
          style={{ maxHeight: "28rem" }}
          className="w-full h-auto object-contain rounded-lg mb-4"
        />
        <div className="flex items-center justify-between">
          <div
            onClick={() => handleLikeToggle(id, isLiked)}
            className={
              "flex items-center cursor-pointer transition-transform duration-300 text-red-600 scale-110 hover:text-red-700"
            }
          >
            {isLiked ? (
              <FaHeart className="mr-1" />
            ) : (
              <FaRegHeart className="mr-1" />
            )}
            <span>{likes}</span>
          </div>
          <div className="flex space-x-4">
            {userId === creatorId && (
              <Link
                to={`/memes/${id}/edit`}
                className="bg-secondary text-neutral px-4 py-2 rounded-full flex items-center hover:bg-accent"
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
          {tags.map((tag) => (
            <Link
              key={tag.id}
              to={`/memes/tag/${encodeURIComponent(tag.name)}`}
              className="bg-neutral text-primary px-3 py-1 rounded-full text-sm font-medium mr-2 hover:bg-blue-300"
            >
              {tag.name}
            </Link>
          ))}
        </div>

        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-2">Comments</h3>
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="mb-3">
                <div className="flex justify-between items-center">
                  <p className="font-semibold">{comment.User.username}</p>
                  {userId === creatorId && (
                    <button
                      onClick={() => deleteComment(comment.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrashAlt />
                    </button>
                  )}
                </div>
                <p className="bg-secondary p-2 rounded-lg">{comment.text}</p>
                <p className="text-xs text-gray-500">
                  {new Date(comment.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <p>No comments yet.</p>
          )}

          <div className="mt-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment"
              className="w-full border p-2 rounded-lg"
              rows="3"
            />
            <button
              onClick={postComment}
              className="bg-neutral text-primary px-4 py-2 rounded-lg mt-2 hover:bg-accent hover:text-neutral"
            >
              Post Comment
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MemeDetailPage;
