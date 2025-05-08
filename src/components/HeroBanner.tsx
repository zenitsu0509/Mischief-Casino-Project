
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const HeroBanner: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#192a38] to-[#0e1521] py-16 md:py-24">
      {/* Decorative elements */}
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-game-gem/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-4">
              Experience the Thrill of <span className="text-game-gem">Online Gaming</span>
            </h1>
            <p className="text-gray-300 text-lg md:text-xl mb-8">
              Play our exciting selection of games with fair odds, instant payouts, and a chance to win big! Join thousands of players already enjoying Mischief Casino.
            </p>
            <div className="flex flex-wrap gap-4">
              {!currentUser ? (
                <>
                  <Link to="/login">
                    <Button className="bg-game-button hover:bg-opacity-90 text-black px-8 py-6 text-lg">
                      Get Started
                    </Button>
                  </Link>
                  <Link to="/how-to-play">
                    <Button variant="outline" className="bg-transparent border-game-button/30 text-white hover:bg-game-button/10 px-8 py-6 text-lg">
                      Learn More
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/dice-game">
                    <Button className="bg-game-button hover:bg-opacity-90 text-black px-8 py-6 text-lg">
                      Play Now
                    </Button>
                  </Link>
                  <Link to="/profile">
                    <Button variant="outline" className="bg-transparent border-game-button/30 text-white hover:bg-game-button/10 px-8 py-6 text-lg">
                      My Account
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
          
          {/* Hero image/decoration */}
          <div className="relative flex items-center justify-center">
            <div className="w-64 h-64 md:w-72 md:h-72 lg:w-96 lg:h-96 bg-gradient-to-br from-game-gem/30 to-blue-500/30 rounded-full flex items-center justify-center">
              <div className="rounded-full overflow-hidden w-48 h-48 md:w-56 md:h-56 lg:w-72 lg:h-72 bg-black/20 p-0">
                <img 
                  src="/lovable-uploads/f864aefc-58f1-4b50-b96d-d8f7ecc8245e.png" 
                  alt="Mischief Logo" 
                  className="w-full h-full object-cover drop-shadow-[0_0_15px_rgba(46,213,115,0.6)]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
