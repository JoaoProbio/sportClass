'use client';

import { ReactFlow, ReactFlowProvider, Background, BackgroundVariant, Panel, useReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/base.css';

import PageLayout from '../components/PageLayout';
import TransitionLayout from '../components/TransitionLayout';
import { useSport } from '../providers/SportContext';
import { Button } from '@/components/ui/button';
import { RiAddLine, RiSubtractLine, RiFullscreenLine } from '@remixicon/react';

// Nossos novos componentes e funções
import MatchNode from '../components/MatchNode';
import BracketEdge from '../components/BracketEdge';
import { generateLayout, generateBracket } from '@/lib/bracket-utils';

// Tipos necessários
interface Team {
  name: string;
  icon?: string;
}

const nodeTypes = { matchNode: MatchNode };
const edgeTypes = { bracketEdge: BracketEdge };

function BracketVisualizer() {
  const { activeSport } = useSport();
  const reactFlowInstance = useReactFlow();

  // Dados dos times (como no exemplo anterior)
  const futsalTeams: Team[] = [
    { name: "3º Info A" }, { name: "2º Edificações B" },
    { name: "2º Eletro A" }, { name: "1º Mecânica B" },
    { name: "1º Info A" }, { name: "3º Eletro B" },
    { name: "2º Mecânica C" }, { name: "1º Agro A"},
  ];
   const basketballTeams: Team[] = [
    { name: "3º Ano A" }, { name: "2º Ano B" }, { name: "2º Ano A" },
  ];

  const teamsBySport: { [key: string]: Team[] } = {
    futsal: futsalTeams,
    basquete: basketballTeams,
  };

  const teams = teamsBySport[activeSport.toLowerCase()] || [];
  const tournamentData = generateBracket(teams, activeSport);
  const { nodes, edges } = generateLayout(tournamentData);

  if (nodes.length === 0) {
    return <p className="text-center mt-10">Selecione um esporte com times para ver o chaveamento.</p>
  }

  // Zoom controls
  const handleZoomIn = () => reactFlowInstance.zoomIn();
  const handleZoomOut = () => reactFlowInstance.zoomOut();
  const handleFitView = () => reactFlowInstance.fitView({ padding: 0.2 });

  return (
    <div className="w-full h-[80vh] border-2 border-primary rounded-xl bg-background-card">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag={true}
        zoomOnScroll
        zoomOnPinch
        zoomOnDoubleClick
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
        <Panel
          position="bottom-right"
          className="inline-flex -space-x-px rounded-md shadow-xs rtl:space-x-reverse z-10"
        >
          <Button
            variant="outline"
            size="icon"
            className="text-muted-foreground/80 hover:text-muted-foreground rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg size-10 focus-visible:z-10 bg-card"
            onClick={handleZoomIn}
            aria-label="Zoom in"
          >
            <RiAddLine className="size-5" aria-hidden="true" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="text-muted-foreground/80 hover:text-muted-foreground rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg size-10 focus-visible:z-10 bg-card"
            onClick={handleZoomOut}
            aria-label="Zoom out"
          >
            <RiSubtractLine className="size-5" aria-hidden="true" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="text-muted-foreground/80 hover:text-muted-foreground rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg size-10 focus-visible:z-10 bg-card"
            onClick={handleFitView}
            aria-label="Fit view"
          >
            <RiFullscreenLine className="size-5" aria-hidden="true" />
          </Button>
        </Panel>
      </ReactFlow>
    </div>
  );
}

export default function ChaveamentoPage() {
  return (
    <TransitionLayout backgroundColor="var(--background)">
      <PageLayout>
        <div className="space-y-4 md:space-y-6">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-text-primary mb-1 md:mb-2">
              Chaveamento
            </h1>
            <p className="text-xs md:text-sm text-text-secondary">
              Veja o chaveamento dos confrontos por modalidade
            </p>
          </div>
          <ReactFlowProvider>
            <BracketVisualizer />
          </ReactFlowProvider>
        </div>
      </PageLayout>
    </TransitionLayout>
  );
} 