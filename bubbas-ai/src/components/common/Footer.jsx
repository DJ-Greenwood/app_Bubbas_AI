import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white p-6">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Bubba's AI</h3>
            <p className="text-gray-300">
              Your personal AI companion powered by Google's Gemini.
            </p>
          </div>
          
          <div>
            <h4 className="text-md font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-blue-300">Home</Link></li>
              <li><Link to="/chat" className="text-gray-300 hover:text-blue-300">Chat</Link></li>
              <li><Link to="/auth" className="text-gray-300 hover:text-blue-300">Sign In</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-md font-semibold mb-3">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-blue-300">Documentation</a></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-300">API</a></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-300">Privacy Policy</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-md font-semibold mb-3">Connect</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-blue-300">GitHub</a></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-300">Twitter</a></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-300">Contact Us</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>© {new Date().getFullYear()} Bubba's AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;