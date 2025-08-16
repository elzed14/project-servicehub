import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface RealTimeCounterProps {
  value: number;
  duration?: number;
  suffix?: string;
  className?: string;
}

export const RealTimeCounter: React.FC<RealTimeCounterProps> = ({
  value,
  duration = 1000,
  suffix = '',
  className = ''
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [prevValue, setPrevValue] = useState(0);

  useEffect(() => {
    if (value !== prevValue) {
      const startValue = prevValue;
      const endValue = value;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        
        const currentValue = Math.floor(startValue + (endValue - startValue) * easeOutQuart);
        setDisplayValue(currentValue);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setDisplayValue(endValue);
          setPrevValue(endValue);
        }
      };

      animate();
    }
  }, [value, prevValue, duration]);

  return (
    <motion.span
      key={value}
      initial={{ scale: 1 }}
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      {displayValue.toLocaleString()}{suffix}
    </motion.span>
  );
};