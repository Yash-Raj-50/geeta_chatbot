"use client";
import React, { useEffect, useRef } from 'react';

interface SquigglyBordersProps {
  isActive: boolean;
}

const SquigglyBorders = ({ isActive }: SquigglyBordersProps) => {
  const pathRef1 = useRef<SVGPathElement>(null);
  const pathRef2 = useRef<SVGPathElement>(null);
  const pathRef3 = useRef<SVGPathElement>(null);
  const animationRef = useRef<number>(0);

  // Create path data for a rounded rectangle with wave-like edges
  const createSquigglyPath = (width: number, height: number, amplitude: number, frequency: number, phaseOffset: number = 0) => {
    // More points for smoother curves
    const pointsPerSide = 60;
    const path = [];
    
    // Add the offset to ensure the path stays outside the box
    const offset = -3; // Space between box and waves
    width -= offset * 2;
    height -= offset * 2;
    
    // Corner radius
    const cornerRadius = 15;
    
    // Pre-calculate some values for corner transitions
    const cornerTransition = Math.min(width, height) * 0.1; // 10% of the smaller dimension for corner transition
    
    // Top edge with phase offset for animation
    for (let i = 0; i <= pointsPerSide; i++) {
      const progress = i / pointsPerSide;
      const x = offset + (width * progress);
      
      // Enhanced corner smoothing - reduce amplitude more aggressively near corners
      let edgeFactor = 1;
      if (progress < 0.15) {
        edgeFactor = progress / 0.15; // Gradually increase from 0 to 1 in the first 15%
        edgeFactor = Math.pow(edgeFactor, 2); // Square it for more pronounced curve
      } else if (progress > 0.85) {
        edgeFactor = (1 - progress) / 0.15; // Gradually decrease from 1 to 0 in the last 15%
        edgeFactor = Math.pow(edgeFactor, 2); // Square it for more pronounced curve
      }
      
      const y = offset - (amplitude * edgeFactor * Math.sin(frequency * progress * Math.PI * 2 + phaseOffset));
      path.push(`${i === 0 ? 'M' : 'L'} ${x},${y}`);
    }
  
    // Right edge with smoother transition
    for (let i = 0; i <= pointsPerSide; i++) {
      const progress = i / pointsPerSide;
      const y = offset + (height * progress);
      
      // Enhanced corner smoothing
      let edgeFactor = 1;
      if (progress < 0.15) {
        edgeFactor = progress / 0.15;
        edgeFactor = Math.pow(edgeFactor, 2);
      } else if (progress > 0.85) {
        edgeFactor = (1 - progress) / 0.15;
        edgeFactor = Math.pow(edgeFactor, 2);
      }
      
      const x = offset + width + (amplitude * edgeFactor * Math.sin(frequency * progress * Math.PI * 2 + phaseOffset + Math.PI/2));
      path.push(`L ${x},${y}`);
    }
  
    // Bottom edge with smoother transition
    for (let i = pointsPerSide; i >= 0; i--) {
      const progress = i / pointsPerSide;
      const x = offset + (width * progress);
      
      // Enhanced corner smoothing
      let edgeFactor = 1;
      if (progress < 0.15) {
        edgeFactor = progress / 0.15;
        edgeFactor = Math.pow(edgeFactor, 2);
      } else if (progress > 0.85) {
        edgeFactor = (1 - progress) / 0.15;
        edgeFactor = Math.pow(edgeFactor, 2);
      }
      
      const y = offset + height + (amplitude * edgeFactor * Math.sin(frequency * progress * Math.PI * 2 + phaseOffset + Math.PI));
      path.push(`L ${x},${y}`);
    }
  
    // Left edge with smoother transition
    for (let i = pointsPerSide; i >= 0; i--) {
      const progress = i / pointsPerSide;
      const y = offset + (height * progress);
      
      // Enhanced corner smoothing
      let edgeFactor = 1;
      if (progress < 0.15) {
        edgeFactor = progress / 0.15;
        edgeFactor = Math.pow(edgeFactor, 2);
      } else if (progress > 0.85) {
        edgeFactor = (1 - progress) / 0.15;
        edgeFactor = Math.pow(edgeFactor, 2);
      }
      
      const x = offset - (amplitude * edgeFactor * Math.sin(frequency * progress * Math.PI * 2 + phaseOffset + Math.PI * 1.5));
      path.push(`L ${x},${y}`);
    }
  
    path.push('Z');
    return path.join(' ');
  };

  // Animation effect with phase animation
  useEffect(() => {
    if (!isActive) return;

    const container = document.querySelector('.squiggly-container');
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Set initial paths
    if (pathRef1.current) {
      pathRef1.current.setAttribute('d', createSquigglyPath(width, height, 8, 3, 0));
    }
    if (pathRef2.current) {
      pathRef2.current.setAttribute('d', createSquigglyPath(width, height, 12, 2.5, Math.PI/3));
    }
    if (pathRef3.current) {
      pathRef3.current.setAttribute('d', createSquigglyPath(width, height, 16, 2, Math.PI*2/3));
    }
    
    // Animate the paths with phase shifts - speed increased
    let frame = 0;
    const animate = () => {
      // Increased from 0.01 to 0.02 for faster animation
      frame += 0.02;
      
      if (pathRef1.current) {
        pathRef1.current.setAttribute('d', createSquigglyPath(width, height, 8, 3, frame));
      }
      if (pathRef2.current) {
        pathRef2.current.setAttribute('d', createSquigglyPath(width, height, 12, 2.5, frame + Math.PI/3));
      }
      if (pathRef3.current) {
        pathRef3.current.setAttribute('d', createSquigglyPath(width, height, 16, 2, frame + Math.PI*2/3));
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    // Start animation
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="squiggly-container absolute inset-0 pointer-events-none z-15">
      <svg className="absolute inset-0 w-full h-full overflow-visible" xmlns="http://www.w3.org/2000/svg">
        <path
          ref={pathRef1}
          className="squiggly-continuous-1"
          fill="none"
          stroke="rgba(79, 70, 229, 0.6)" // Indigo-600
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          ref={pathRef2}
          className="squiggly-continuous-2"
          fill="none" 
          stroke="rgba(109, 40, 217, 0.5)" // Purple-700
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          ref={pathRef3}
          className="squiggly-continuous-3"
          fill="none"
          stroke="rgba(67, 56, 202, 0.4)" // Indigo-700
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

export default SquigglyBorders;