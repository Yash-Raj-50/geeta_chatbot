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
    const offset = 5; // Space between box and waves
    
    // Top edge with phase offset for animation
    for (let i = 0; i <= pointsPerSide; i++) {
      const progress = i / pointsPerSide;
      const x = offset + (width - 2 * offset) * progress;
      
      // Enhanced corner smoothing
      let edgeFactor = 1;
      if (progress < 0.15) {
        edgeFactor = progress / 0.15;
        edgeFactor = Math.pow(edgeFactor, 2);
      } else if (progress > 0.85) {
        edgeFactor = (1 - progress) / 0.15;
        edgeFactor = Math.pow(edgeFactor, 2);
      }
      
      const y = offset - (amplitude * edgeFactor * Math.sin(frequency * progress * Math.PI * 2 + phaseOffset));
      path.push(`${i === 0 ? 'M' : 'L'} ${x},${y}`);
    }

    // Right edge with smoother transition
    for (let i = 0; i <= pointsPerSide; i++) {
      const progress = i / pointsPerSide;
      const y = offset + (height - 2 * offset) * progress;
      
      // Enhanced corner smoothing
      let edgeFactor = 1;
      if (progress < 0.15) {
        edgeFactor = progress / 0.15;
        edgeFactor = Math.pow(edgeFactor, 2);
      } else if (progress > 0.85) {
        edgeFactor = (1 - progress) / 0.15;
        edgeFactor = Math.pow(edgeFactor, 2);
      }
      
      const x = width - offset + (amplitude * edgeFactor * Math.sin(frequency * progress * Math.PI * 2 + phaseOffset + Math.PI/2));
      path.push(`L ${x},${y}`);
    }

    // Bottom edge with smoother transition
    for (let i = pointsPerSide; i >= 0; i--) {
      const progress = i / pointsPerSide;
      const x = offset + (width - 2 * offset) * progress;
      
      // Enhanced corner smoothing
      let edgeFactor = 1;
      if (progress < 0.15) {
        edgeFactor = progress / 0.15;
        edgeFactor = Math.pow(edgeFactor, 2);
      } else if (progress > 0.85) {
        edgeFactor = (1 - progress) / 0.15;
        edgeFactor = Math.pow(edgeFactor, 2);
      }
      
      const y = height - offset + (amplitude * edgeFactor * Math.sin(frequency * progress * Math.PI * 2 + phaseOffset + Math.PI));
      path.push(`L ${x},${y}`);
    }

    // Left edge with smoother transition
    for (let i = pointsPerSide; i >= 0; i--) {
      const progress = i / pointsPerSide;
      const y = offset + (height - 2 * offset) * progress;
      
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

    const updatePaths = () => {
      const container = document.querySelector('.squiggly-container');
      if (!container) return;
  
      const rect = container.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      
      // Animate the paths with phase shifts
      let frame = 0;
      
      const animate = () => {
        // Animation speed
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
      animate();
    };
    
    updatePaths();
    
    // Clean up animation frame on unmount
    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="squiggly-container absolute inset-0 pointer-events-none">
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