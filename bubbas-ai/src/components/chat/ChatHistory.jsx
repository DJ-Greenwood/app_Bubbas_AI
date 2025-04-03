import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import ChatBubble from './ChatBubble';

const ChatHistory = ({ messages, loading }) => {
  const messagesEndRef = useRef(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  return (
    <div className="flex-grow overflow-y-auto p-4">
      {messages.map((message) => (
        <ChatBubble 
          key={message.id} 
          message={message} 
          isUser={message.role === 'user'} 
        />
      ))}
      
      {loading && (
        <div className="flex justify-start mb-4">
          <div className="bg-gray-200 text-gray-800 rounded-lg rounded-bl-none px-4 py-2">
            <div className="flex space-x-2">
              <div className="w-2 h-2 rounded-full bg-gray-600 animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-gray-600 animate-bounce [animation-delay:-.3s]" />
              <div className="w-2 h-2 rounded-full bg-gray-600 animate-bounce [animation-delay:-.5s]" />
            </div>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

ChatHistory.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired,
      timestamp: PropTypes.object
    })
  ).isRequired,
  loading: PropTypes.bool
};

ChatHistory.defaultProps = {
  loading: false
};

export default ChatHistory;
