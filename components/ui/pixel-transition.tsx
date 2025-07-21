import React from 'react';
import { motion } from 'framer-motion';

const anim = {
  initial: { opacity: 1 },
  open: (i: number) => ({
    opacity: 0,
    transition: { duration: 0, delay: 0.03 * i }
  }),
  closed: (i: number) => ({
    opacity: 1,
    transition: { duration: 0, delay: 0.03 * i }
  })
};

interface PixelTransitionProps {
  isActive: boolean;
  dimensions: { width: number; height: number };
}

function shuffle<T>(a: T[]): T[] {
  let j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}

const PixelTransition: React.FC<PixelTransitionProps> = ({ isActive, dimensions }) => {
  const { width, height } = dimensions;

  const getBlocks = () => {
    const blockSize = width * 0.05;
    const nbOfBlocks = Math.ceil(height / blockSize);
    const shuffledIndexes = shuffle([...Array(nbOfBlocks)].map((_, i) => i));
    return shuffledIndexes.map((randomIndex, index) => (
      <motion.div
        key={index}
        className="block"
        variants={anim}
        initial="initial"
        animate={isActive ? "open" : "closed"}
        custom={randomIndex}
      />
    ));
  };

  return (
    <div className="pixelBackground">
      {[...Array(20)].map((_, index) => (
        <div key={index} className="column">
          {getBlocks()}
        </div>
      ))}
    </div>
  );
};

export default PixelTransition; 