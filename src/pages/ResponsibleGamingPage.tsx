import React from 'react';
import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const ResponsibleGamingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-game-bg to-game-panel/50 text-white">
      <NavigationBar />
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Responsible <span className="text-game-gem">Gaming</span>
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            We are committed to providing a safe and responsible gaming environment.
          </p>
        </div>
        
        <Card className="bg-game-panel/90 border-game-button/20 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-white">Our Commitment</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <p>Mischief Casino is dedicated to ensuring a responsible gaming experience for all our players. We believe that gaming should be an enjoyable form of entertainment, and we strive to prevent problem gambling.</p>
            
            <h3 className="text-lg font-semibold text-white pt-4">1. Understanding Problem Gambling</h3>
            <p>Problem gambling can affect anyone. It's important to recognize the signs, such as spending more money or time than intended, chasing losses, or gambling impacting your personal life or responsibilities.</p>
            
            <h3 className="text-lg font-semibold text-white pt-4">2. Tools for Responsible Gaming</h3>
            <p>We offer several tools to help you stay in control:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Deposit Limits:</strong> Set daily, weekly, or monthly limits on the amount you can deposit.</li>
              <li><strong>Session Limits:</strong> Control the amount of time you spend playing in a single session.</li>
              <li><strong>Self-Exclusion:</strong> If you feel you need a break, you can temporarily or permanently exclude yourself from our platform.</li>
              <li><strong>Activity Statements:</strong> Track your gaming history, including bets, wins, and losses.</li>
            </ul>
            <p>You can access these tools through your account settings or by contacting our support team.</p>
            
            <h3 className="text-lg font-semibold text-white pt-4">3. Tips for Playing Responsibly</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Gamble for entertainment, not as a way to make money.</li>
              <li>Only gamble with money you can afford to lose.</li>
              <li>Set a budget and stick to it.</li>
              <li>Don't chase your losses.</li>
              <li>Balance gambling with other activities.</li>
              <li>Take regular breaks.</li>
              <li>Be aware of the signs of problem gambling.</li>
            </ul>
            
            <h3 className="text-lg font-semibold text-white pt-4">4. Underage Gambling</h3>
            <p>It is illegal for anyone under the age of 18 to gamble. We perform age verification checks and take measures to prevent underage access to our platform.</p>
            
            <h3 className="text-lg font-semibold text-white pt-4">5. Getting Help</h3>
            <p>If you or someone you know is struggling with problem gambling, help is available. We recommend contacting organizations such as:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>GamCare (www.gamcare.org.uk)</li>
              <li>Gamblers Anonymous (www.gamblersanonymous.org)</li>
              <li>National Council on Problem Gambling (www.ncpgambling.org)</li>
            </ul>
            <p>You can also reach out to our support team for guidance and resources.</p>
            
            <div className="mt-8 text-center">
              <Link to="/support">
                <Button className="bg-game-button hover:bg-opacity-90 text-black px-6 py-3">
                  Contact Support for Assistance
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default ResponsibleGamingPage;
