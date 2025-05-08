import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Home, LogOut, Menu, User, X } from 'lucide-react';
import WalletBar from './WalletBar';
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";

const NavigationBar: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="w-full bg-[#192a38]/95 backdrop-blur-sm border-b border-game-button/10 z-50 sticky top-0">
      <div className="container mx-auto flex justify-between items-center py-3 px-4 md:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="rounded-full overflow-hidden w-9 h-9 bg-black/20">
            <img 
              src="/lovable-uploads/f864aefc-58f1-4b50-b96d-d8f7ecc8245e.png" 
              alt="Mischief Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-white font-bold text-xl">Mischief Casino</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/">
                  <NavigationMenuLink className={navigationMenuTriggerStyle() + " bg-transparent text-white hover:bg-game-panel hover:text-white"}>
                    <Home className="w-4 h-4 mr-2" />
                    Home
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-white hover:bg-game-panel hover:text-white">Games</NavigationMenuTrigger>
                <NavigationMenuContent className="bg-[#192a38]">
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {[
                      { name: "Dice Game", link: "/dice-game", description: "Bet on dice rolls with custom odds and multipliers!" },
                      { name: "Rock Paper Scissors", link: "/rps-game", description: "Test your luck against the computer and win big!" },
                      { name: "Plinko Game", link: "/plinko-game", description: "Drop the ball and watch it bounce for big multipliers!" },
                      { name: "Mines Hunt", link: "/mines-hunt", description: "Find the gems, avoid the mines! Test your luck and strategy." },
                      { name: "Crash Game", link: "/crash-game", description: "Watch the multiplier rise and cash out before it crashes!" },
                    ].map((game) => (
                      <li key={game.name} className="row-span-1">
                        <Link to={game.link}>
                          <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-[#2c3e50] hover:text-accent focus:bg-[#2c3e50] focus:text-accent-foreground">
                            <div className="text-sm font-medium leading-none text-[#c4d3df]">{game.name}</div>
                            <p className="line-clamp-2 text-sm leading-snug text-gray-400">
                              {game.description}
                            </p>
                          </NavigationMenuLink>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <Link to="/leaderboard">
                  <NavigationMenuLink className={navigationMenuTriggerStyle() + " bg-transparent text-white hover:bg-game-panel hover:text-white"}>
                    Leaderboard
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link to="/how-to-play">
                  <NavigationMenuLink className={navigationMenuTriggerStyle() + " bg-transparent text-white hover:bg-game-panel hover:text-white"}>
                    How to Play
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* User Section */}
        <div className="flex items-center gap-2">
          {currentUser && (
            <div className="hidden md:block mr-2">
              <WalletBar 
                balance={currentUser.money || 0} 
                onAddFunds={(amount) => {
                  // Handle add funds logic here
                }}
              />
            </div>
          )}
          
          {currentUser ? (
            <div className="flex items-center gap-2">
              <Link to="/profile">
                <Button variant="outline" size="sm" className="bg-transparent border-game-button/20 text-white hover:bg-game-button/10">
                  <User className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">{currentUser.username}</span>
                </Button>
              </Link>
              <Button 
                onClick={logout} 
                variant="outline" 
                size="sm" 
                className="bg-transparent border-game-button/20 text-white hover:bg-game-button/10"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline ml-2">Logout</span>
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button className="bg-game-button hover:bg-opacity-90 text-black">
                Login / Register
              </Button>
            </Link>
          )}
          
          {/* Mobile menu button */}
          <Button
            variant="outline"
            size="sm"
            className="md:hidden bg-transparent border-game-button/20 text-white hover:bg-game-button/10 ml-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </Button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#192a38] border-t border-game-button/10 animate-fade-in">
          <div className="px-4 py-2 space-y-2">
            <Link to="/" className="block px-3 py-2 rounded hover:bg-game-panel text-white" onClick={() => setMobileMenuOpen(false)}>
              <Home className="w-4 h-4 inline mr-2" />
              Home
            </Link>
            
            <div className="px-3 py-2 space-y-1">
              <div className="text-sm text-gray-300">Games</div>
              {[
                { name: "Dice Game", link: "/dice-game" },
                { name: "Rock Paper Scissors", link: "/rps-game" },
                { name: "Plinko Game", link: "/plinko-game" },
                { name: "Mines Hunt", link: "/mines-hunt" },
                { name: "Crash Game", link: "/crash-game" },
              ].map((game) => (
                <Link 
                  key={game.name} 
                  to={game.link} 
                  className="block pl-3 py-1 rounded hover:bg-game-panel text-white text-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {game.name}
                </Link>
              ))}
            </div>
            
            <Link to="/leaderboard" className="block px-3 py-2 rounded hover:bg-game-panel text-white" onClick={() => setMobileMenuOpen(false)}>
              Leaderboard
            </Link>
            
            <Link to="/how-to-play" className="block px-3 py-2 rounded hover:bg-game-panel text-white" onClick={() => setMobileMenuOpen(false)}>
              How to Play
            </Link>
            
            {currentUser && (
              <div className="pt-2 border-t border-game-button/20">
                <WalletBar 
                  balance={currentUser.money || 0} 
                  onAddFunds={(amount) => {
                    // Handle add funds logic here
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default NavigationBar;
