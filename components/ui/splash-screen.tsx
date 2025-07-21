"use client";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import PixelTransition from './pixel-transition';
import { useState, useEffect } from 'react';
import { SlidingNumber } from '@/components/motion-primitives/sliding-number';

interface SplashScreenProps {
  isVisible: boolean;
  progress?: number;
}

const CIRCLE_SIZE = 120;
const STROKE_WIDTH = 2;
const RADIUS = (CIRCLE_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function useWindowDimensions() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  useEffect(() => {
    function handleResize() {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return dimensions;
}

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

const SplashScreen = ({ isVisible, progress = 0 }: SplashScreenProps) => {
  const [showPixel, setShowPixel] = useState(false);
  const dimensions = useWindowDimensions();

  useEffect(() => {
    if (!isVisible) {
      setShowPixel(true);
      const timeout = setTimeout(() => setShowPixel(false), 1200);
      return () => clearTimeout(timeout);
    }
  }, [isVisible]);

  const pct = Math.max(0, Math.min(progress, 100));
  const offset = CIRCUMFERENCE * (1 - pct / 100);

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.7, ease: 'easeInOut' } }}
            transition={{ duration: 0.7 }}
            aria-label="Carregando conteúdo"
          >
            <div className="flex flex-col items-center justify-center" role="img" aria-label="Logo Flor do Cerrado com barra de progresso animada">
              {/* Circle + Logo */}
              <div className="relative flex items-center justify-center min-w-[100px] min-h-[100px] z-10" style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE }}>
                <svg width={CIRCLE_SIZE} height={CIRCLE_SIZE} className="absolute top-0 left-0">
                  <circle
                    cx={CIRCLE_SIZE / 2}
                    cy={CIRCLE_SIZE / 2}
                    r={RADIUS}
                    fill="none"
                    stroke="#eee"
                    strokeWidth={STROKE_WIDTH}
                  />
                  <motion.circle
                    cx={CIRCLE_SIZE / 2}
                    cy={CIRCLE_SIZE / 2}
                    r={RADIUS}
                    fill="none"
                    stroke="#ff810a"
                    strokeWidth={STROKE_WIDTH}
                    strokeDasharray={CIRCUMFERENCE}
                    strokeDashoffset={CIRCUMFERENCE * (1 - Math.max(0, Math.min(progress, 100)) / 100)}
                    strokeLinecap="round"
                    initial={false}
                    animate={{ strokeDashoffset: CIRCUMFERENCE * (1 - Math.max(0, Math.min(progress, 100)) / 100) }}
                    transition={{ duration: 0.3, ease: 'linear' }}
                  />
                </svg>
                <Image
                  src="/flor_do_cerrado.png"
                  alt="Flor do Cerrado Logo"
                  width={80}
                  height={80}
                  priority
                  className="drop-shadow-xl z-10"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {showPixel && <PixelTransition isActive={showPixel} dimensions={dimensions} />}
    </>
  );
};

export default SplashScreen; 