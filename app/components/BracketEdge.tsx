import { BaseEdge, EdgeLabelRenderer, getBezierPath, getStraightPath } from '@xyflow/react';
import { useMemo } from 'react';

interface BracketEdgeProps {
  id: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  sourcePosition?: any;
  targetPosition?: any;
  style?: any;
  markerEnd?: string;
  data?: any;
  selected?: boolean;
}

export default function BracketEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
  selected = false,
}: BracketEdgeProps) {
  // Use straight path for cleaner tournament bracket lines
  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  // Enhanced styling based on match status and selection
  const edgeStyle = useMemo(() => {
    const baseStyle = {
      stroke: '#ff6b35',
      strokeWidth: selected ? 4 : 3,
      strokeDasharray: 'none',
      transition: 'all 0.2s ease-in-out',
      filter: selected ? 'drop-shadow(0 0 8px rgba(255, 107, 53, 0.6))' : 'none',
      opacity: 1,
    };

    // Different styles based on match status
    if (data?.status === 'completed') {
      return {
        ...baseStyle,
        stroke: '#10b981', // Green for completed matches
        strokeWidth: selected ? 3 : 2.5,
        strokeDasharray: 'none',
      };
    } else if (data?.status === 'live') {
      return {
        ...baseStyle,
        stroke: '#ef4444', // Red for live matches
        strokeWidth: selected ? 4 : 3,
        strokeDasharray: '5,5',
        animation: 'pulse 2s infinite',
      };
    } else if (data?.status === 'upcoming') {
      return {
        ...baseStyle,
        stroke: '#6b7280', // Gray for upcoming matches
        strokeWidth: selected ? 4 : 3,
        strokeDasharray: '3,3',
        opacity: 0.8,
      };
    }

    return baseStyle;
  }, [data?.status, selected]);

  // Add CSS animation for live matches
  const animationStyle = data?.status === 'live' ? `
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  ` : '';

  return (
    <>
      <style>{animationStyle}</style>
      <BaseEdge 
        path={edgePath} 
        markerEnd={markerEnd} 
        style={{
          ...style,
          ...edgeStyle,
        }} 
      />
      
      {/* Enhanced edge labels with better positioning and styling */}
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 11,
            pointerEvents: 'all',
            zIndex: 10,
          }}
          className="nodrag nopan"
        >
          {data?.label && (
            <div className={`
              bg-background-card/95 backdrop-blur-sm border rounded-lg px-2 py-1 text-xs font-medium
              ${data?.status === 'completed' ? 'border-green-500/30 text-green-600' : ''}
              ${data?.status === 'live' ? 'border-red-500/30 text-red-600 animate-pulse' : ''}
              ${data?.status === 'upcoming' ? 'border-gray-500/30 text-gray-600' : ''}
              ${!data?.status ? 'border-orange-500/30 text-orange-600' : ''}
              shadow-sm hover:shadow-md transition-all duration-200
            `}>
              {data.label}
            </div>
          )}
          
          {/* Winner indicator for completed matches */}
          {data?.status === 'completed' && data?.winner && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
          )}
        </div>
      </EdgeLabelRenderer>
      
      {/* Connection points for better visual flow */}
      <circle
        cx={sourceX}
        cy={sourceY}
        r={3}
        fill="#ff6b35"
        stroke="#fff"
        strokeWidth={1}
        className="transition-all duration-200"
      />
      <circle
        cx={targetX}
        cy={targetY}
        r={3}
        fill="#ff6b35"
        stroke="#fff"
        strokeWidth={1}
        className="transition-all duration-200"
      />
    </>
  );
} 