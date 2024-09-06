import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import serverApi from "../helpers/baseUrl";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Chatbox from "../components/Chatbox";
import { jwtDecode } from "jwt-decode";

const UpdateMemePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [meme, setMeme] = useState(null);
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const access_token = localStorage.getItem("8Banter_access_token");
  const userId = access_token ? jwtDecode(access_token).id : null;

  useEffect(() => {
    const fetchMeme = async () => {
      try {
        const response = await serverApi.get(`/memes/${id}`, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });

        const { title, Tags, imageUrl } = response.data;
        setMeme(response.data);
        setTitle(title || "");
        setTags(Tags.map((tag) => tag.name).join(", "));
        setImageUrl(imageUrl || "");
      } catch (error) {
        toast.error("Failed to fetch meme - " + error.response.data.error);
      }
    };

    fetchMeme();
  }, [id, access_token]);

  useEffect(() => {
    setImageUrl(imageUrl.replace(/\s+/g, "_"));
  }, [imageUrl]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await serverApi.put(
        `/memes/${id}`,
        {
          title: title || "_",
          tags: tags,
          imageUrl: imageUrl || "_",
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      toast.success("Meme updated successfully!");
      navigate("/memes");
    } catch (error) {
      toast.error("Failed to update meme - " + error.response.data.error);
    }
  };

  const handleDeleteConfirmation = () => {
    toast.info(
      <div>
        Are you sure you want to delete this meme?
        <div className="flex space-x-4 mt-2">
          <button
            onClick={handleDelete}
            className="bg-accent text-neutral px-4 py-2 rounded"
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="bg-neutral text-white px-4 py-2 rounded"
          >
            No
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
      }
    );
  };

  const handleDelete = async () => {
    try {
      await serverApi.delete(`/memes/${id}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      toast.dismiss();
      toast.success("Meme deleted successfully!");
      navigate("/memes");
    } catch (error) {
      toast.error("Failed to delete meme - " + error.response.data.error);
    }
  };

  if (!meme) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <ToastContainer />
      <Chatbox userId={userId} />
      <h1 className="text-2xl font-bold mb-4 text-neutral">Update Meme</h1>
      <form onSubmit={handleUpdate}>
        <div className="mb-4">
          <label className="block text-neutral text-sm font-bold mb-2">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value || "_")}
            className="border rounded w-full py-2 px-3 text-neutral leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-neutral text-sm font-bold mb-2">
            Tags
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="border rounded w-full py-2 px-3 text-neutral leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Comma-separated tags"
          />
        </div>
        <div className="mb-4">
          <label className="block text-neutral text-sm font-bold mb-2">
            Image URL
          </label>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="border rounded w-full py-2 px-3 text-neutral leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter image URL"
          />
        </div>
        <div className="mb-4">
          <label className="block text-neutral text-sm font-bold mb-2">
            Image Preview
          </label>
          <div className="w-64 h-64 object-contain mx-auto flex items-center">
            <img
              src={imageUrl}
              alt="Meme Preview"
              className="w-80 h-auto object-contain rounded-lg"
            />
          </div>
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            className="bg-neutral hover:bg-accent text-accent hover:text-neutral font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Update Meme
          </button>
          <button
            type="button"
            onClick={handleDeleteConfirmation}
            className="bg-primary hover:bg-accent text-neutral font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Delete Meme
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateMemePage;
