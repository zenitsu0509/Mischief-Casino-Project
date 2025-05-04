
import React, { useRef, useEffect, useState } from 'react';
import { Circle } from 'lucide-react';

interface PlinkoBoardProps {
  rows: number;
  risk: string;
  onBallLand: (multiplier: number) => void;
  isDropping: boolean;
  setIsDropping: (isDropping: boolean) => void;
}

interface Peg {
  x: number;
  y: number;
}

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  landed: boolean;
  slot: number | null;
}

const PlinkoBoard: React.FC<PlinkoBoardProps> = ({ 
  rows, 
  risk, 
  onBallLand, 
  isDropping,
  setIsDropping
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pegs, setPegs] = useState<Peg[]>([]);
  const [ball, setBall] = useState<Ball | null>(null);
  const [multipliers, setMultipliers] = useState<number[]>([]);
  const [containerWidth, setContainerWidth] = useState(0);
  const pegSize = 10;
  const ballSize = 12;

  // Generate multipliers based on risk level
  useEffect(() => {
    let mults: number[] = [];
    const slotsCount = rows + 1;
    
    switch(risk) {
      case 'Low':
        mults = generateMultipliers(slotsCount, 'low');
        break;
      case 'Medium':
        mults = generateMultipliers(slotsCount, 'medium');
        break;
      case 'High':
        mults = generateMultipliers(slotsCount, 'high');
        break;
      default:
        mults = generateMultipliers(slotsCount, 'medium');
    }
    
    setMultipliers(mults);
  }, [risk, rows]);

  // Generate pegs based on number of rows
  useEffect(() => {
    if (!containerRef.current) return;
    
    const width = containerRef.current.clientWidth;
    setContainerWidth(width);
    
    const pegsArray: Peg[] = [];
    const spacing = width / (rows + 1);
    
    for (let r = 0; r < rows; r++) {
      const pegsInRow = r + 1;
      const rowOffset = r % 2 === 0 ? 0 : spacing / 2;
      
      for (let p = 0; p < pegsInRow; p++) {
        pegsArray.push({
          x: rowOffset + spacing * p + spacing,
          y: (r + 2) * spacing,
        });
      }
    }
    
    setPegs(pegsArray);
  }, [rows, containerRef.current]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      setContainerWidth(containerRef.current.clientWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Animation logic
  useEffect(() => {
    if (!isDropping || !containerRef.current) return;
    
    const width = containerRef.current.clientWidth;
    const spacing = width / (rows + 1);
    
    // Initialize ball at the top center
    setBall({
      x: width / 2,
      y: spacing,
      vx: 0,
      vy: 1,
      landed: false,
      slot: null,
    });
    
    const animate = () => {
      setBall(prevBall => {
        if (!prevBall) return null;
        if (prevBall.landed) return prevBall;
        
        let newX = prevBall.x + prevBall.vx;
        let newY = prevBall.y + prevBall.vy;
        let newVx = prevBall.vx;
        let newVy = prevBall.vy;
        let hasLanded = prevBall.landed;
        let slotIndex = prevBall.slot;
        
        // Check collision with pegs
        for (const peg of pegs) {
          const dx = newX - peg.x;
          const dy = newY - peg.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < pegSize + ballSize / 2) {
            // Ball hits a peg, bounce left or right randomly
            const direction = Math.random() > 0.5 ? 1 : -1;
            newVx = direction * 2;
            newVy = 2;
            newX = peg.x + direction * (pegSize + ballSize / 2);
            break;
          }
        }
        
        // Check if ball reached bottom
        if (newY > (rows + 2) * spacing) {
          // Calculate which slot the ball landed in
          const slotWidth = width / multipliers.length;
          slotIndex = Math.min(
            Math.floor(newX / slotWidth), 
            multipliers.length - 1
          );
          hasLanded = true;
          
          // Trigger callback with the multiplier
          onBallLand(multipliers[slotIndex]);
          setIsDropping(false);
        }
        
        // Ensure ball stays within container bounds
        if (newX < ballSize / 2) {
          newX = ballSize / 2;
          newVx = Math.abs(newVx);
        } else if (newX > width - ballSize / 2) {
          newX = width - ballSize / 2;
          newVx = -Math.abs(newVx);
        }
        
        return {
          x: newX,
          y: newY,
          vx: newVx,
          vy: newVy,
          landed: hasLanded,
          slot: slotIndex
        };
      });
      
      if (ball && !ball.landed) {
        requestAnimationFrame(animate);
      }
    };
    
    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [isDropping, pegs, rows, multipliers]);

  // Generate multipliers based on risk level
  const generateMultipliers = (count: number, riskLevel: string): number[] => {
    const mults: number[] = [];
    
    if (riskLevel === 'low') {
      // Low risk: More consistent payouts, lower maximum values
      for (let i = 0; i < count; i++) {
        const position = Math.abs((i - (count - 1) / 2) / ((count - 1) / 2));
        let multiplier;
        
        if (position < 0.2) multiplier = 1;
        else if (position < 0.4) multiplier = 1.5;
        else if (position < 0.6) multiplier = 2;
        else if (position < 0.8) multiplier = 3;
        else multiplier = 5;
        
        mults.push(multiplier);
      }
    } else if (riskLevel === 'medium') {
      // Medium risk: Balanced distribution
      for (let i = 0; i < count; i++) {
        const position = Math.abs((i - (count - 1) / 2) / ((count - 1) / 2));
        let multiplier;
        
        if (position < 0.15) multiplier = 1;
        else if (position < 0.3) multiplier = 1.5;
        else if (position < 0.45) multiplier = 3;
        else if (position < 0.6) multiplier = 5;
        else if (position < 0.75) multiplier = 10;
        else if (position < 0.9) multiplier = 41;
        else multiplier = 110;
        
        mults.push(multiplier);
      }
    } else { // high
      // High risk: Extreme values at the edges
      for (let i = 0; i < count; i++) {
        const position = Math.abs((i - (count - 1) / 2) / ((count - 1) / 2));
        let multiplier;
        
        if (position < 0.15) multiplier = 0.5;
        else if (position < 0.3) multiplier = 1;
        else if (position < 0.45) multiplier = 3;
        else if (position < 0.6) multiplier = 10;
        else if (position < 0.75) multiplier = 45;
        else if (position < 0.9) multiplier = 130;
        else multiplier = 300;
        
        mults.push(multiplier);
      }
    }
    
    return mults;
  };
  
  // Get color based on multiplier value
  const getMultiplierColor = (value: number): string => {
    if (value >= 100) return 'bg-red-500';
    if (value >= 40) return 'bg-red-400';
    if (value >= 10) return 'bg-orange-500';
    if (value >= 5) return 'bg-orange-400';
    if (value >= 3) return 'bg-amber-500';
    if (value >= 1.5) return 'bg-amber-400';
    if (value >= 1) return 'bg-yellow-400';
    return 'bg-yellow-500';
  };

  return (
    <div 
      ref={containerRef} 
      className="relative h-[600px] w-full bg-game-bg/50 rounded-lg overflow-hidden"
    >
      {/* Pegs */}
      {pegs.map((peg, i) => (
        <div 
          key={`peg-${i}`} 
          className="absolute rounded-full bg-white"
          style={{
            width: `${pegSize}px`,
            height: `${pegSize}px`,
            left: `${peg.x - pegSize / 2}px`,
            top: `${peg.y - pegSize / 2}px`
          }}
        />
      ))}
      
      {/* Ball */}
      {ball && (
        <div 
          className="absolute rounded-full bg-yellow-400 shadow-lg"
          style={{
            width: `${ballSize}px`,
            height: `${ballSize}px`,
            left: `${ball.x - ballSize / 2}px`,
            top: `${ball.y - ballSize / 2}px`
          }}
        />
      )}
      
      {/* Multiplier slots */}
      <div className="absolute bottom-0 w-full flex">
        {multipliers.map((value, i) => (
          <div 
            key={`slot-${i}`} 
            className={`flex items-center justify-center h-12 ${getMultiplierColor(value)} text-white font-bold`}
            style={{ width: `${100 / multipliers.length}%` }}
          >
            {value.toFixed(value % 1 === 0 ? 0 : 1)}x
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlinkoBoard;
