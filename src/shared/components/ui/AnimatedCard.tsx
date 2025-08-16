import React from 'react';
import { motion } from 'framer-motion';
import Card from './Card';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  hover?: boolean;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  className = '',
  padding = 'md',
  shadow = 'md',
  delay = 0,
  direction = 'up',
  hover = true
}) => {
  const directions = {
    up: { y: 20, x: 0 },
    down: { y: -20, x: 0 },
    left: { y: 0, x: 20 },
    right: { y: 0, x: -20 }
  };

  const hoverAnimation = hover ? {
    y: -5,
    scale: 1.02,
    transition: { duration: 0.2 }
  } : {};

  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        ...directions[direction]
      }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        x: 0 
      }}
      transition={{ 
        duration: 0.5, 
        delay,
        ease: "easeOut"
      }}
      whileHover={hoverAnimation}
      className="h-full"
    >
      <Card
        className={`h-full transition-shadow duration-300 ${className}`}
        padding={padding}
        shadow={shadow}
      >
        {children}
      </Card>
    </motion.div>
  );
};

export default AnimatedCard;