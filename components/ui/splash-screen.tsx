"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface SplashScreenProps {
  isVisible: boolean;
  progress?: number;
}

const SplashScreen: React.FC<SplashScreenProps> = ({
  isVisible,
  progress = 0,
}) => {
  const [showTransition, setShowTransition] = useState(false);
  const nbOfColumns = 5;

  useEffect(() => {
    if (!isVisible) {
      // Trigger upward transition when hiding
      setShowTransition(true);
      const t = setTimeout(() => setShowTransition(false), 1000);
      return () => clearTimeout(t);
    }
  }, [isVisible]);

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{
              opacity: 0,
              transition: { duration: 0.5, ease: "easeInOut", delay: 0.2 },
            }}
            transition={{ duration: 0.3 }}
            aria-label="Carregando conteúdo"
          >
            {/* Main preloader content with GIF */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{
                scale: 0.95,
                opacity: 0,
                transition: { duration: 0.3 },
              }}
              transition={{
                duration: 0.4,
                ease: "easeOut",
              }}
              className="relative"
            >
              <Image
                src="/icons/Iconsgif.gif"
                alt="Loading"
                width={75}
                height={75}
                priority
                className="object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SplashScreen;
