import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut } from 'lucide-react';

const HomePage = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-game-bg flex flex-col items-center justify-center p-4">
      {/* User Authentication Banner */}
      <div className="w-full max-w-4xl bg-game-panel p-4 rounded-lg shadow-lg mb-8 flex justify-between items-center">
        {currentUser ? (
          <>
            <div className="text-white">
              <span className="mr-2">Welcome,</span>
              <span className="font-bold text-game-gem">{currentUser.username}</span>
              <span className="mx-2">|</span>
              <span>Balance:</span>
              <span className="font-bold text-yellow-400 ml-2">${currentUser.money.toFixed(2)}</span>
            </div>
            <Button 
              onClick={handleLogout} 
              variant="outline" 
              className="bg-transparent hover:bg-game-button/10 text-white border-game-button/30"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </>
        ) : (
          <>
            <div className="text-white">Please log in to play and track your balance.</div>
            <Link to="/login">
              <Button className="bg-game-button hover:bg-opacity-90 text-black">
                Login / Register
              </Button>
            </Link>
          </>
        )}
      </div>

      <h1 className="text-4xl font-bold text-white mb-8">Choose a Game</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Mines Hunt Game Card */}
        <div className="bg-game-panel p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-semibold text-white mb-4">Mines Hunt</h2>
          <p className="text-gray-300 mb-4">Find the gems, avoid the mines!</p>
          {currentUser ? (
            <Link to="/mines-hunt">
              <Button className="bg-game-button hover:bg-opacity-90 text-black">Play Now</Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button className="bg-game-button hover:bg-opacity-90 text-black">Login to Play</Button>
            </Link>
          )}
        </div>

        {/* Crash Game Card */}
        <div className="bg-game-panel p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-semibold text-white mb-4">Crash Game</h2>
          <p className="text-gray-300 mb-4">Watch the multiplier rise and cash out before it crashes!</p>
          {currentUser ? (
            <Link to="/crash-game">
              <Button className="bg-game-button hover:bg-opacity-90 text-black">Play Now</Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button className="bg-game-button hover:bg-opacity-90 text-black">Login to Play</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
