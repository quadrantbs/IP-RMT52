import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import serverApi from "../helpers/baseUrl";

const HomePage = () => {
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await serverApi.get("/templates");
        const allTemplates = response.data;

        const shuffled = allTemplates.sort(() => 0.5 - Math.random());
        const selectedTemplates = shuffled.slice(0, 3);

        setTemplates(selectedTemplates);
      } catch (error) {
        console.error("Failed to fetch templates", error);
      }
    };

    fetchTemplates();
  }, []);

  return (
    <>
      <section className="bg-neutral text-accent p-8 rounded-full">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4 px-10">Welcome to 8Banter</h1>
          <p className="text-xl mb-6">
            Discover, create, and share memes with ease.
          </p>
          <Link
            to="/memes"
            className="bg-accent text-neutral px-6 py-3 rounded-full text-lg font-semibold hover:bg-primary hover:text-neutral"
          >
            Explore Memes
          </Link>
        </div>
      </section>

      <section className="p-8">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-neutral text-center">
            Featured Templates
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {templates.map((template) => (
              <div
                key={template.id}
                className="bg-neutral p-4 rounded-lg shadow-lg overflow-hidden"
              >
                <div className="w-full h-64 relative mb-4">
                  <img
                    src={template.example.url}
                    alt={template.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">
                  {template.title}
                </h3>
                <p className="text-center text-accent">{template.name}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <p className="text-xl font-semibold text-neutral">
              And many more templates!
            </p>
            <Link
              to="/templates"
              className="mt-4 inline-block bg-neutral text-accent px-6 py-3 rounded-full text-lg font-semibold hover:bg-accent hover:text-neutral"
            >
              View All Templates
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-accent p-8 rounded-full">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">About 8Banter</h2>
          <p className="text-lg mb-6">
            8Banter is a platform where you can create, share, and discover
            memes. Join our community and have fun with the funniest memes on
            the internet!
          </p>
          <Link
            to="/register"
            className="bg-neutral text-accent px-6 py-3 rounded-full text-lg font-semibold hover:bg-primary hover:text-neutral"
          >
            Join Us Now
          </Link>
        </div>
      </section>
    </>
  );
};

export default HomePage;
