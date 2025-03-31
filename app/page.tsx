"use client"; // Change to client component to handle interactivity
import ChatBox from "@/components/Chatbox";
import { useState } from "react";

const Home = () => {
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
  
  // Sample questions
  const sampleQuestions = [
    "What does Krishna teach about dharma?",
    "How can I find inner peace according to the Gita?",
    "What is the meaning of karma yoga?",
    "How should I handle difficult emotions?"
  ];
  
  // Handle question selection
  const handleQuestionClick = (question: string) => {
    setCurrentQuestion(question);
  };

  return (
    <main className="w-full h-full grid grid-cols-12 bg-blue-100">
      {/* Left Column - Chat Area */}
      <div className="col-span-12 lg:col-span-5 lg:col-start-2 h-full p-4 overflow-auto">
        <ChatBox selectedQuestion={currentQuestion} onQuestionProcessed={() => setCurrentQuestion(null)} />
      </div>

      {/* Right Column - Reserved for future use */}
      <div
        className="col-span-12 lg:col-span-5 lg:col-start-7 h-full p-4 overflow-auto bg-cover bg-center bg-no-repeat flex flex-col justify-between"
        style={{
          backgroundImage: "url('/static/gita_painting_NoBG.png')",
          // boxShadow: "inset 0 0 0 2000px rgba(0, 0, 0, 0.1)" // Light overlay for readability
        }}
      >
        {/* Suggestion buttons at the bottom */}
        <div className="mt-auto">
          <h3 className="text-lg font-semibold text-black mb-3 text-shadow-sm text-center">BHAGAVAD GITA AS IT IS</h3>
          <div className="grid grid-cols-2 gap-3">
            {sampleQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleQuestionClick(question)}
                className="bg-white text-blue-700 border-2 border-blue-500 rounded-lg py-2 px-4 text-sm font-medium hover:bg-blue-50 transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export default Home;