import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { logOut } from '../../firebase/auth';
import Button from './Button';

const Navbar = () => {
  const { user, theme, toggleTheme } = useAppContext();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/auth');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  
  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">Bubba's AI</Link>
        
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/" className="hover:text-blue-300">Home</Link>
          {user && <Link to="/chat" className="hover:text-blue-300">Chat</Link>}
          
          <button
            onClick={toggleTheme}
            className="p-2 rounded hover:bg-gray-700"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center space-x-2"
              >
                <span>{user.displayName || user.email}</span>
                <span className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                  {user.displayName ? user.displayName[0].toUpperCase() : 'U'}
                </span>
              </button>
              
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded shadow-lg z-10">
                  <div className="p-2 border-b">
                    <p className="font-semibold">{user.displayName || 'User'}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left p-2 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/auth">
              <Button>Sign In</Button>
            </Link>
          )}
        </div>
        
        {/* Mobile menu button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </button>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-2 p-4 bg-gray-700 rounded">
          <Link to="/" className="block py-2">Home</Link>
          {user && <Link to="/chat" className="block py-2">Chat</Link>}
          
          <button
            onClick={toggleTheme}
            className="w-full text-left py-2"
          >
            {theme === 'dark' ? 'Light Mode ☀️' : 'Dark Mode 🌙'}
          </button>
          
          {user ? (
            <>
              <div className="py-2 border-t mt-2">
                <p className="font-semibold">{user.displayName || 'User'}</p>
                <p className="text-sm text-gray-300">{user.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left py-2 mt-2"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/auth" className="block py-2 mt-2">
              Sign In
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;