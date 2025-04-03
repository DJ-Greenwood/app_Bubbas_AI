import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Button from '../components/common/Button';
import ChatSessionsList from '../components/chat/ChatSessionsList';

const Home = () => {
  const { user } = useAppContext();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-6">Welcome to Bubba's AI</h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Your personal AI companion powered by Google's Gemini AI. Chat, ask questions, and get personalized assistance with voice interaction.
        </p>
        <Link to="/chat">
          <Button>Start Chatting</Button>
        </Link>
      </div>
      
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Features</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Intelligent Conversations</h3>
            <p>Chat with an AI that understands context and can maintain meaningful conversations.</p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Voice Interaction</h3>
            <p>Speak to Bubba's AI and hear responses through advanced speech recognition and synthesis.</p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Persistent Memory</h3>
            <p>The AI remembers your previous conversations to provide personalized experiences.</p>
          </div>
        </div>
      </div>
      
      {user && (
        <div className="mt-12">
          <ChatSessionsList />
        </div>
      )}
    </div>
  );
};

export default Home;
