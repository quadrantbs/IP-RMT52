import { useState, useRef, useEffect } from "react";
import serverApi from "../helpers/baseUrl";
import ReactMarkdown from "react-markdown";

const Chatbox = ({ userId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const savedMessages = localStorage.getItem(`chatMessages_${userId}`);
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, [userId]);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(`chatMessages_${userId}`, JSON.stringify(messages));
    }
  }, [messages, userId]);

  const handleSendMessage = async () => {
    if (input.trim() && !isSending) {
      setIsSending(true);
      const userMessage = { sender: "user", text: input };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setInput("");
      try {
        const response = await serverApi.post("/api/chat", {
          message: input,
        });
        const aiResponse = response.data;
        const botMessage = { sender: "ai", text: aiResponse };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } catch (error) {
        console.error("Error sending message:", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            sender: "ai",
            text: "An error occurred while fetching the response.",
          },
        ]);
      }

      setIsSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !isSending) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  return (
    <div className="z-50 fixed bottom-4 right-4 w-80">
      {isOpen ? (
        <div className="bg-accent shadow-lg p-4 rounded-lg h-96 flex flex-col">
          <div className="flex-1 overflow-y-auto h-64">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`mb-2 ${msg.sender === "user" ? "text-right" : ""}`}
              >
                <span
                  className={`px-3 py-2 rounded-lg inline-block ${
                    msg.sender === "user"
                      ? "bg-blue-500 text-accent"
                      : "bg-gray-300 text-black"
                  }`}
                >
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </span>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <div className="mt-2">
            <input
              className="border w-full p-3 rounded mb-2"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask for meme ideas..."
            />
            <button
              className="bg-neutral text-accent w-full p-3 rounded"
              onClick={handleSendMessage}
              disabled={isSending}
            >
              {isSending ? "Sending..." : "Send"}
            </button>
            <button
              className="mt-2 text-sm text-neutral w-full text-center"
              onClick={() => setIsOpen(false)}
            >
              Close Chat
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <p className="text-lg text-accent my-4 animate-pulse bg-neutral p-4 rounded-lg hidden md:block mb-16">
            Need meme inspiration? Ask OpenAI here!
          </p>
          <button
            className="bg-neutral text-accent p-2 md:p-4 rounded-full shadow-lg animate-bounce fixed bottom-4 right-4"
            onClick={() => setIsOpen(true)}
          >
            OpenAI Chat
          </button>
        </div>
      )}
    </div>
  );
};

export default Chatbox;
