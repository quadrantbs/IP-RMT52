import { useState, useEffect } from "react";
import serverApi from "../helpers/baseUrl";

function MemeTemplatesPage() {
  const [allTemplates, setAllTemplates] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const templatesPerPage = 8;
  const maxPagesToShow = 5;

  useEffect(() => {
    fetchTemplates();
  }, []);

  useEffect(() => {
    setPage(0);
  }, [searchTerm]);

  useEffect(() => {
    paginateTemplates();
  }, [allTemplates, page, searchTerm]);

  const fetchTemplates = async () => {
    try {
      const response = await serverApi.get("/templates");
      setAllTemplates(response.data);
    } catch (error) {
      console.error("Error fetching templates:", error);
    }
  };

  const paginateTemplates = () => {
    const filteredTemplates = allTemplates.filter((template) =>
      template.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const start = page * templatesPerPage;
    const end = start + templatesPerPage;
    setTemplates(filteredTemplates.slice(start, end));
  };

  const nextPage = () => {
    if ((page + 1) * templatesPerPage < allTemplates.length) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const prevPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  const goToPage = (pageNumber) => {
    setPage(pageNumber);
  };

  const totalPages = Math.ceil(
    allTemplates.filter((template) =>
      template.name.toLowerCase().includes(searchTerm.toLowerCase())
    ).length / templatesPerPage
  );
  const firstPage = 0;
  const lastPage = totalPages - 1;

  const startPage = Math.max(0, page - Math.floor(maxPagesToShow / 2));
  const endPage = Math.min(totalPages, startPage + maxPagesToShow);

  const adjustedStartPage =
    startPage > totalPages - maxPagesToShow
      ? totalPages - maxPagesToShow
      : startPage;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">
        Available Meme Templates
      </h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search templates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {templates.map((template) => (
          <div
            key={`${template.id}-${Math.random()}`}
            className="bg-accent p-4 rounded-lg shadow-lg overflow-hidden"
          >
            <img
              src={template.example.url}
              alt={template.name}
              className="w-full h-48 object-contain rounded-lg"
            />
            <p className="text-center text-neutral truncate mt-3">
              {template.name}
            </p>
          </div>
        ))}
      </div>
      <div className="flex justify-center items-center mt-6 space-x-1 sm:space-x-4">
        <button
          onClick={() => goToPage(firstPage)}
          disabled={page === firstPage}
          className={`px-4 py-2 rounded-md hidden sm:block  ${
            page === firstPage
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-neutral text-white"
          }`}
        >
          First
        </button>
        <button
          onClick={prevPage}
          disabled={page === firstPage}
          className={`px-4 py-2 rounded-md ${
            page === firstPage
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-neutral text-white"
          }`}
        >
          Previous
        </button>

        {totalPages <= maxPagesToShow
          ? Array.from({ length: totalPages }, (_, i) => i).map(
              (pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => goToPage(pageNumber)}
                  className={`sm:px-4 px-2 py-2 rounded-md ${
                    page === pageNumber
                      ? "bg-accent text-neutral"
                      : "bg-neutral text-white"
                  }`}
                >
                  {pageNumber + 1}
                </button>
              )
            )
          : Array.from(
              { length: endPage - adjustedStartPage },
              (_, i) => adjustedStartPage + i
            ).map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => goToPage(pageNumber)}
                className={`sm:px-4 px-2 py-2 rounded-md ${
                  page === pageNumber
                    ? "bg-accent text-neutral"
                    : "bg-neutral text-white"
                }`}
              >
                {pageNumber + 1}
              </button>
            ))}
        <button
          onClick={nextPage}
          disabled={page === lastPage}
          className={`px-4 py-2 rounded-md ${
            page === lastPage
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-neutral text-white"
          }`}
        >
          Next
        </button>
        <button
          onClick={() => goToPage(lastPage)}
          disabled={page === lastPage}
          className={`px-4 py-2 rounded-md hidden sm:block ${
            page === lastPage
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-neutral text-white"
          }`}
        >
          Last
        </button>
      </div>
    </div>
  );
}

export default MemeTemplatesPage;
