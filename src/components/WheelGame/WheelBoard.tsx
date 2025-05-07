import React, { useEffect, useState, useRef } from 'react';

interface WheelBoardProps {
  segments: number;
  risk: string;
  onWheelStop: (multiplier: number) => void;
  isSpinning: boolean;
  setIsSpinning: (isSpinning: boolean) => void;
  setMultipliers: (multipliers: number[]) => void;
}

const WheelBoard: React.FC<WheelBoardProps> = ({
  segments,
  risk,
  onWheelStop,
  isSpinning,
  setIsSpinning,
  setMultipliers,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState(0);
  const [currentMultipliers, setCurrentMultipliers] = useState<number[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  
  const animationRef = useRef<number | null>(null);
  const spinTimeRef = useRef<number>(0);
  const spinStartTSRef = useRef<number | null>(null);
  const spinDurationRef = useRef<number>(3000); // 3 seconds spin
  const pointerRef = useRef<HTMLDivElement>(null);
  
  // Generate multipliers based on risk level
  useEffect(() => {
    const mults = generateMultipliers(segments, risk);
    setCurrentMultipliers(mults);
    setMultipliers(mults);
  }, [segments, risk, setMultipliers]);
  
  // Draw the wheel whenever the segments or multipliers change
  useEffect(() => {
    if (!canvasRef.current || !currentMultipliers.length) return;
    drawWheel();
  }, [currentMultipliers, segments, rotation]);

  // Handle spinning animation
  useEffect(() => {
    if (!isSpinning) return;
    
    // Reset rotation and refs for new spin
    spinTimeRef.current = 0;
    spinStartTSRef.current = null;
    const targetSegmentIndex = getRandomSegmentIndex(currentMultipliers, risk);
    setSelectedIndex(null); // Reset selected index when starting a new spin
    
    // Function to handle spinning animation
    const spinWheel = (timestamp: number) => {
      if (spinStartTSRef.current === null) spinStartTSRef.current = timestamp;
      // Calculate elapsed time based on timestamp
      spinTimeRef.current = timestamp - spinStartTSRef.current!;
      const progress = Math.min(spinTimeRef.current / spinDurationRef.current, 1);
      
      // Easing functions to make spin more natural
      const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
      const rotation = easeOut(progress) * 360 * 5; // Spin multiple times
      
      // Calculate the rotation to land on the target segment
      const segmentAngle = 360 / segments;
      const targetRotation = targetSegmentIndex * segmentAngle;
      const totalRotation = rotation + targetRotation;
      setRotation(totalRotation % 360);
      
      // Continue animation if not complete
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(spinWheel);
      } else {
        // Animation is complete, ensure wheel stops at exact position
        const finalRotation = targetSegmentIndex * segmentAngle;
        setRotation(finalRotation);
        setSelectedIndex(targetSegmentIndex);
        setIsSpinning(false);
        onWheelStop(currentMultipliers[targetSegmentIndex]);
      }
    };
    
    // Start animation
    animationRef.current = requestAnimationFrame(spinWheel);
    
    // Force stop after spinDuration as a failsafe
    const timeoutId = window.setTimeout(() => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
        
        // Ensure final position is set correctly
        const segmentAngle = 360 / segments;
        const finalRotation = targetSegmentIndex * segmentAngle;
        setRotation(finalRotation);
        setSelectedIndex(targetSegmentIndex);
        setIsSpinning(false);
        onWheelStop(currentMultipliers[targetSegmentIndex]);
        console.log('Wheel spin force-stopped by timeout');
      }
    }, spinDurationRef.current + 100); // Add small buffer
    
    // Cleanup on effect cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      clearTimeout(timeoutId);
    };
  }, [isSpinning, currentMultipliers, segments, risk, onWheelStop, setIsSpinning]);

  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const drawWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 10;
    const segmentAngle = (2 * Math.PI) / segments;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw each segment
    for (let i = 0; i < segments; i++) {
      const startAngle = i * segmentAngle + (rotation * (Math.PI / 180));
      const endAngle = (i + 1) * segmentAngle + (rotation * (Math.PI / 180));
      
      // Get color based on multiplier
      const color = getSegmentColor(currentMultipliers[i]);
      
      // Draw segment
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#1a2434';
      ctx.stroke();
      
      // Draw text
      ctx.save();
      ctx.translate(centerX, centerY);
      const textAngle = startAngle + (segmentAngle / 2);
      ctx.rotate(textAngle);
      ctx.translate(radius * 0.75, 0);
      ctx.rotate(Math.PI / 2);
      
      ctx.fillStyle = '#fff';
      ctx.font = segments > 30 ? '10px Arial' : '14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Format the multiplier text
      const multiplierText = `${currentMultipliers[i].toFixed(currentMultipliers[i] % 1 === 0 ? 0 : 1)}x`;
      ctx.fillText(multiplierText, 0, 0);
      ctx.restore();
    }
    
    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.15, 0, 2 * Math.PI);
    ctx.fillStyle = '#10212e';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#fff';
    ctx.stroke();
  };

  const getRandomSegmentIndex = (multipliers: number[], risk: string): number => {
    const riskFactors = {
      'Low': [70, 20, 10],     // 70% low, 20% medium, 10% high multipliers
      'Medium': [30, 40, 30],   // 30% low, 40% medium, 30% high multipliers
      'High': [15, 25, 60]      // 15% low, 25% medium, 60% high multipliers
    };
    
    const factors = riskFactors[risk as keyof typeof riskFactors] || riskFactors.Medium;
    
    // Sort multipliers to determine low, medium, high ranges
    const sortedIndices = [...multipliers.keys()].sort((a, b) => multipliers[a] - multipliers[b]);
    
    const lowCount = Math.floor(sortedIndices.length * 0.4); // 40% lowest multipliers
    const highCount = Math.floor(sortedIndices.length * 0.3); // 30% highest multipliers
    const midCount = sortedIndices.length - lowCount - highCount; // remaining are medium
    
    const lowIndices = sortedIndices.slice(0, lowCount);
    const midIndices = sortedIndices.slice(lowCount, lowCount + midCount);
    const highIndices = sortedIndices.slice(lowCount + midCount);
    
    // Randomly determine which group to pick from based on risk factors
    const rand = Math.random() * 100;
    
    if (rand < factors[0]) {
      // Pick from low multipliers
      return lowIndices[Math.floor(Math.random() * lowIndices.length)];
    } else if (rand < factors[0] + factors[1]) {
      // Pick from medium multipliers
      return midIndices[Math.floor(Math.random() * midIndices.length)];
    } else {
      // Pick from high multipliers
      return highIndices[Math.floor(Math.random() * highIndices.length)];
    }
  };

  const generateMultipliers = (count: number, riskLevel: string): number[] => {
    const mults: number[] = [];
    
    if (riskLevel === 'Low') {
      // Low risk: More consistent payouts, lower maximum values
      for (let i = 0; i < count; i++) {
        const position = i / count;
        let multiplier;
        
        if (position < 0.05) multiplier = 0;
        else if (position < 0.2) multiplier = 0.5;
        else if (position < 0.4) multiplier = 1;
        else if (position < 0.6) multiplier = 1.5;
        else if (position < 0.8) multiplier = 2;
        else if (position < 0.9) multiplier = 3;
        else multiplier = 4;
        
        mults.push(multiplier);
      }
    } else if (riskLevel === 'Medium') {
      // Medium risk: Balanced distribution
      for (let i = 0; i < count; i++) {
        const position = i / count;
        let multiplier;
        
        if (position < 0.1) multiplier = 0;
        else if (position < 0.2) multiplier = 0.5;
        else if (position < 0.3) multiplier = 1;
        else if (position < 0.45) multiplier = 1.5;
        else if (position < 0.6) multiplier = 2;
        else if (position < 0.7) multiplier = 3;
        else if (position < 0.8) multiplier = 5;
        else if (position < 0.9) multiplier = 10;
        else multiplier = 20;
        
        mults.push(multiplier);
      }
    } else { // High risk
      // High risk: More extreme values
      for (let i = 0; i < count; i++) {
        const position = i / count;
        let multiplier;
        
        if (position < 0.15) multiplier = 0;
        else if (position < 0.3) multiplier = 0.5;
        else if (position < 0.4) multiplier = 1;
        else if (position < 0.5) multiplier = 1.5;
        else if (position < 0.6) multiplier = 2;
        else if (position < 0.7) multiplier = 5;
        else if (position < 0.8) multiplier = 10;
        else if (position < 0.9) multiplier = 25;
        else multiplier = 50;
        
        mults.push(multiplier);
      }
    }
    
    // Shuffle multipliers to make them random around the wheel
    for (let i = mults.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [mults[i], mults[j]] = [mults[j], mults[i]];
    }
    
    return mults;
  };

  // Get color based on multiplier value
  const getSegmentColor = (value: number): string => {
    if (value === 0) return 'rgb(255, 45, 85)'; // Same as game-mine
    if (value === 0.5) return '#e11d48'; // red-600
    if (value <= 1) return '#7e22ce'; // purple-700
    if (value <= 2) return '#4f46e5'; // indigo-600
    if (value <= 5) return '#2563eb'; // blue-600
    if (value <= 10) return '#059669'; // emerald-600
    if (value <= 20) return '#65a30d'; // lime-600
    if (value <= 30) return '#ca8a04'; // yellow-600
    if (value <= 40) return '#ea580c'; // orange-600
    return '#dc2626'; // red-600
  };

  // Define key multipliers to show in the legend
  const keyMultipliers = [0.00, 1.50, 1.70, 2.00, 3.00, 4.00];

  return (
    <div className="relative w-full rounded-lg overflow-hidden flex flex-col items-center justify-center bg-game-bg/50 py-8">
      {/* Wheel container */}
      <div className="relative max-w-md w-full aspect-square">
        <canvas 
          ref={canvasRef} 
          width={500} 
          height={500} 
          className="w-full h-full"
        />
        
        {/* Pointer indicator */}
        <div 
          ref={pointerRef}
          className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0 h-0 border-l-[15px] border-r-[15px] border-b-[30px] border-l-transparent border-r-transparent border-b-red-500 z-10"
          style={{ filter: 'drop-shadow(0 0 5px rgba(0,0,0,0.5))' }}
        />
      </div>

      {/* Multiplier legend similar to image */}
      <div className="mt-6 grid grid-cols-6 gap-2 w-full max-w-4xl">
        {keyMultipliers.map((mult) => {
          const bgColor = getSegmentColor(mult);
          return (
            <div 
              key={mult} 
              className="relative rounded-md overflow-hidden bg-[#1a323f] p-3 flex items-center justify-center text-white font-bold"
            >
              <div className="text-center z-10">{mult.toFixed(2)}×</div>
              <div 
                className="absolute bottom-0 left-0 right-0 h-1"
                style={{ backgroundColor: bgColor }}
              />
            </div>
          );
        })}
      </div>

      {/* Display current multiplier if available */}
      {selectedIndex !== null && (
        <div className="mt-4 text-center">
          <p className="text-lg text-white">
            Result: <span className="font-bold text-yellow-400">{currentMultipliers[selectedIndex].toFixed(1)}x</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default WheelBoard;
