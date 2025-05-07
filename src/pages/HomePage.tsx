
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';
import HeroBanner from '@/components/HeroBanner';

const HomePage = () => {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-game-bg to-game-panel/50">
      <NavigationBar />
      
      <HeroBanner />
      
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
            Popular <span className="text-game-gem">Games</span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Try your luck with our selection of exciting games. Each game offers unique gameplay and chances to win!
          </p>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Dice Game Card */}
          <Card className="bg-game-panel/90 border-game-button/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01] overflow-hidden">
            <div className="h-40 bg-gradient-to-r from-blue-500/20 to-purple-500/20 flex items-center justify-center">
              <div className="text-5xl font-bold text-blue-400 animate-pulse-glow">
                <span className="text-4xl">50.50</span>
              </div>
            </div>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-white text-center">Dice Game</CardTitle>
            </CardHeader>
            <CardContent className="text-center pb-6">
              <p className="text-gray-300 mb-6">Bet on dice rolls with custom odds and multipliers!</p>
              {currentUser ? (
                <Link to="/dice-game">
                  <Button className="bg-game-button hover:bg-opacity-90 text-black w-full sm:w-auto px-8">Play Now</Button>
                </Link>
              ) : (
                <Link to="/login">
                  <Button className="bg-game-button hover:bg-opacity-90 text-black w-full sm:w-auto px-8">Login to Play</Button>
                </Link>
              )}
            </CardContent>
          </Card>
          
          {/* Rock Paper Scissors Card */}
          <Card className="bg-game-panel/90 border-game-button/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01] overflow-hidden">
            <div className="h-40 bg-gradient-to-r from-indigo-500/20 to-pink-500/20 flex items-center justify-center">
              <div className="flex space-x-4">
                <div className="text-3xl text-indigo-400">✊</div>
                <div className="text-3xl text-pink-400">✋</div>
                <div className="text-3xl text-purple-400">✌️</div>
              </div>
            </div>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-white text-center">Rock Paper Scissors</CardTitle>
            </CardHeader>
            <CardContent className="text-center pb-6">
              <p className="text-gray-300 mb-6">Test your luck against the computer and win big!</p>
              {currentUser ? (
                <Link to="/rps-game">
                  <Button className="bg-game-button hover:bg-opacity-90 text-black w-full sm:w-auto px-8">Play Now</Button>
                </Link>
              ) : (
                <Link to="/login">
                  <Button className="bg-game-button hover:bg-opacity-90 text-black w-full sm:w-auto px-8">Login to Play</Button>
                </Link>
              )}
            </CardContent>
          </Card>

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
              <div className="flex flex-col items-center justify-center">
                <div className="relative">
                  <div className="w-8 h-8 bg-blue-400 rounded-full mb-1 animate-bounce"></div>
                </div>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-2 h-2 bg-blue-500 rounded-full mx-1"></div>
                  ))}
                </div>
                <div className="flex mt-2">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="w-2 h-2 bg-blue-600 rounded-full mx-1"></div>
                  ))}
                </div>
                <div className="flex mt-2">
                  {[...Array(7)].map((_, i) => (
                    <div key={i} className="w-2 h-2 bg-blue-700 rounded-full mx-1"></div>
                  ))}
                </div>
              </div>
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
              <div className="relative">
                <div className="flex flex-wrap justify-center gap-2 w-32">
                  {[...Array(9)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-8 h-8 rounded flex items-center justify-center ${i === 4 ? 'bg-blue-500' : 'bg-gray-700/50'}`}
                    >
                      {i === 4 && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white animate-pulse-glow">
                          <polygon points="6 8 17 5 21 18 9 21 4 8" />
                          <polygon points="10 12 6 8 4 8" />
                        </svg>
                      )}
                    </div>
                  ))}
                </div>
              </div>
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
        
        {/* Features Section */}
        <div className="mt-24 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
              Why Choose <span className="text-game-gem">GemCasino</span>
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              We provide the best gaming experience with fair odds and exciting rewards
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-game-panel/60 p-6 rounded-lg border border-game-button/20 backdrop-blur-sm">
              <div className="w-12 h-12 bg-game-gem/20 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-game-gem" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Fair Games</h3>
              <p className="text-gray-300">
                All our games are provably fair with transparent mechanics, giving you complete confidence in the outcome.
              </p>
            </div>
            
            <div className="bg-game-panel/60 p-6 rounded-lg border border-game-button/20 backdrop-blur-sm">
              <div className="w-12 h-12 bg-game-gem/20 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-game-gem" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Instant Payouts</h3>
              <p className="text-gray-300">
                Withdraw your winnings instantly without waiting. Your funds are always available when you need them.
              </p>
            </div>
            
            <div className="bg-game-panel/60 p-6 rounded-lg border border-game-button/20 backdrop-blur-sm">
              <div className="w-12 h-12 bg-game-gem/20 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-game-gem" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Secure Platform</h3>
              <p className="text-gray-300">
                We use the latest security measures to ensure your data and funds are always protected.
              </p>
            </div>
          </div>
        </div>
        
        {/* CTA Section */}
        {!currentUser && (
          <div className="bg-gradient-to-r from-game-panel to-[#2c3e50] rounded-xl p-8 md:p-12 mt-16 border border-game-button/20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to Start Playing?</h3>
                <p className="text-gray-300">
                  Join thousands of players and experience the thrill of our games. Sign up now and get started!
                </p>
              </div>
              <Link to="/login">
                <Button className="bg-game-button hover:bg-opacity-90 text-black px-8 py-6 text-lg whitespace-nowrap">
                  Sign Up Now
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default HomePage;
