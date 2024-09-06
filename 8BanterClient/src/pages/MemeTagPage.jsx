import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaHeart, FaRegHeart, FaComments, FaEdit } from "react-icons/fa";
import {
  FaFacebookSquare,
  FaTwitterSquare,
  FaWhatsappSquare,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Chatbox from "../components/Chatbox";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";
import { jwtDecode } from "jwt-decode";
import serverApi from "../helpers/baseUrl";

const MemeTagPage = () => {
  const { tag } = useParams();
  const [memes, setMemes] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const access_token = localStorage.getItem("8Banter_access_token");
  const userId = access_token ? jwtDecode(access_token).id : null;

  const fetchMemesByTag = async () => {
    try {
      const response = await serverApi.get(
        `/memes/tag/${encodeURIComponent(tag)}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
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
      const memesWithAmountLikes = await Promise.all(
        memesWithLikes.map(async (meme) => {
          const likesResponse = await serverApi.get(`/memes/${meme.id}`, {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          });
          return { ...meme, likes: likesResponse.data.likes, tags:likesResponse.data.Tags, userId:likesResponse.data.userId };
        })
      );
      setMemes(memesWithAmountLikes);
      console.log(memesWithAmountLikes);
    } catch (error) {
      toast.error("Failed to fetch memes - " + error?.response?.data?.error);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await serverApi.get("/tags", {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      setTags(response.data);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  useEffect(() => {
    fetchTags();
    fetchMemesByTag();
  }, [tag]);

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
      fetchMemesByTag();
    } catch (error) {
      console.error("Error liking meme:", error);
    }
  };

  if (loading) {
    return <div>Loading memes...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <ToastContainer />
      {access_token && <Chatbox userId={userId} />}

      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">Browse by Tag:</h2>
        <div className="flex flex-wrap space-x-4">
          {tags.map((tagItem) => (
            <Link
              key={tagItem.id}
              to={`/memes/tag/${encodeURIComponent(tagItem.name)}`}
              className="bg-neutral text-primary px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-300"
            >
              {tagItem.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {memes.length > 0 ? (
          memes.map((meme) => {
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
                      className="bg-secondary text-neutral px-4 py-2 rounded-full flex items-center hover:bg-primary"
                    >
                      <FaComments className="mr-2" />
                      Comments
                    </Link>
                    {userId === meme.userId && (
                      <Link
                        to={`/memes/${meme.id}/edit`}
                        className="bg-secondary text-neutral px-4 py-2 rounded-full flex items-center hover:bg-accent"
                      >
                        <FaEdit className="mr-2" />
                        Edit
                      </Link>
                    )}
                  </div>
                </div>
                <div className="flex space-x-4 mt-2">
                  <FacebookShareButton
                    url={shareUrl}
                    className="hover:scale-110"
                  >
                    <FaFacebookSquare className="text-blue-600" size={28} />
                  </FacebookShareButton>
                  <TwitterShareButton
                    url={shareUrl}
                    className="hover:scale-110"
                  >
                    <FaTwitterSquare className="text-blue-400" size={28} />
                  </TwitterShareButton>
                  <WhatsappShareButton
                    url={shareUrl}
                    className="hover:scale-110"
                  >
                    <FaWhatsappSquare className="text-green-500" size={28} />
                  </WhatsappShareButton>
                </div>
                <div className="mt-2">
                  {meme.tags.map((tag) => (
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
          })
        ) : (
          <div>No memes found for the tag {tag}</div>
        )}
      </div>
    </div>
  );
};

export default MemeTagPage;
