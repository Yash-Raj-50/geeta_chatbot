type ChatBubbleProps = {
  message: string;
  role: "user" | "assistant";
  isStreaming?: boolean;
};

const ChatBubble = ({ message, role, isStreaming }: ChatBubbleProps) => {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] p-3 rounded-lg ${
          isUser
            ? "bg-indigo-600 text-white rounded-br-none"
            : "bg-gray-100 text-gray-800 rounded-bl-none"
        }`}
      >
        <p className="whitespace-pre-wrap">{message}</p>
        {isStreaming && (
          <span className="inline-block w-2 h-4 ml-1 bg-gray-500 rounded-full animate-pulse"></span>
        )}
      </div>
    </div>
  );
};

export default ChatBubble;