/**
 * Firebase Cloud Functions for Bubbas.ai application
 */

// Import function triggers from Firebase Functions v2
const { onCall } = require("firebase-functions/v2/https");
const { onDocumentCreated, onDocumentWritten } = require("firebase-functions/v2/firestore");
const logger = require("firebase-functions/logger");

// Import Google Generative AI for Gemini
const { GoogleGenerativeAI } = require("@google/gemini-ai");

// Firebase Admin SDK to access Firestore and Authentication
const admin = require("firebase-admin");
admin.initializeApp();

// Initialize Firestore
const db = admin.firestore();

/**
 * Generate AI response using Gemini
 * This allows for secure server-side processing of the Gemini API
 */
exports.generateAiResponse = onCall({ 
  maxInstances: 10
}, async (request) => {
  try {
    // Validate authentication
    if (!request.auth) {
      throw new Error("Authentication required");
    }

    // Get request data
    const { prompt, history, modelName = "gemini-2.0-flash" } = request.data;
    
    if (!prompt) {
      throw new Error("Prompt is required");
    }

    // Initialize Google Generative AI with environment variable
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Log function call for debugging and monitoring
    logger.info("Generating AI response", {
      userId: request.auth.uid,
      modelName,
      promptLength: prompt.length
    });

    // Generate AI response
    const generativeModel = genAI.getGenerativeModel({ model: modelName });
    const result = await generativeModel.generateContent(prompt);
    const response = await result.response;
    const textResponse = response.text();

    return { response: textResponse };
  } catch (error) {
    logger.error("Error generating AI response:", error);
    throw new Error(`Failed to generate AI response: ${error.message}`);
  }
});

/**
 * Create or update user profile after sign-up or profile update
 */
exports.processUserProfile = onCall({
  maxInstances: 5
}, async (request) => {
  try {
    if (!request.auth) {
      throw new Error("Authentication required");
    }

    const { displayName, photoURL } = request.data;
    const userId = request.auth.uid;

    await db.collection('users').doc(userId).set({
      displayName: displayName || request.auth.token.name,
      email: request.auth.token.email,
      photoURL: photoURL || request.auth.token.picture,
      lastActive: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    return { success: true };
  } catch (error) {
    logger.error("Error processing user profile:", error);
    throw new Error(`Failed to process user profile: ${error.message}`);
  }
});

/**
 * Clean up chat data when a user is deleted
 */
exports.cleanupUserData = onCall({
  maxInstances: 2
}, async (request) => {
  try {
    // Admin-only function
    if (!request.auth || !request.auth.token.admin) {
      throw new Error("Admin access required");
    }

    const { userId } = request.data;
    if (!userId) {
      throw new Error("User ID is required");
    }

    // Delete user chat sessions
    const chatSessions = await db.collection('chatSessions')
      .where('userId', '==', userId)
      .get();

    const batch = db.batch();
    chatSessions.forEach(doc => {
      batch.delete(doc.ref);
    });

    // Delete user chat messages
    const chatSessionIds = chatSessions.docs.map(doc => doc.id);
    for (const sessionId of chatSessionIds) {
      const messages = await db.collection('chatMessages')
        .where('sessionId', '==', sessionId)
        .get();
      
      messages.forEach(doc => {
        batch.delete(doc.ref);
      });
    }

    // Delete user profile
    batch.delete(db.collection('users').doc(userId));
    await batch.commit();

    return { success: true, deletedSessions: chatSessions.size };
  } catch (error) {
    logger.error("Error cleaning up user data:", error);
    throw new Error(`Failed to clean up user data: ${error.message}`);
  }
});

/**
 * Automatically update the lastUpdated field on chatSessions when messages are added
 */
exports.updateChatSessionTimestamp = onDocumentCreated('chatMessages/{messageId}', async (event) => {
  try {
    const message = event.data.data();
    if (message && message.sessionId) {
      await db.collection('chatSessions').doc(message.sessionId).update({
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      logger.info("Updated chat session timestamp", { sessionId: message.sessionId });
    }
  } catch (error) {
    logger.error("Error updating chat session timestamp:", error);
  }
});

/**
 * Text-to-Speech API integration
 * This handles TTS server-side for higher quality voices than browser API
 */
exports.textToSpeech = onCall({
  maxInstances: 10
}, async (request) => {
  try {
    if (!request.auth) {
      throw new Error("Authentication required");
    }

    const { text, voiceOptions } = request.data;
    if (!text) {
      throw new Error("Text is required");
    }

    // For production, integrate with Google Cloud Text-to-Speech API
    // This is a placeholder for now, as the app uses browser TTS in the POC phase
    
    logger.info("Text-to-Speech request processed", {
      userId: request.auth.uid,
      textLength: text.length
    });

    return { 
      success: true,
      message: "TTS functionality will be implemented in later phases" 
    };
  } catch (error) {
    logger.error("Error with text-to-speech:", error);
    throw new Error(`Text-to-speech failed: ${error.message}`);
  }
});
