import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Medal, Award } from 'lucide-react';
import GistService, { UserData } from '@/services/GistService';

interface LeaderboardProps {
  mini?: boolean; // For compact view in nav dropdown
  maxItems?: number; // Max number of users to show
}

const Leaderboard: React.FC<LeaderboardProps> = ({ 
  mini = false,
  maxItems = 10 
}) => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const allUsers = await GistService.getUsers();
        
        // Sort users by money (highest to lowest)
        const sortedUsers = [...allUsers].sort((a, b) => b.money - a.money);
        
        // Take only top N users based on maxItems prop
        setUsers(sortedUsers.slice(0, maxItems));
        setError(null);
      } catch (err) {
        console.error('Error fetching leaderboard data:', err);
        setError('Failed to load leaderboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [maxItems]);  // Render medal for top 3 positions
  const renderRankIcon = (position: number) => {
    const iconSize = mini ? 'h-5 w-5' : 'h-6 w-6';
    
    switch (position) {
      case 0: // 1st place
        return (
          <div className={`flex items-center justify-center ${mini ? 'w-7 h-7' : 'w-8 h-8'} rounded-full bg-yellow-500/10 p-1`}>
            <Trophy className={`${iconSize} text-yellow-500`} />
          </div>
        );
      case 1: // 2nd place
        return (
          <div className={`flex items-center justify-center ${mini ? 'w-7 h-7' : 'w-8 h-8'} rounded-full bg-gray-400/10 p-1`}>
            <Medal className={`${iconSize} text-gray-400`} />
          </div>
        );
      case 2: // 3rd place
        return (
          <div className={`flex items-center justify-center ${mini ? 'w-7 h-7' : 'w-8 h-8'} rounded-full bg-amber-600/10 p-1`}>
            <Award className={`${iconSize} text-amber-600`} />
          </div>
        );
      default:
        return (
          <div className={`flex items-center justify-center ${mini ? 'w-7 h-7' : 'w-8 h-8'} rounded-full bg-gray-700/20 p-1`}>
            <span className="text-center font-medium text-gray-400">{position + 1}</span>
          </div>
        );
    }
  };if (mini) {
    return (
      <div className="leaderboard-mini">
        {loading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-game-gem"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-400 py-3 text-sm">Error loading data</div>
        ) : users.length === 0 ? (
          <div className="text-center text-gray-400 py-3 text-sm">No users found</div>
        ) : (
          <div className="space-y-2">
            {users.map((user, index) => (
              <div 
                key={user.username} 
                className={`flex items-center justify-between p-3 rounded-md ${
                  index === 0 ? 'bg-yellow-500/20 border border-yellow-500/40 shadow-sm shadow-yellow-500/20' :
                  index === 1 ? 'bg-gray-400/20 border border-gray-400/40 shadow-sm shadow-gray-400/10' :
                  index === 2 ? 'bg-amber-600/20 border border-amber-600/40 shadow-sm shadow-amber-600/10' :
                  'bg-game-bg/40 border border-game-button/20'
                } hover:bg-game-bg/60 transition-all duration-200`}
              >
                <div className="flex items-center space-x-3">
                  {renderRankIcon(index)}
                  <span className="text-white font-medium text-sm">{user.username}</span>
                </div>
                <div className="text-yellow-400 font-bold text-sm">
                  ${user.money.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
  
  return (
    <Card className="bg-game-panel/90 border-game-button/20 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-2xl font-semibold text-white text-center">
          <span className="text-game-gem">Leaderboard</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-game-gem"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-400 py-4">{error}</div>
        ) : users.length === 0 ? (
          <div className="text-center text-gray-400 py-4">No users found.</div>
        ) : (
          <div className="space-y-2">
            {users.map((user, index) => (
              <div 
                key={user.username} 
                className={`flex items-center justify-between p-3 rounded-lg ${
                  index === 0 ? 'bg-yellow-500/10 border border-yellow-500/30' :
                  index === 1 ? 'bg-gray-400/10 border border-gray-400/30' :
                  index === 2 ? 'bg-amber-600/10 border border-amber-600/30' :
                  'bg-game-bg/30'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {renderRankIcon(index)}
                  <span className="text-white font-medium">{user.username}</span>
                </div>
                <div className="text-yellow-400 font-bold">
                  ${user.money.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Leaderboard;
