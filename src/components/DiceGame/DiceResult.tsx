
import React from 'react';

interface DiceResultProps {
  result: number;
  target: number;
  isRollOver: boolean;
  hasWon: boolean;
}

const DiceResult: React.FC<DiceResultProps> = ({
  result,
  target,
  isRollOver,
  hasWon
}) => {
  return (
    <div className={`p-4 rounded-md ${
      hasWon ? 'bg-green-500/20 border border-green-500/30' : 'bg-red-500/20 border border-red-500/30'
    }`}>
      <div className="text-center">
        <h4 className="text-lg font-bold text-gray-200 mb-2">Roll Result</h4>
        <div className="text-5xl font-bold mb-4">
          {result.toFixed(2)}
        </div>
        <div className={`text-lg font-medium ${hasWon ? 'text-green-400' : 'text-red-400'}`}>
          {isRollOver ? `${result.toFixed(2)} > ${target.toFixed(2)}` : `${result.toFixed(2)} < ${target.toFixed(2)}`}
        </div>
        <div className="mt-2 text-xl font-bold">
          {hasWon ? (
            <span className="text-green-400">WIN!</span>
          ) : (
            <span className="text-red-400">LOSS</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiceResult;
