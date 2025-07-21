import {
  BaseEdge,
  EdgeProps,
  getSmoothStepPath,
  Position,
} from "@xyflow/react";

export default function BracketEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition: sourcePosition || Position.Right, // Vencedor sai da direita
    targetX,
    targetY,
    targetPosition: targetPosition || Position.Left, // Próximo jogo recebe na esquerda
    borderRadius: 16,
  });

  return <BaseEdge path={edgePath} style={style} markerEnd={markerEnd} />;
} 