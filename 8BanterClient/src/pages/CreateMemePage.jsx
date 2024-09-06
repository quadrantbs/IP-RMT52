import { useState, useEffect } from "react";
import axios from "axios";
import serverApi from "../helpers/baseUrl";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Chatbox from "../components/Chatbox";
import { jwtDecode } from "jwt-decode";

const CreateMemePage = () => {
  const [templates, setTemplates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedTags, setSelectedTags] = useState([]);
  const [previewUrl, setPreviewUrl] = useState("");
  const [textInputs, setTextInputs] = useState([]);
  const navigate = useNavigate();
  const access_token = localStorage.getItem("8Banter_access_token");
  const userId = access_token ? jwtDecode(access_token).id : null;

  const fetchTemplates = async () => {
    try {
      const response = await axios.get("https://api.memegen.link/templates");
      const allTemplates = response.data;
      if (allTemplates.length > 0) {
        const firstTemplate = allTemplates[0].id;
        const numOfLines = allTemplates[0].lines;

        setSelectedTemplate(firstTemplate);
        setTextInputs(
          Array.from(
            { length: numOfLines },
            (_, i) => `Text ${i + 1} goes here`
          )
        );
      }

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
    if (selectedTemplate && textInputs.length > 0) {
      setPreviewUrl(
        `https://api.memegen.link/images/${selectedTemplate}/${textInputs
          .map((text) => text || "_")
          .join("/")}.png`
      );
    }
  }, [textInputs, selectedTemplate]);

  useEffect(() => {
    fetchTemplates();
    fetchTags();
  }, []);

  const handleTemplateSelect = (templateKey) => {
    const selectedTemplate = templates.find(
      (template) => template.id === templateKey
    );
    const numOfLines = selectedTemplate.lines;

    setSelectedTemplate(templateKey);
    setTextInputs(
      Array.from({ length: numOfLines }, (_, i) => `Text ${i + 1} goes here`)
    );
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const handleTextChange = (e, index) => {
    const updatedTexts = [...textInputs];
    updatedTexts[index] = e.target.value;
    setTextInputs(updatedTexts);
  };

  const handleTagSelect = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
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
      <Chatbox userId={userId} />
      <h1 className="text-2xl font-bold mb-4 text-neutral">Create a Meme</h1>
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
        {textInputs.map((text, index) => (
          <div key={index} className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Text {index + 1}
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => handleTextChange(e, index)}
              className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        ))}

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Meme Preview
          </label>
          <div className="w-64 h-64 object-contain mx-auto flex items-center">
            {selectedTemplate && (
              <img
                src={previewUrl}
                alt="Meme Preview"
                className="w-80 h-auto object-contain rounded-lg"
              />
            )}
          </div>
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
                className="flex-shrink-0 p-2 cursor-pointer"
                onClick={() => handleTemplateSelect(template.id)}
              >
                <div className="bg-accent border rounded shadow-lg p-2 flex flex-col items-center">
                  <img
                    src={template.blank}
                    alt={template.name}
                    className={`cursor-pointer ${
                      selectedTemplate === template.id
                        ? "border-4 border-neutral"
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

        <button
          type="submit"
          className="bg-neutral hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Create Meme
        </button>
      </form>
    </div>
  );
};

export default CreateMemePage;
