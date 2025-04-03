import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { MdMic, MdMicOff, MdSend } from 'react-icons/md';
import { speechToText } from '../../services/speech';

const ChatInput = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };
  
  const toggleSpeechRecognition = async () => {
    if (isListening) {
      setIsListening(false);
      return;
    }
    
    try {
      setIsListening(true);
      const transcript = await speechToText({
        language: 'en-US',
        onInterimResult: (result) => {
          setMessage(prev => prev + result);
        }
      });
      
      setMessage(prev => prev + transcript);
      setIsListening(false);
    } catch (error) {
      console.error('Speech recognition error:', error);
      setIsListening(false);
    }
  };
  
  return (
    <form 
      onSubmit={handleSubmit} 
      className="flex items-center border-t p-4 bg-white"
    >
      <button
        type="button"
        onClick={toggleSpeechRecognition}
        className={`p-2 rounded-full mr-2 ${
          isListening ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'
        }`}
        disabled={disabled}
      >
        {isListening ? <MdMicOff size={24} /> : <MdMic size={24} />}
      </button>
      
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        className="flex-grow border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={disabled}
      />
      
      <button
        type="submit"
        className={`p-2 rounded-full ml-2 ${
          message.trim() && !disabled 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-200 text-gray-500'
        }`}
        disabled={!message.trim() || disabled}
      >
        <MdSend size={24} />
      </button>
    </form>
  );
};

ChatInput.propTypes = {
  onSendMessage: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};

ChatInput.defaultProps = {
  disabled: false
};

export default ChatInput;
