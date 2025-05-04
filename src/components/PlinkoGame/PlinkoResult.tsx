
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface PlinkoResultProps {
  multiplier: number | null;
  betAmount: number;
}

const PlinkoResult: React.FC<PlinkoResultProps> = ({ multiplier, betAmount }) => {
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
            {multiplier >= 1 ? 'You Win!' : 'Try Again!'}
          </h3>
          <div className="text-3xl font-bold mb-2" style={{ color: multiplier >= 1 ? '#0bfc03' : '#ff2d55' }}>
            ${winAmount.toFixed(2)}
          </div>
          <div className="text-gray-400">
            {multiplier.toFixed(2)}x multiplier
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlinkoResult;
