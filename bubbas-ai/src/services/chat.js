import { db } from '../firebase/config';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  serverTimestamp 
} from 'firebase/firestore';

// Create a new chat session
export const createChatSession = async (userId, name = 'New Chat') => {
  try {
    const chatSessionRef = collection(db, 'chatSessions');
    const newSessionDoc = await addDoc(chatSessionRef, {
      userId,
      name,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return newSessionDoc.id;
  } catch (error) {
    console.error('Error creating chat session:', error);
    throw error;
  }
};

// Get all chat sessions for a user
export const getUserChatSessions = async (userId) => {
  try {
    const chatSessionRef = collection(db, 'chatSessions');
    const q = query(
      chatSessionRef,
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    const sessions = [];
    querySnapshot.forEach((doc) => {
      sessions.push({ id: doc.id, ...doc.data() });
    });
    
    return sessions;
  } catch (error) {
    console.error('Error getting user chat sessions:', error);
    throw error;
  }
};

// Save a chat message
export const saveChatMessage = async (sessionId, message) => {
  try {
    const messagesRef = collection(db, 'chatMessages');
    const newMessage = {
      sessionId,
      content: message.content,
      role: message.role, // 'user' or 'assistant'
      timestamp: serverTimestamp()
    };
    const docRef = await addDoc(messagesRef, newMessage);
    return { id: docRef.id, ...newMessage };
  } catch (error) {
    console.error('Error saving chat message:', error);
    throw error;
  }
};

// Get chat history for a session
export const getChatHistory = async (sessionId, messageLimit = 50) => {
  try {
    const messagesRef = collection(db, 'chatMessages');
    const q = query(
      messagesRef,
      where('sessionId', '==', sessionId),
      orderBy('timestamp', 'asc'),
      limit(messageLimit)
    );
    const querySnapshot = await getDocs(q);
    
    const messages = [];
    querySnapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() });
    });
    
    return messages;
  } catch (error) {
    console.error('Error getting chat history:', error);
    throw error;
  }
};

// Process a user message and get AI response
export const processUserMessage = async (
  sessionId, 
  userMessage, 
  generateResponse
) => {
  try {
    // Save user message
    await saveChatMessage(sessionId, {
      content: userMessage,
      role: 'user'
    });
    
    // Get chat history to provide context to the AI
    const history = await getChatHistory(sessionId);
    const formattedHistory = history.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
    
    // Generate AI response
    const aiResponse = await generateResponse(userMessage, formattedHistory);
    
    // Save AI response
    await saveChatMessage(sessionId, {
      content: aiResponse,
      role: 'assistant'
    });
    
    return aiResponse;
  } catch (error) {
    console.error('Error processing user message:', error);
    throw error;
  }
};
