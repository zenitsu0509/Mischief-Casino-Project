import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-game-bg flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-white mb-8">Choose a Game</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Mines Hunt Game Card */}
        <div className="bg-game-panel p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-semibold text-white mb-4">Mines Hunt</h2>
          <p className="text-gray-300 mb-4">Find the gems, avoid the mines!</p>
          <Link to="/mines-hunt">
            <Button className="bg-game-button hover:bg-opacity-90 text-black">Play Now</Button>
          </Link>
        </div>

        {/* Placeholder for future games */}
        {/* 
        <div className="bg-game-panel p-6 rounded-lg shadow-lg text-center opacity-50">
          <h2 className="text-2xl font-semibold text-white mb-4">Future Game 1</h2>
          <p className="text-gray-300 mb-4">Coming soon...</p>
          <Button className="bg-gray-500 text-black cursor-not-allowed">Play Now</Button>
        </div>
        <div className="bg-game-panel p-6 rounded-lg shadow-lg text-center opacity-50">
          <h2 className="text-2xl font-semibold text-white mb-4">Future Game 2</h2>
          <p className="text-gray-300 mb-4">Coming soon...</p>
          <Button className="bg-gray-500 text-black cursor-not-allowed">Play Now</Button>
        </div> 
        */}
      </div>
    </div>
  );
};

export default HomePage;
