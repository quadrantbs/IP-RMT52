import { useState, useEffect } from "react";
import axios from "axios";
import serverApi from "../helpers/baseUrl";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateMemePage = () => {
  const [templates, setTemplates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [title, setTitle] = useState("");
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedTags, setSelectedTags] = useState([]);
  const [previewUrl, setPreviewUrl] = useState("");
  const navigate = useNavigate();
  const access_token = localStorage.getItem("8Banter_access_token");

  const fetchTemplates = async () => {
    try {
      const response = await axios.get("https://api.memegen.link/templates");
      const allTemplates = response.data;
      setTemplates(allTemplates);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch meme templates:", error);
      setLoading(false);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await serverApi.get("/tags");
      setTags(response.data);
    } catch (error) {
      console.error("Failed to fetch tags:", error);
    }
  };

  useEffect(() => {
    fetchTemplates();
    fetchTags();
  }, []);

  const handleTemplateSelect = (templateKey) => {
    setSelectedTemplate(templateKey);
    setPreviewUrl(
      `https://api.memegen.link/images/${templateKey}/${topText || "_"}/${
        bottomText || "_"
      }.png`
    );
  };
  useEffect(() => {
    if (selectedTemplate) {
      const url = `https://api.memegen.link/images/${selectedTemplate}/${
        topText || "_"
      }/${bottomText || "_"}.png`;
      setPreviewUrl(url);
    }
  }, [topText, bottomText, selectedTemplate]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const handleTagSelect = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log([...selectedTags, newTag].filter(Boolean).join(", "));
      console.log(previewUrl.replace(/ /g, "_"));
      const response = await serverApi.post(
        "/memes",
        {
          title: title,
          imageUrl: previewUrl.replace(/ /g, "_"),
          tags: [...selectedTags, newTag].filter(Boolean).join(", "),
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      console.log("Meme created successfully:", response.data);
      navigate("/memes");
    } catch (error) {
      console.error("Failed to create meme:", error);
      toast.error("Failed to create meme - " + error.response.data.error);
    }
  };

  const filteredTemplates = templates.filter((template) =>
    template.name.toLowerCase().includes(searchTerm)
  );

  return (
    <div className="container mx-auto p-4">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4 text-red-600">Create a Meme</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Top Text
          </label>
          <input
            type="text"
            value={topText}
            onChange={(e) => {
              setTopText(e.target.value);
            }}
            className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Bottom Text
          </label>
          <input
            type="text"
            value={bottomText}
            onChange={(e) => {
              setBottomText(e.target.value);
            }}
            className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Search Template
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Search for a template..."
          />
        </div>
        <div className="flex overflow-x-scroll mb-4 space-x-4">
          {loading ? (
            <div>Loading templates...</div>
          ) : (
            filteredTemplates.map((template) => (
              <div
                key={`${template.id}-${Math.random()}`}
                className="flex-shrink-0 p-2"
              >
                <div className="border rounded shadow-lg p-2 flex flex-col items-center">
                  <img
                    src={template.blank}
                    alt={template.name}
                    onClick={() => handleTemplateSelect(template.id)}
                    className={`cursor-pointer ${
                      selectedTemplate === template.id
                        ? "border-4 border-red-600"
                        : ""
                    }`}
                    style={{ maxHeight: "150px", maxWidth: "150px" }}
                  />
                  <p className="text-center text-gray-700 truncate mt-2 w-full">
                    {template.name}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Tags
          </label>
          <div className="flex flex-wrap">
            {tags.map((tag) => (
              <label
                key={tag.id}
                className="mr-4 mb-2 flex items-center space-x-2"
              >
                <input
                  type="checkbox"
                  checked={selectedTags.includes(tag.name)}
                  onChange={() => handleTagSelect(tag.name)}
                />
                <span>{tag.name}</span>
              </label>
            ))}
          </div>
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-2"
            placeholder="Add a new tag"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Meme Preview
          </label>
          {selectedTemplate && (
            <img
              src={previewUrl}
              alt="Meme Preview"
              className="w-80 h-auto object-contain rounded-lg"
            />
          )}
        </div>
        <button
          type="submit"
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Create Meme
        </button>
      </form>
    </div>
  );
};

export default CreateMemePage;
