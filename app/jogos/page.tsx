import PageLayout from '../components/PageLayout';
import GamesTable from '../components/GamesTable';
import LiveIndicator from '../components/LiveIndicator';
import TransitionLayout from '../components/TransitionLayout';

export default function JogosPage() {
  return (
    <TransitionLayout backgroundColor="var(--background)">
      <PageLayout>
        <div className="mt-2">
          <div className="space-y-4 md:space-y-6">
            {/* Header da Página */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-text-primary mb-1 md:mb-2">
                  Jogos do Interclasse
                </h1>
                <p className="text-xs md:text-sm text-text-secondary">
                  Acompanhe todos os jogos em tempo real
                </p>
              </div>
            </div>
            
            {/* Tabela de Jogos */}
            <GamesTable />
          </div>
        </div>
      </PageLayout>
    </TransitionLayout>
  );
} 