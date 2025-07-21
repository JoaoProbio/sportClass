'use client';

import { AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

interface AnimatePresenceWrapperProps {
  children: React.ReactNode;
}

export default function AnimatePresenceWrapper({ children }: AnimatePresenceWrapperProps) {
  const pathname = usePathname();

  return (
    <div className='main'>
      <AnimatePresence mode='wait'>
        <div key={pathname}>
          {children}
        </div>
      </AnimatePresence>
    </div>
  );
} 