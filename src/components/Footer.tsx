import React from 'react';
import { Link } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#192a38]/90 border-t border-game-button/10 pt-10 pb-6 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="gem bg-game-gem w-6 h-6"></div>
              <span className="text-white font-bold text-xl">GemCasino</span>
            </div>
            <p className="text-gray-300 text-sm">
              The most exciting online gaming platform with fair play and instant payouts.
              Play responsibly and enjoy the thrill of winning!
            </p>
          </div>
          
          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li><Link to="/" className="hover:text-game-gem">Home</Link></li>
              <li><Link to="/leaderboard" className="hover:text-game-gem">Leaderboard</Link></li>
              <li><Link to="/how-to-play" className="hover:text-game-gem">How to Play</Link></li>
              <li><Link to="/login" className="hover:text-game-gem">Login / Register</Link></li>
            </ul>
          </div>
          
          {/* Games */}
          <div className="col-span-1">
            <h3 className="font-medium text-white mb-3">Games</h3>
            <ul className="space-y-2">
              <li><Link to="/dice-game" className="hover:text-game-gem">Dice Game</Link></li>
              <li><Link to="/rps-game" className="hover:text-game-gem">Rock Paper Scissors</Link></li>
              <li><Link to="/plinko-game" className="hover:text-game-gem">Plinko Game</Link></li>
              <li><Link to="/mines-hunt" className="hover:text-game-gem">Mines Hunt</Link></li>
              <li><Link to="/crash-game" className="hover:text-game-gem">Crash Game</Link></li>
            </ul>
          </div>
          
          {/* Legal & Support */}
          <div className="col-span-1">
            <h3 className="font-bold text-lg mb-4">Legal & Support</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li><Link to="/terms" className="hover:text-game-gem">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="hover:text-game-gem">Privacy Policy</Link></li>
              <li><Link to="/responsible-gaming" className="hover:text-game-gem">Responsible Gaming</Link></li>
              <li><Link to="/support" className="hover:text-game-gem">Support</Link></li>
              <li><Link to="/faq" className="hover:text-game-gem">FAQ</Link></li>
            </ul>
          </div>
        </div>
        
        <Separator className="my-6 bg-game-button/20" />
        
        <div className="text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} GemCasino. All rights reserved.</p>
          <p className="mt-2">
            Please play responsibly. Gambling should be entertaining and not seen as a way of making money.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
