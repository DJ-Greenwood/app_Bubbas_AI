import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { generateText } from '../services/gemini';
import { textToSpeech } from '../services/speech';
import { getChatHistory, saveChatMessage, createChatSession } from '../services/chat';
import ChatHistory from '../components/chat/ChatHistory';
import ChatInput from '../components/chat/ChatInput';
import Button from '../components/common/Button';

const Chat = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { user } = useAppContext();
  
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false);
  
  useEffect(() => {
    const initializeChat = async () => {
      if (!user) return;
      
      try {
        // If no sessionId provided, create a new chat session
        if (!sessionId) {
          const newSessionId = await createChatSession(user.uid);
          navigate(`/chat/${newSessionId}`);
          return;
        }
        
        // Load chat history
        const history = await getChatHistory(sessionId);
        setMessages(history);
      } catch (error) {
        console.error('Error initializing chat:', error);
      }
    };
    
    initializeChat();
  }, [sessionId, user, navigate]);
  
  const handleSendMessage = async (content) => {
    if (!sessionId || !content.trim()) return;
    
    try {
      setLoading(true);
      
      // Add user message to UI immediately
      const userMessage = {
        id: `temp-${Date.now()}`,
        content,
        role: 'user',
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, userMessage]);
      
      // Save user message to Firestore
      await saveChatMessage(sessionId, {
        content,
        role: 'user'
      });
      
      // Format history for Gemini
      const formattedHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      // Get AI response
      const aiResponse = await generateText(content, formattedHistory);
      
      // Save AI response to Firestore
      await saveChatMessage(sessionId, {
        content: aiResponse,
        role: 'assistant'
      });
      
      // Add AI response to UI
      const assistantMessage = {
        id: `temp-${Date.now() + 1}`,
        content: aiResponse,
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, assistantMessage]);
      
      // Speak response if autoSpeak is enabled
      if (autoSpeak) {
        await textToSpeech(aiResponse);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex justify-between items-center">
        <h1 className="text-xl font-bold">Chat with Bubba's AI</h1>
        <div className="flex items-center">
          <label className="mr-2 text-sm">Auto TTS</label>
          <input
            type="checkbox"
            checked={autoSpeak}
            onChange={() => setAutoSpeak(!autoSpeak)}
            className="mr-4"
          />
          <Button 
            variant="secondary"
            onClick={() => navigate('/chat')}
          >
            New Chat
          </Button>
        </div>
      </div>
      
      <ChatHistory messages={messages} loading={loading} />
      
      <ChatInput 
        onSendMessage={handleSendMessage} 
        disabled={loading || !sessionId}
      />
    </div>
  );
};

export default Chat;
