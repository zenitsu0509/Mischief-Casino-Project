import React from 'react';
import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { User, Wallet, History, Settings, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProfilePage: React.FC = () => {
  const { currentUser, logout } = useAuth();

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-game-bg to-game-panel/50 text-white flex flex-col items-center justify-center">
        <p className="mb-4">Please log in to view your profile.</p>
        <Link to="/login">
          <Button className="bg-game-button hover:bg-opacity-90 text-black">Login</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-game-bg to-game-panel/50 text-white">
      <NavigationBar />
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
            My <span className="text-game-gem">Account</span>
          </h1>
          <p className="text-gray-300">Manage your profile, view history, and more.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column: User Info & Actions */}
          <div className="md:col-span-1 space-y-6">
            <Card className="bg-game-panel/90 border-game-button/20 shadow-lg">
              <CardHeader className="flex flex-row items-center space-x-3 pb-4">
                <User className="w-8 h-8 text-game-gem" />
                <CardTitle className="text-xl text-white">Account Details</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-3">
                <p><strong>Username:</strong> {currentUser.username}</p>
                {currentUser.email && <p><strong>Email:</strong> {currentUser.email}</p>}
                <p className="flex items-center">
                  <Wallet className="w-5 h-5 mr-2 text-yellow-400" />
                  <strong>Balance:</strong>
                  <span className="ml-2 text-yellow-400 font-bold">${currentUser.money?.toFixed(2) || '0.00'}</span>
                </p>
              </CardContent>
            </Card>
            <Card className="bg-game-panel/90 border-game-button/20 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl text-white flex items-center">
                  <Settings className="w-6 h-6 mr-2 text-game-gem" /> Account Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start bg-transparent hover:bg-game-button/10 border-game-button/30 text-white">
                  Change Password (Coming Soon)
                </Button>
                <Button 
                  onClick={logout} 
                  variant="destructive" 
                  className="w-full justify-start bg-red-500/20 hover:bg-red-500/30 border-red-500/50 text-red-300 hover:text-red-200"
                >
                  <LogOut className="w-4 h-4 mr-2" /> Logout
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: History (Placeholder) */}
          <div className="md:col-span-2">
            <Card className="bg-game-panel/90 border-game-button/20 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl text-white flex items-center">
                  <History className="w-6 h-6 mr-2 text-game-gem" /> Activity History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Betting History</h3>
                    <div className="p-6 bg-game-bg/50 rounded-lg text-center text-gray-400">
                      <p>Your betting history will appear here.</p>
                      <p className="text-sm">(Feature coming soon)</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Transaction History</h3>
                    <div className="p-6 bg-game-bg/50 rounded-lg text-center text-gray-400">
                      <p>Your deposit and withdrawal history will appear here.</p>
                      <p className="text-sm">(Feature coming soon)</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;
