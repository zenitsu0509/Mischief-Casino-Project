import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface WheelResultProps {
  multiplier: number | null;
  betAmount: number;
}

const WheelResult: React.FC<WheelResultProps> = ({ multiplier, betAmount }) => {
  const [show, setShow] = useState(false);
  const winAmount = multiplier !== null ? betAmount * multiplier : 0;

  useEffect(() => {
    if (multiplier !== null) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [multiplier]);

  if (!multiplier || !show) return null;

  return (
    <div className="absolute top-1/3 left-0 right-0 flex justify-center animate-fade-in">
      <Card className="bg-black/80 border-game-gem shadow-lg">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-bold text-white mb-2">
            {multiplier > 0 ? 'You Won!' : 'Better Luck Next Time!'}
          </h3>
          
          <p className="text-4xl font-bold mb-3">
            {multiplier > 0 ? (
              <span className="text-green-400">+${winAmount.toFixed(2)}</span>
            ) : (
              <span className="text-red-400">-${betAmount.toFixed(2)}</span>
            )}
          </p>
          
          <p className="text-gray-300 text-lg">
            Multiplier: <span className="font-bold text-yellow-400">{multiplier.toFixed(1)}x</span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default WheelResult;