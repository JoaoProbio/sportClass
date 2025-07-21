'use client';

interface LiveIndicatorProps {
  isLive?: boolean;
  className?: string;
}

export default function LiveIndicator({ isLive = true, className = '' }: LiveIndicatorProps) {
  if (!isLive) return null;

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full bg-accent-primary text-text-inverse text-xs font-semibold cursor-pointer border border-transparent hover:border-accent-primary/80 transition-all duration-200 ${className}`}>
      <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
      <span>AO VIVO</span>
    </div>
  );
} 