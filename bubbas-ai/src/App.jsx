import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Chat from './pages/Chat';
import { AppProvider, useAppContext } from './context/AppContext';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAppContext();

  if (loading) return <div>Loading...</div>;
  
  if (!user) return <Navigate to="/auth" />;
  
  return children;
};

function AppRoutes() {
  const { user, loading } = useAppContext();
  
  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/chat" element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          } />
          <Route path="/chat/:sessionId" element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          } />
          <Route path="/auth" element={user ? <Navigate to="/" /> : <Auth />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}

export default App;
