import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import './CustomCursor.css';

export default function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);
  
  // Smooth position for the outer ring
  const ringX = useSpring(dotX, { damping: 25, stiffness: 150 });
  const ringY = useSpring(dotY, { damping: 25, stiffness: 150 });

  useEffect(() => {
    // Check if it's a touch device, in which case we don't show the custom cursor
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      setIsTouchDevice(true);
      return;
    }

    let rafId: number;

    const mouseMove = (e: MouseEvent) => {
      // Use requestAnimationFrame for better performance
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        dotX.set(e.clientX);
        dotY.set(e.clientY);
        if (!isVisible) setIsVisible(true);
      });
    };

    const handleHoverStart = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('.btn') || 
        target.closest('a')
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', mouseMove, { passive: true });
    window.addEventListener('mouseover', handleHoverStart, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', mouseMove);
      window.removeEventListener('mouseover', handleHoverStart);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible, dotX, dotY]);

  if (!isVisible || isTouchDevice) return null;

  return (
    <div className="custom-cursor-container">
      {/* Small Dot */}
      <motion.div 
        className="cursor-dot"
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%'
        }}
        animate={{
          scale: isHovered ? 1.5 : 1
        }}
        transition={{ type: 'tween', ease: 'backOut', duration: 0.1 }}
      />
      
      {/* Outer Ring */}
      <motion.div 
        className={`cursor-ring ${isHovered ? 'cursor-ring--hover' : ''}`}
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%'
        }}
        animate={{
          scale: isHovered ? 1.8 : 1,
          borderColor: isHovered ? 'var(--color-gold)' : 'rgba(201, 168, 76, 0.4)'
        }}
      />
    </div>
  );
}
