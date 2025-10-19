import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const BlobCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', updateMousePosition);

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    const clickableElements = document.querySelectorAll('a, button, input[type="submit"], [data-clickable="true"]');
    clickableElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      clickableElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  const variants = {
    default: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      backgroundColor: "rgba(100, 100, 255, 0.5)", // Default blue blob
      scale: 1,
      width: 32,
      height: 32,
      borderRadius: "50%",
      transition: {
        type: "spring",
        mass: 0.6,
        stiffness: 100,
        damping: 10,
      },
    },
    hover: {
      x: mousePosition.x - 24,
      y: mousePosition.y - 24,
      backgroundColor: "rgba(255, 100, 100, 0.7)", // Red blob on hover
      scale: 1.5,
      width: 48,
      height: 48,
      borderRadius: "50%",
      transition: {
        type: "spring",
        mass: 0.6,
        stiffness: 100,
        damping: 10,
      },
    },
  };

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
      variants={variants}
      animate={isHovering ? "hover" : "default"}
    />
  );
};

export default BlobCursor;