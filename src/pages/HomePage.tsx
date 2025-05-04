import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const HomePage = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-game-bg to-game-panel/50 px-4 py-8 md:py-12">
      <div className="container mx-auto max-w-6xl">
        {/* User Authentication Banner */}
        <Card className="mb-8 bg-game-panel/80 border-game-button/20 backdrop-blur-sm shadow-xl">
          <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            {currentUser ? (
              <>
                <div className="text-white text-center sm:text-left">
                  <span className="mr-2 text-gray-300">Welcome,</span>
                  <span className="font-bold text-game-gem">{currentUser.username}</span>
                  <span className="mx-2 text-gray-300">|</span>
                  <span className="text-gray-300">Balance:</span>
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
                <div className="text-white text-center sm:text-left">Please log in to play and track your balance.</div>
                <Link to="/login" className="w-full sm:w-auto">
                  <Button className="bg-game-button hover:bg-opacity-90 text-black w-full sm:w-auto">
                    Login / Register
                  </Button>
                </Link>
              </>
            )}
          </CardContent>
        </Card>

        <div className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Casino <span className="text-game-gem">Games</span>
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto mt-2">
            Select a game below to play
          </p>
        </div>

        {/* Games Section */}
        <div className="space-y-8">
          {/* Games Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Wheel Game Card */}
            <Card className="bg-game-panel/90 border-game-button/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01] overflow-hidden">
              <div className="h-40 bg-gradient-to-r from-yellow-500/20 to-green-500/20 flex items-center justify-center">
                <div className="text-5xl font-bold text-yellow-500 animate-pulse-glow rounded-full p-6 relative">
                  <span className="absolute transform -rotate-45 text-green-400 text-2xl">2x</span>
                  <span className="absolute transform rotate-45 text-red-400 text-2xl">5x</span>
                  <span className="absolute transform rotate-135 text-blue-400 text-2xl">0x</span>
                  <span className="absolute transform -rotate-135 text-purple-400 text-2xl">10x</span>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-white text-center">Wheel Game</CardTitle>
              </CardHeader>
              <CardContent className="text-center pb-6">
                <p className="text-gray-300 mb-6">Spin the wheel to win big multipliers!</p>
                {currentUser ? (
                  <Link to="/wheel-game">
                    <Button className="bg-game-button hover:bg-opacity-90 text-black w-full sm:w-auto px-8">Play Now</Button>
                  </Link>
                ) : (
                  <Link to="/login">
                    <Button className="bg-game-button hover:bg-opacity-90 text-black w-full sm:w-auto px-8">Login to Play</Button>
                  </Link>
                )}
              </CardContent>
            </Card>

            {/* Plinko Game Card */}
            <Card className="bg-game-panel/90 border-game-button/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01] overflow-hidden">
              <div className="h-40 bg-gradient-to-r from-green-500/20 to-blue-500/20 flex items-center justify-center">
                <div className="gem bg-game-gem w-20 h-20 animate-pulse-glow"></div>
              </div>
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-white text-center">Plinko Game</CardTitle>
              </CardHeader>
              <CardContent className="text-center pb-6">
                <p className="text-gray-300 mb-6">Drop the ball and watch it bounce for big multipliers!</p>
                {currentUser ? (
                  <Link to="/plinko-game">
                    <Button className="bg-game-button hover:bg-opacity-90 text-black w-full sm:w-auto px-8">Play Now</Button>
                  </Link>
                ) : (
                  <Link to="/login">
                    <Button className="bg-game-button hover:bg-opacity-90 text-black w-full sm:w-auto px-8">Login to Play</Button>
                  </Link>
                )}
              </CardContent>
            </Card>

            {/* Mines Hunt Game Card */}
            <Card className="bg-game-panel/90 border-game-button/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01] overflow-hidden">
              <div className="h-40 bg-gradient-to-r from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                <div className="gem bg-game-gem w-20 h-20 animate-pulse-glow"></div>
              </div>
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-white text-center">Mines Hunt</CardTitle>
              </CardHeader>
              <CardContent className="text-center pb-6">
                <p className="text-gray-300 mb-6">Find the gems, avoid the mines! Test your luck and strategy.</p>
                {currentUser ? (
                  <Link to="/mines-hunt">
                    <Button className="bg-game-button hover:bg-opacity-90 text-black w-full sm:w-auto px-8">Play Now</Button>
                  </Link>
                ) : (
                  <Link to="/login">
                    <Button className="bg-game-button hover:bg-opacity-90 text-black w-full sm:w-auto px-8">Login to Play</Button>
                  </Link>
                )}
              </CardContent>
            </Card>

            {/* Crash Game Card */}
            <Card className="bg-game-panel/90 border-game-button/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01] overflow-hidden">
              <div className="h-40 bg-gradient-to-r from-red-500/20 to-yellow-500/20 flex items-center justify-center">
                <div className="text-4xl font-bold text-red-500 animate-pulse-glow">
                  <span className="text-2xl">x</span>1.5<span className="text-yellow-400">+</span>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-white text-center">Crash Game</CardTitle>
              </CardHeader>
              <CardContent className="text-center pb-6">
                <p className="text-gray-300 mb-6">Watch the multiplier rise and cash out before it crashes!</p>
                {currentUser ? (
                  <Link to="/crash-game">
                    <Button className="bg-game-button hover:bg-opacity-90 text-black w-full sm:w-auto px-8">Play Now</Button>
                  </Link>
                ) : (
                  <Link to="/login">
                    <Button className="bg-game-button hover:bg-opacity-90 text-black w-full sm:w-auto px-8">Login to Play</Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {!currentUser && (
          <div className="mt-10 text-center">
            <p className="text-gray-300 mb-4">Create an account to save your progress and compete on the leaderboard!</p>
            <Link to="/login">
              <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/20">
                Sign Up Now
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
