import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Dice5, HandMetal, CircleDot, Target, TrendingUp, Coins, Mountain
} from 'lucide-react';

const HowToPlay = () => {
  const [activeTab, setActiveTab] = useState('dice-game');

  return (
    <div className="min-h-screen bg-gradient-to-b from-game-bg to-game-panel/50">
      <NavigationBar />
      
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
            How To <span className="text-game-gem">Play</span>
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Learn how to play our casino games and maximize your chances of winning.
          </p>
        </div>
        
        <Tabs 
          defaultValue="dice-game" 
          className="w-full"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <div className="flex justify-center mb-6 overflow-x-auto">
            <TabsList className="bg-game-panel/90 border border-game-button/20 grid grid-cols-2 md:grid-cols-7 gap-1 p-1">
              <TabsTrigger 
                value="dice-game" 
                className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300 text-white"
              >
                <Dice5 className="w-4 h-4 mr-2 md:mr-0 md:mb-1" />
                <span className="md:text-xs md:block">Dice Game</span>
              </TabsTrigger>
              <TabsTrigger 
                value="rps-game"
                className="data-[state=active]:bg-indigo-500/20 data-[state=active]:text-indigo-300 text-white"
              >
                <HandMetal className="w-4 h-4 mr-2 md:mr-0 md:mb-1" />
                <span className="md:text-xs md:block">Rock Paper Scissors</span>
              </TabsTrigger>
              <TabsTrigger 
                value="plinko-game"
                className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-300 text-white"
              >
                <CircleDot className="w-4 h-4 mr-2 md:mr-0 md:mb-1" />
                <span className="md:text-xs md:block">Plinko</span>
              </TabsTrigger>
              <TabsTrigger 
                value="mines-hunt"
                className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300 text-white"
              >
                <Target className="w-4 h-4 mr-2 md:mr-0 md:mb-1" />
                <span className="md:text-xs md:block">Mines Hunt</span>
              </TabsTrigger>
              <TabsTrigger 
                value="crash-game"
                className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-300 text-white"
              >
                <TrendingUp className="w-4 h-4 mr-2 md:mr-0 md:mb-1" />
                <span className="md:text-xs md:block">Crash Game</span>
              </TabsTrigger>
              <TabsTrigger 
                value="flip-game"
                className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-300 text-white"
              >
                <Coins className="w-4 h-4 mr-2 md:mr-0 md:mb-1" />
                <span className="md:text-xs md:block">Flip Game</span>
              </TabsTrigger>
              <TabsTrigger 
                value="dragon-tower"
                className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-300 text-white"
              >
                <Mountain className="w-4 h-4 mr-2 md:mr-0 md:mb-1" />
                <span className="md:text-xs md:block">Dragon Tower</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <Card className="bg-game-panel/90 border-game-button/20 shadow-lg">
            <CardContent className="p-6">
              <TabsContent value="dice-game" className="mt-0">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="md:w-1/3">
                    <div className="aspect-square bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                      <div className="text-7xl font-bold text-blue-400">
                        <Dice5 className="w-20 h-20" />
                      </div>
                    </div>
                  </div>
                  <div className="md:w-2/3">
                    <h2 className="text-2xl font-bold text-white mb-4">How to Play Dice Game</h2>
                    <div className="space-y-4 text-gray-300">
                      <p>
                        The Dice Game is a simple yet exciting game of chance where you bet on dice roll outcomes.
                      </p>
                      
                      <h3 className="text-lg font-bold text-white mt-6 mb-2">Game Rules:</h3>
                      <ol className="list-decimal pl-5 space-y-2">
                        <li>Choose whether you want to bet on a roll being "Over" or "Under" a certain number.</li>
                        <li>Adjust the slider to set your target number between 1 and 100.</li>
                        <li>The probability percentage shows your chance of winning based on your selection.</li>
                        <li>Enter your bet amount.</li>
                        <li>The potential payout is calculated based on the probability of your chosen outcome.</li>
                        <li>Click the "Roll Dice" button to play.</li>
                        <li>If the result matches your prediction (over or under your selected number), you win!</li>
                      </ol>
                      
                      <h3 className="text-lg font-bold text-white mt-6 mb-2">Strategy Tips:</h3>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>Lower probability bets offer higher payouts but are riskier.</li>
                        <li>Consider betting on higher probability outcomes for more consistent wins, though with smaller payouts.</li>
                        <li>Keep track of your bankroll and set limits for yourself.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="rps-game" className="mt-0">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="md:w-1/3">
                    <div className="aspect-square bg-gradient-to-r from-indigo-500/20 to-pink-500/20 rounded-lg flex items-center justify-center mb-4">
                      <div className="flex space-x-4">
                        <div className="text-3xl text-indigo-400">✊</div>
                        <div className="text-3xl text-pink-400">✋</div>
                        <div className="text-3xl text-purple-400">✌️</div>
                      </div>
                    </div>
                  </div>
                  <div className="md:w-2/3">
                    <h2 className="text-2xl font-bold text-white mb-4">How to Play Rock Paper Scissors</h2>
                    <div className="space-y-4 text-gray-300">
                      <p>
                        Rock Paper Scissors is a classic game of chance and strategy, now with betting to make it even more exciting!
                      </p>
                      
                      <h3 className="text-lg font-bold text-white mt-6 mb-2">Game Rules:</h3>
                      <ol className="list-decimal pl-5 space-y-2">
                        <li>Enter your bet amount.</li>
                        <li>Choose either Rock, Paper, or Scissors as your play.</li>
                        <li>The computer will randomly select its play.</li>
                        <li>Rock beats Scissors, Scissors beats Paper, Paper beats Rock.</li>
                        <li>If you win, you'll receive double your bet amount.</li>
                        <li>If you tie, your bet is returned.</li>
                        <li>If you lose, you forfeit your bet.</li>
                      </ol>
                      
                      <h3 className="text-lg font-bold text-white mt-6 mb-2">Strategy Tips:</h3>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>While each outcome has an equal probability, try to identify patterns in the computer's plays over time.</li>
                        <li>Manage your bankroll by not betting too large a percentage on any single game.</li>
                        <li>Consider setting a win/loss limit for your gaming session.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="plinko-game" className="mt-0">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="md:w-1/3">
                    <div className="aspect-square bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                      <div className="flex flex-col items-center justify-center">
                        <div className="relative mb-2">
                          <div className="w-10 h-10 bg-blue-400 rounded-full animate-bounce"></div>
                        </div>
                        <div className="grid grid-rows-3 gap-2">
                          {[5, 6, 7].map((num, rowIndex) => (
                            <div key={rowIndex} className="flex">
                              {[...Array(num)].map((_, i) => (
                                <div key={i} className="w-3 h-3 bg-blue-500 rounded-full mx-1"></div>
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="md:w-2/3">
                    <h2 className="text-2xl font-bold text-white mb-4">How to Play Plinko Game</h2>
                    <div className="space-y-4 text-gray-300">
                      <p>
                        Plinko is an exciting game where you drop a ball from the top of a pegged board and watch as it bounces its way down to multiplier slots at the bottom.
                      </p>
                      
                      <h3 className="text-lg font-bold text-white mt-6 mb-2">Game Rules:</h3>
                      <ol className="list-decimal pl-5 space-y-2">
                        <li>Set your bet amount for the round.</li>
                        <li>Choose your risk level: low risk offers more consistent but smaller wins, while high risk offers bigger potential payouts but less frequently.</li>
                        <li>Select a starting position at the top of the board to drop your ball.</li>
                        <li>Watch as the ball bounces downward through the pegs, taking a random path.</li>
                        <li>Your winnings are determined by which multiplier slot the ball lands in at the bottom.</li>
                        <li>Your payout is your bet amount multiplied by the landing slot's multiplier.</li>
                      </ol>
                      
                      <h3 className="text-lg font-bold text-white mt-6 mb-2">Strategy Tips:</h3>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>Consider your risk tolerance when choosing between low, medium, and high risk.</li>
                        <li>Some players believe the starting position affects outcomes, so you might experiment with different drop positions.</li>
                        <li>For longer play sessions, lower risk levels tend to preserve your bankroll better.</li>
                        <li>There's no way to predict exactly where the ball will land, so enjoy the unpredictability!</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="mines-hunt" className="mt-0">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="md:w-1/3">
                    <div className="aspect-square bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                      <div className="grid grid-cols-3 gap-2">
                        {[...Array(9)].map((_, i) => (
                          <div 
                            key={i} 
                            className={`w-12 h-12 rounded flex items-center justify-center ${i === 4 ? 'bg-blue-500' : 'bg-gray-700/50'}`}
                          >
                            {i === 4 && (
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                                <polygon points="6 8 17 5 21 18 9 21 4 8"></polygon>
                                <polygon points="10 12 6 8 4 8"></polygon>
                              </svg>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="md:w-2/3">
                    <h2 className="text-2xl font-bold text-white mb-4">How to Play Mines Hunt</h2>
                    <div className="space-y-4 text-gray-300">
                      <p>
                        Mines Hunt is a thrilling game of risk and reward where you search for gems while avoiding hidden mines.
                      </p>
                      
                      <h3 className="text-lg font-bold text-white mt-6 mb-2">Game Rules:</h3>
                      <ol className="list-decimal pl-5 space-y-2">
                        <li>Choose your bet amount for the round.</li>
                        <li>Select the number of mines you want hidden in the grid (more mines = higher potential rewards).</li>
                        <li>Click on grid tiles to reveal what's underneath.</li>
                        <li>If you find a gem, your potential payout increases and you can continue.</li>
                        <li>If you hit a mine, the game ends and you lose your bet.</li>
                        <li>You can cash out at any time to secure your current winnings.</li>
                        <li>The multiplier increases with each gem found, based on the probability of avoiding mines.</li>
                      </ol>
                      
                      <h3 className="text-lg font-bold text-white mt-6 mb-2">Strategy Tips:</h3>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>Know when to cash out! The temptation to find "just one more gem" often leads to hitting a mine.</li>
                        <li>Consider starting with fewer mines while learning the game.</li>
                        <li>The game is completely random, but some players develop patterns they trust to navigate the grid.</li>
                        <li>Set a target multiplier for each game and cash out once you reach it.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="crash-game" className="mt-0">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="md:w-1/3">
                    <div className="aspect-square bg-gradient-to-r from-red-500/20 to-yellow-500/20 rounded-lg flex items-center justify-center mb-4">
                      <div className="text-4xl font-bold text-red-500">
                        <span className="text-2xl">x</span>1.5<span className="text-yellow-400">+</span>
                      </div>
                    </div>
                  </div>
                  <div className="md:w-2/3">
                    <h2 className="text-2xl font-bold text-white mb-4">How to Play Crash Game</h2>
                    <div className="space-y-4 text-gray-300">
                      <p>
                        The Crash Game is an adrenaline-pumping game where you bet against a multiplier that could crash at any moment.
                      </p>
                      
                      <h3 className="text-lg font-bold text-white mt-6 mb-2">Game Rules:</h3>
                      <ol className="list-decimal pl-5 space-y-2">
                        <li>Place your bet before the round starts.</li>
                        <li>When the round begins, a multiplier starts at 1.00x and begins increasing.</li>
                        <li>The multiplier will randomly crash at some point, ending the round.</li>
                        <li>You must cash out before the crash to win.</li>
                        <li>If you cash out successfully, your bet is multiplied by the value at the time you cashed out.</li>
                        <li>If the game crashes before you cash out, you lose your bet.</li>
                        <li>You can also set an auto-cashout value to automatically secure your winnings at a specific multiplier.</li>
                      </ol>
                      
                      <h3 className="text-lg font-bold text-white mt-6 mb-2">Strategy Tips:</h3>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>Don't get greedy! Setting a reasonable auto-cashout can help secure profits.</li>
                        <li>Consider a strategy of cashing out at the same multiplier consistently.</li>
                        <li>Some players watch crash history to look for patterns (though each round is independent).</li>
                        <li>Remember that higher multipliers are riskier but offer bigger rewards.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="flip-game" className="mt-0">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="md:w-1/3">
                    <div className="aspect-square bg-gradient-to-r from-yellow-500/20 to-amber-500/20 rounded-lg flex items-center justify-center mb-4">
                      <div className="flex space-x-8 items-center">
                        <div className="text-4xl text-yellow-400">🪙</div>
                        <div className="text-4xl text-amber-400">💰</div>
                      </div>
                    </div>
                  </div>
                  <div className="md:w-2/3">
                    <h2 className="text-2xl font-bold text-white mb-4">How to Play Flip Game</h2>
                    <div className="space-y-4 text-gray-300">
                      <p>
                        Flip Game is a simple yet exciting game where you bet on the outcome of a coin flip.
                      </p>
                      
                      <h3 className="text-lg font-bold text-white mt-6 mb-2">Game Rules:</h3>
                      <ol className="list-decimal pl-5 space-y-2">
                        <li>Select your bet amount.</li>
                        <li>Choose either Heads or Tails for the coin flip.</li>
                        <li>Click the "Flip" button to start the game.</li>
                        <li>The coin will animate and reveal the result.</li>
                        <li>If your prediction is correct, you win double your bet amount.</li>
                        <li>If your prediction is incorrect, you lose your bet.</li>
                        <li>Consecutive wins increase your win streak, which may offer bonus multipliers.</li>
                      </ol>
                      
                      <h3 className="text-lg font-bold text-white mt-6 mb-2">Strategy Tips:</h3>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>Each flip is random and independent of previous flips.</li>
                        <li>The "gambler's fallacy" (believing that past flips affect future outcomes) doesn't apply here.</li>
                        <li>Consider increasing your bet after wins and decreasing after losses to manage your bankroll.</li>
                        <li>Take advantage of win streaks when bonus multipliers are activated.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="dragon-tower" className="mt-0">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="md:w-1/3">
                    <div className="aspect-square bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg flex items-center justify-center mb-4">
                      <div className="flex flex-col items-center">
                        <div className="text-4xl text-orange-400 mb-2">🐉</div>
                        <div className="flex space-x-2">
                          {[...Array(3)].map((_, i) => (
                            <div 
                              key={i}
                              className={`w-8 h-8 rounded-md flex items-center justify-center 
                                ${i === 1 ? 'bg-yellow-500/30 border border-yellow-500/70 -mt-2' : 'bg-gray-700/50'}`}
                            >
                              {i === 1 && (
                                <span className="text-yellow-400 text-lg">🥚</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="md:w-2/3">
                    <h2 className="text-2xl font-bold text-white mb-4">How to Play Dragon Tower</h2>
                    <div className="space-y-4 text-gray-300">
                      <p>
                        Dragon Tower is an exhilarating game where you climb a tower by finding dragon eggs while avoiding traps.
                      </p>
                      
                      <h3 className="text-lg font-bold text-white mt-6 mb-2">Game Rules:</h3>
                      <ol className="list-decimal pl-5 space-y-2">
                        <li>Choose your bet amount and difficulty level.</li>
                        <li>Each level of the tower has a row of tiles, with one egg and the rest being traps (the number depends on your difficulty level).</li>
                        <li>Click on a tile in the current level to try to find the egg.</li>
                        <li>If you find an egg, you advance to the next level of the tower.</li>
                        <li>Each level has its own multiplier, which increases as you climb higher.</li>
                        <li>If you hit a trap, the game ends and you lose your bet.</li>
                        <li>You can cash out at any time to secure your current winnings.</li>
                        <li>If you reach the top of the tower (Level 9), you win automatically with the maximum multiplier.</li>
                      </ol>
                      
                      <h3 className="text-lg font-bold text-white mt-6 mb-2">Difficulty Levels:</h3>
                      <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Easy:</strong> 4 tiles per row (3 eggs, 1 trap) - 75% chance of finding an egg</li>
                        <li><strong>Medium:</strong> 3 tiles per row (2 eggs, 1 trap) - 67% chance of finding an egg</li>
                        <li><strong>Hard:</strong> 2 tiles per row (1 egg, 1 trap) - 50% chance of finding an egg</li>
                        <li><strong>Expert:</strong> 3 tiles per row (1 egg, 2 traps) - 33% chance of finding an egg</li>
                        <li><strong>Master:</strong> 4 tiles per row (1 egg, 3 traps) - 25% chance of finding an egg</li>
                      </ul>
                      
                      <h3 className="text-lg font-bold text-white mt-6 mb-2">Strategy Tips:</h3>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>Lower difficulty levels offer better chances of climbing higher but with lower multipliers.</li>
                        <li>Higher difficulties are riskier but offer significantly better multipliers.</li>
                        <li>Consider cashing out when you've reached a multiplier that gives you a satisfying profit.</li>
                        <li>The positions of eggs are completely random, so don't stress too much about which tile to pick.</li>
                        <li>Setting a target level for cashing out before you start can help manage risk.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>
        
        {/* Back to Top Button */}
        <div className="flex justify-center mt-12 mb-8">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-game-panel/90 hover:bg-game-panel border border-game-button/30 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-all duration-300 hover:shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="18 15 12 9 6 15" />
            </svg>
            <span>Back to Top</span>
          </button>
        </div>
        
        {/* Call to Action */}
        <div className="bg-gradient-to-r from-game-panel to-[#2c3e50] rounded-xl p-8 md:p-12 mt-8 mb-16 border border-game-button/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to Test Your Skills?</h3>
              <p className="text-gray-300">
                Now that you know how to play, put your knowledge to the test and start winning!
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link to="/">
                <Button className="bg-game-button hover:bg-opacity-90 text-black px-8 py-4 rounded-lg font-medium">
                  Play Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default HowToPlay;