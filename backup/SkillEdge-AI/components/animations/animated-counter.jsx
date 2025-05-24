'use client'

import { useEffect, useState } from 'react';

export default function AnimatedCounter({ target, duration = 2000, isVisible = false }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Only start animation if isVisible is true
    if (!isVisible) return;

    let start = 0;
    const end = parseInt(target);
    if (isNaN(end)) return;

    const increment = end / (duration / 16); // ~60fps
    const handle = setInterval(() => {
      start += increment;
      if (start >= end) {
        clearInterval(handle);
        setCount(end);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(handle);
  }, [target, duration, isVisible]);

  return <span>{count}</span>;
}
