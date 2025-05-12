import React from 'react';
import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';
import Leaderboard from '@/components/Leaderboard';
import { Trophy } from 'lucide-react';

const LeaderboardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-game-bg to-game-panel/50 text-white">
      <NavigationBar />
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 flex items-center justify-center">
            <Trophy className="w-8 h-8 md:w-10 md:h-10 text-yellow-400 mr-3" />
            Leader<span className="text-game-gem">board</span>
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            See who's topping the charts and ruling the games.
          </p>
        </div>
        
        <div className="bg-game-panel/90 border border-game-button/20 shadow-lg rounded-lg p-6 md:p-8">
          <Leaderboard mini={false} /> {/* Display full leaderboard */}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LeaderboardPage;
