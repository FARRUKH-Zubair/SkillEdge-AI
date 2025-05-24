'use client'

import React, { useEffect, useRef, useState } from 'react';
import AnimatedCounter from './animations/animated-counter';

export default function StatsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
      {[
        { value: 50, label: 'Industries Covered', suffix: '+' },
        { value: 1000, label: 'Interview Questions', suffix: '+' },
        { value: 95, label: 'Success Rate', suffix: '%' },
        { value: 24, label: 'AI Support', suffix: '/7' },
      ].map((item, index) => (
        <div key={index} className="flex flex-col items-center justify-center space-y-2">
          <h3 className="text-4xl font-bold">
            <AnimatedCounter target={item.value} isVisible={isVisible} />
            {item.suffix}
          </h3>
          <p className="text-muted-foreground">{item.label}</p>
        </div>
      ))}
    </div>
  );
} 