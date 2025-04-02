import React from 'react';
import Button from '../components/common/Button';

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Welcome to Bubba's AI</h1>
      <p className="mb-4">This is the homepage of your application.</p>
      <Button>Get Started</Button>
    </div>
  );
};

export default Home;
