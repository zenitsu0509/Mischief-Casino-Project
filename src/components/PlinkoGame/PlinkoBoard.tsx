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
  const [containerHeight, setContainerHeight] = useState(0);
  const [landedSlot, setLandedSlot] = useState<number | null>(null);
  const pegSize = 10;
  const ballSize = 12;
  const animationRef = useRef<number | null>(null);
  const ballRef = useRef<Ball | null>(null); // Add a ref to track ball state in animation

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

  // Sync ball state with ref for animation
  useEffect(() => {
    ballRef.current = ball;
  }, [ball]);

  // Generate pegs based on number of rows and create an equilateral triangle
  useEffect(() => {
    if (!containerRef.current) return;
    
    const width = containerRef.current.clientWidth;
    const height = Math.round(width * 0.866); // height of equilateral triangle with base = width
    
    setContainerWidth(width);
    setContainerHeight(height);
    
    const pegsArray: Peg[] = [];
    const horizontalSpacing = width / (rows + 1);
    const verticalSpacing = height / (rows + 1);
    
    for (let r = 0; r < rows; r++) {
      const pegsInRow = r + 1;
      // Calculate horizontal offset to center pegs in each row
      const startX = (width - (pegsInRow - 1) * horizontalSpacing) / 2;
      
      for (let p = 0; p < pegsInRow; p++) {
        pegsArray.push({
          x: startX + horizontalSpacing * p,
          y: verticalSpacing * (r + 1),
        });
      }
    }
    
    setPegs(pegsArray);
  }, [rows, containerRef.current]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = Math.round(width * 0.866);
      setContainerWidth(width);
      setContainerHeight(height);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reset landed slot when starting a new drop
  useEffect(() => {
    if (isDropping) {
      setLandedSlot(null);
    }
  }, [isDropping]);

  // Cancel animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Animation logic with improved physics
  useEffect(() => {
    if (!isDropping || !containerRef.current) return;
    
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    const gravity = 0.2;
    const friction = 0.9;
    
    // Initialize ball at the top center with small random x-offset for natural motion
    const initialBall = {
      x: width / 2 + (Math.random() * 2 - 1), // Tiny offset for natural movement
      y: 20, // Start a bit below the top
      vx: 0,
      vy: 1, // Start with a small downward velocity to ensure movement
      landed: false,
      slot: null,
    };
    
    setBall(initialBall);
    ballRef.current = initialBall; // Also set the ref to initial ball state
    
    let lastTimestamp = 0;
    let isAnimating = true; // Flag to track if animation is running
    
    const animate = (timestamp: number) => {
      // Calculate delta time to ensure consistent animation regardless of frame rate
      const deltaTime = lastTimestamp ? (timestamp - lastTimestamp) / 16 : 1; // normalize to ~60fps
      lastTimestamp = timestamp;
      
      if (!ballRef.current || !isAnimating) return;
      
      let newBall = { ...ballRef.current };
      
      if (newBall.landed) {
        isAnimating = false;
        return;
      }
      
      let newX = newBall.x + newBall.vx * deltaTime;
      let newY = newBall.y + newBall.vy * deltaTime;
      let newVx = newBall.vx * friction;
      let newVy = newBall.vy + (gravity * deltaTime); // Apply gravity with deltaTime
      let hasLanded = false;
      let slotIndex = newBall.slot;
      
      // Add slight center bias to make the ball more likely to fall toward the center
      // This helps with the triangle distribution without being too obvious
      const centerBias = (width / 2 - newX) * 0.001;
      newVx += centerBias;
      
      // Check collision with pegs
      for (const peg of pegs) {
        const dx = newX - peg.x;
        const dy = newY - peg.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < pegSize + ballSize / 2) {
          // Ball hits a peg, calculate bounce vector
          const bounce = Math.random() > 0.5 ? 1 : -1;
          const bounceStrength = 1 + Math.random() * 0.5; // Random bounce strength
          
          newVx = bounce * bounceStrength;
          newVy = Math.abs(newVy * 0.5); // Reduce vertical velocity but keep it positive
          
          // Move ball outside of peg collision
          const angle = Math.atan2(dy, dx);
          const safeDistance = pegSize + ballSize / 2 + 1;
          newX = peg.x + Math.cos(angle) * safeDistance;
          newY = peg.y + Math.sin(angle) * safeDistance;
          break;
        }
      }
      
      // Check if ball reached bottom
      if (newY > height - ballSize / 2) {
        // Calculate which slot the ball landed in
        const slotWidth = width / multipliers.length;
        slotIndex = Math.min(
          Math.floor(newX / slotWidth), 
          multipliers.length - 1
        );
        
        // Make sure index is not negative
        if (slotIndex < 0) slotIndex = 0;
        
        hasLanded = true;
        isAnimating = false;
        
        // Set landed slot for highlighting
        setLandedSlot(slotIndex);
        
        // Trigger callback with the multiplier
        onBallLand(multipliers[slotIndex]);
        setIsDropping(false);
      }
      
      // Ensure ball stays within container bounds
      if (newX < ballSize / 2) {
        newX = ballSize / 2;
        newVx = Math.abs(newVx) * friction; // Bounce with friction
      } else if (newX > width - ballSize / 2) {
        newX = width - ballSize / 2;
        newVx = -Math.abs(newVx) * friction; // Bounce with friction
      }
      
      const updatedBall = {
        x: newX,
        y: newY,
        vx: newVx,
        vy: newVy,
        landed: hasLanded,
        slot: slotIndex
      };
      
      // Update both state and ref
      setBall(updatedBall);
      ballRef.current = updatedBall;
      
      // Continue animation if not landed
      if (isAnimating) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      isAnimating = false;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isDropping, pegs, multipliers]);

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
      className="relative w-full bg-game-bg/50 rounded-lg overflow-hidden"
      style={{ height: containerHeight || 600 }}
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
            className={`flex items-center justify-center h-12 ${getMultiplierColor(value)} text-white font-bold
              ${landedSlot === i ? 'border-t-4 border-white brightness-125 scale-y-110 transform origin-bottom' : ''}
            `}
            style={{ width: `${100 / multipliers.length}%` }}
          >
            {value.toFixed(value % 1 === 0 ? 0 : 1)}x
            {landedSlot === i && 
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white text-black px-2 py-1 rounded shadow-lg">
                Win: {value}x
              </div>
            }
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlinkoBoard;
