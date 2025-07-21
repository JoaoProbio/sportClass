'use client';

import { useState, useEffect } from 'react';
import { isOnline, addNetworkListeners } from '../../lib/fetch-utils';

export default function NetworkStatus() {
  const [isOnlineStatus, setIsOnlineStatus] = useState(true);

  useEffect(() => {
    // Set initial status
    setIsOnlineStatus(isOnline());

    // Add network listeners
    const cleanup = addNetworkListeners(
      () => setIsOnlineStatus(true),
      () => setIsOnlineStatus(false)
    );

    return cleanup;
  }, []);

  if (isOnlineStatus) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-red-500 text-white px-4 py-2 text-center text-sm">
      <div className="flex items-center justify-center gap-2">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 8.98C20.93 5.9 16.69 4 12 4S3.07 5.9 0 8.98L12 21 24 8.98zM2.92 9.07C5.51 7.08 8.67 6 12 6s6.49 1.08 9.08 3.07l-9.08 9.08-9.08-9.08z"/>
        </svg>
        <span>Você está offline. Algumas funcionalidades podem não estar disponíveis.</span>
      </div>
    </div>
  );
} 