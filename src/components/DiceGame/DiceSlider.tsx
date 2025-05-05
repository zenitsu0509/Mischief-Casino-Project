
import React from 'react';
import { Slider } from '@/components/ui/slider';

interface DiceSliderProps {
  targetNumber: number;
  onTargetChange: (value: number) => void;
  isRollOver: boolean;
  rollResult: number | null;
}

const DiceSlider: React.FC<DiceSliderProps> = ({
  targetNumber,
  onTargetChange,
  isRollOver,
  rollResult
}) => {
  const handleSliderChange = (values: number[]) => {
    if (values.length > 0) {
      onTargetChange(values[0]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Slider Labels */}
      <div className="flex justify-between text-white px-2">
        <span>0</span>
        <span>25</span>
        <span>50</span>
        <span>75</span>
        <span>100</span>
      </div>
      
      {/* Custom Slider Track */}
      <div className="relative">
        <Slider 
          defaultValue={[50]}
          value={[targetNumber]}
          max={99.99}
          min={0.01}
          step={0.01}
          onValueChange={handleSliderChange}
          className="mt-2 mb-1"
        />
        
        {/* Custom styled tracker */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Red/Green background for under/over visualization */}
          <div className="absolute inset-y-0 left-0 bg-red-500 rounded-l-full rounded-r-none" 
               style={{ width: `${targetNumber}%` }} />
          <div className="absolute inset-y-0 right-0 bg-green-500 rounded-r-full rounded-l-none" 
               style={{ width: `${100 - targetNumber}%` }} />
               
          {/* Slider thumb */}
          <div className="absolute h-6 w-6 -mt-2 top-0 bg-blue-500 rounded transform -translate-x-1/2"
               style={{ left: `${targetNumber}%` }}>
            <div className="h-full w-full flex items-center justify-center text-blue-900 font-bold">
              <span className="text-xs">||</span>
            </div>
          </div>
          
          {/* Roll result indicator (if there's a result) */}
          {rollResult !== null && (
            <div className="absolute h-6 w-6 -mt-2 top-0 bg-yellow-400 border-2 border-white rounded-full transform -translate-x-1/2 animate-pulse"
                 style={{ left: `${rollResult}%` }}>
              <div className="h-full w-full flex items-center justify-center text-black font-bold">
                <span className="text-xs">!</span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Target number display */}
      <div className="text-center text-white text-lg font-bold">
        Target: {targetNumber.toFixed(2)} {isRollOver ? '(Roll Over)' : '(Roll Under)'}
      </div>
      
      {/* Result display */}
      {rollResult !== null && (
        <div className="text-center text-lg font-bold">
          <span className="text-white">Result: </span>
          <span className={rollResult > targetNumber === isRollOver ? 'text-green-400' : 'text-red-400'}>
            {rollResult.toFixed(2)}
          </span>
        </div>
      )}
    </div>
  );
};

export default DiceSlider;
