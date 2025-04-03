import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { getUserChatSessions, createChatSession } from '../../services/chat';
import Button from '../common/Button';

const ChatSessionsList = () => {
  const { user } = useAppContext();
  const navigate = useNavigate();
  
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadChatSessions = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const userSessions = await getUserChatSessions(user.uid);
        setSessions(userSessions);
      } catch (error) {
        console.error('Error loading chat sessions:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadChatSessions();
  }, [user]);
  
  const handleNewChat = async () => {
    try {
      const newSessionId = await createChatSession(user.uid);
      navigate(`/chat/${newSessionId}`);
    } catch (error) {
      console.error('Error creating new chat:', error);
    }
  };
  
  if (loading) {
    return <div className="p-4">Loading chat sessions...</div>;
  }
  
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Your Conversations</h2>
        <Button onClick={handleNewChat}>New Chat</Button>
      </div>
      
      {sessions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No conversations yet</p>
          <Button onClick={handleNewChat}>Start a New Chat</Button>
        </div>
      ) : (
        <ul className="space-y-2">
          {sessions.map((session) => (
            <li key={session.id}>
              <Link 
                to={`/chat/${session.id}`}
                className="block p-3 border rounded-lg hover:bg-gray-50"
              >
                <div className="font-medium">{session.name || 'Untitled Chat'}</div>
                <div className="text-sm text-gray-500">
                  {session.updatedAt?.toDate().toLocaleString() || 'No date'}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChatSessionsList;
