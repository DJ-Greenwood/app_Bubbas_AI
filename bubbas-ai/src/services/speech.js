// Service for Text-to-Speech (TTS) and Speech-to-Text (STT) using Google Cloud APIs

// Initialize the TTS client
const initTTS = async () => {
  try {
    // For the POC stage, we'll use the browser's built-in speech synthesis
    // In production, you'd integrate with Google Cloud Text-to-Speech API
    if (!('speechSynthesis' in window)) {
      throw new Error('Browser does not support speech synthesis');
    }
    return window.speechSynthesis;
  } catch (error) {
    console.error('Error initializing TTS:', error);
    throw error;
  }
};

// Text to Speech function
export const textToSpeech = async (text, voiceOptions = {}) => {
  try {
    const synthesis = await initTTS();
    
    // Create a speech utterance
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set voice options if provided
    if (voiceOptions.voiceName) {
      const voices = synthesis.getVoices();
      const selectedVoice = voices.find(voice => voice.name === voiceOptions.voiceName);
      if (selectedVoice) utterance.voice = selectedVoice;
    }
    
    // Set other options
    utterance.rate = voiceOptions.rate || 1;
    utterance.pitch = voiceOptions.pitch || 1;
    utterance.volume = voiceOptions.volume || 1;
    
    // Speak the text
    synthesis.speak(utterance);
    
    return new Promise((resolve, reject) => {
      utterance.onend = () => resolve(true);
      utterance.onerror = (event) => reject(event.error);
    });
  } catch (error) {
    console.error('Error with text-to-speech:', error);
    throw error;
  }
};

// Initialize the STT client
const initSTT = async () => {
  try {
    // For the POC stage, we'll use the browser's built-in speech recognition
    // In production, you'd integrate with Google Cloud Speech-to-Text API
    if (!('webkitSpeechRecognition' in window)) {
      throw new Error('Browser does not support speech recognition');
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    return new SpeechRecognition();
  } catch (error) {
    console.error('Error initializing STT:', error);
    throw error;
  }
};

// Speech to Text function
export const speechToText = async (options = {}) => {
  try {
    const recognition = await initSTT();
    
    // Configure recognition
    recognition.continuous = options.continuous || false;
    recognition.interimResults = options.interimResults || false;
    recognition.lang = options.language || 'en-US';
    
    // Start listening
    recognition.start();
    
    return new Promise((resolve, reject) => {
      let finalTranscript = '';
      
      recognition.onresult = (event) => {
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        if (options.onInterimResult && interimTranscript) {
          options.onInterimResult(interimTranscript);
        }
        
        if (finalTranscript && !options.continuous) {
          recognition.stop();
          resolve(finalTranscript);
        }
      };
      
      recognition.onerror = (event) => {
        recognition.stop();
        reject(event.error);
      };
      
      recognition.onend = () => {
        if (options.continuous) {
          resolve(finalTranscript);
        }
      };
    });
  } catch (error) {
    console.error('Error with speech-to-text:', error);
    throw error;
  }
};
