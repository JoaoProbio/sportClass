'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import { Input } from '@/components/ui/input';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

export default function NavigationHeader({ isSidebarOpen, toggleSidebar }: { isSidebarOpen: boolean, toggleSidebar: () => void }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navItems = [
    { id: 'jogos', label: 'Jogos', href: '/jogos' },
    { id: 'chaveamento', label: 'Chaveamento', href: '/chaveamento' },
    { id: 'estatisticas', label: 'Estatísticas', href: '/estatisticas' },
    { id: 'calendario', label: 'Calendário', href: '/calendario' },
  ];

  const getActiveTab = () => {
    if (pathname === '/') return 'jogos';
    return pathname.split('/')[1] || 'jogos';
  };

  const activeTab = getActiveTab();

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <header>
      {/* Header Mobile */}
      <div className="md:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <div className='p-2 bg-background-card'>
              <img src="/logo_rapoze.svg" alt="Logo IF" className="w-7 h-7 object-contain" />
            </div>
          </Link>
          
          <div className="flex items-center gap-2">
            {/* Botão Turmas para Drawer */}
            <Drawer>
              <DrawerTrigger asChild>
                <button
                  onClick={toggleDrawer}
                  className="flex items-center justify-center p-1 rounded-md hover:bg-background-card transition-colors"
                  aria-label={isDrawerOpen ? "Fechar drawer" : "Abrir drawer"}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 20 20" 
                    fill="currentColor" 
                    className="w-5 h-5 text-text-secondary cursor-pointer flex-shrink-0"
                  >
                    <path d="M17.5 15v1.666h-15V15h15Zm0-5.834v1.667H10V9.166h7.5Zm0-5.833V5H10V3.333h7.5Z"></path>
                    <path 
                      d="M5.497 3.252 6.675 4.43 4.024 7.083l2.651 2.652-1.178 1.178-3.83-3.83 3.83-3.83Z" 
                      style={{
                        transformOrigin: '4.171px 7.0825px 0px',
                        transform: isDrawerOpen ? 'rotate(90deg)' : 'rotate(270deg)',  
                        transition: 'transform .4s ease-in-out'
                      }}
                    ></path>
                  </svg>
                  <span className="hidden md:flex text-text-secondary cursor-pointer hover:text-text-primary">Turmas</span>
              
                  <span className="hidden md:flex px-2">|</span>
                </button>
              </DrawerTrigger>
              <DrawerContent className="h-[85vh]">
                <DrawerHeader>
                  <DrawerTitle className="text-text-primary">Turmas</DrawerTitle>
                </DrawerHeader>
                <div className="flex-1 overflow-y-auto px-4 pb-4">
                  <div className="md:hidden">
                    <Sidebar />
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>

      {/* Header Desktop */}
      <div className="hidden md:flex items-center justify-between h-12 px-6 my-2">
        <div className='items-center inline-flex justify-between w-full md:w-70'>
          <Link href="/" className="flex items-center gap-3">
            <div className='p-2 drop-shadow-sm'>
              <img src="/logo_rapoze.svg" alt="Logo IF" className="w-10 h-10 object-contain" />
            </div>
          </Link>
          
          {/* Sidebar Toggle Button (Desktop only) */}
          <button
            onClick={toggleSidebar}
            className="hidden md:flex items-center justify-center p-2 rounded-md hover:bg-background-card transition-colors"
            aria-label={isSidebarOpen ? "Fechar sidebar" : "Abrir sidebar"}
            aria-expanded={isSidebarOpen}
            aria-controls="sidebar-desktop"
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5 text-text-secondary hover:text-text-primary transition-colors cursor-pointer flex-shrink-0"
            >
              <path d="M17.5 15v1.666h-15V15h15Zm0-5.834v1.667H10V9.166h7.5Zm0-5.833V5H10V3.333h7.5Z"></path>
              <path
                d="M5.497 3.252 6.675 4.43 4.024 7.083l2.651 2.652-1.178 1.178-3.83-3.83 3.83-3.83Z"
                style={{
                  transformOrigin: '4.171px 7.0825px 0px',
                  transform: isSidebarOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 1s ease'
                }}
              ></path>
            </svg>
          </button>
          {/* Fim do botão toggle sidebar */}
        </div>

        <div className="flex items-center gap-3">
          <nav className="flex gap-1" role="navigation" aria-label="Menu principal">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center gap-2 px-2 py-1 text-sm font-medium transition-all duration-200 cursor-pointer ${
                  activeTab === item.id
                    ? 'text-text-primary border-accent-primary'
                    : 'text-text-secondary border-transparent hover:text-text-primary'
                }`}
                aria-current={activeTab === item.id ? 'page' : undefined}
              >
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
          <button 
            className="cursor-pointer text-orange-600 transition-colors border border-orange-600/20"
            aria-label="Em desenvolvimento"
          >
            <div className='inline-flex items-center gap-1 bg-orange-800/10 px-2 py-1 rounded-xs'>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 256 256" aria-hidden="true">
                <path d="M120,136V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0ZM232,91.55v72.9a15.86,15.86,0,0,1-4.69,11.31l-51.55,51.55A15.86,15.86,0,0,1,164.45,232H91.55a15.86,15.86,0,0,1-11.31-4.69L28.69,175.76A15.86,15.86,0,0,1,24,164.45V91.55a15.86,15.86,0,0,1,4.69-11.31L80.24,28.69A15.86,15.86,0,0,1,91.55,24h72.9a15.86,15.86,0,0,1,11.31,4.69l51.55,51.55A15.86,15.86,0,0,1,232,91.55Zm-16,0L164.45,40H91.55L40,91.55v72.9L91.55,216h72.9L 216,164.45ZM128,160a12,12,0,1,0,12,12A12,12,0,0,0,128,160Z"></path>
              </svg>
              <span className='text-xs tracking-tighter'>Análise</span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}

// Componente para o conteúdo da sidebar (reutilizável)
function SidebarContent() {
  const [searchTerm, setSearchTerm] = useState('');

  const turmas = [
    // Agro
    { id: '1a-agro', name: '1º Agro A', division: 'agro', year: 1, color: '#ff6b35' },
    { id: '1b-agro', name: '1º Agro B', division: 'agro', year: 1, color: '#ff8c42' },
    { id: '1c-agro', name: '1º Agro C', division: 'agro', year: 1, color: '#ffa726' },
    { id: '2a-agro', name: '2º Agro A', division: 'agro', year: 2, color: '#e65100' },
    { id: '2b-agro', name: '2º Agro B', division: 'agro', year: 2, color: '#f57c00' },
    { id: '2c-agro', name: '2º Agro C', division: 'agro', year: 2, color: '#ff8f00' },
    { id: '3a-agro', name: '3º Agro A', division: 'agro', year: 3, color: '#ffab00' },
    { id: '3b-agro', name: '3º Agro B', division: 'agro', year: 3, color: '#ffc400' },
    { id: '3c-agro', name: '3º Agro C', division: 'agro', year: 3, color: '#ffd54f' },
    
    // Meio
    { id: '1a-meio', name: '1º Meio A', division: 'meio', year: 1, color: '#ffb74d' },
    { id: '1b-meio', name: '1º Meio B', division: 'meio', year: 1, color: '#ffcc02' },
    { id: '1c-meio', name: '1º Meio C', division: 'meio', year: 1, color: '#ff9800' },
    { id: '2a-meio', name: '2º Meio A', division: 'meio', year: 2, color: '#ff6f00' },
    { id: '2b-meio', name: '2º Meio B', division: 'meio', year: 2, color: '#ff9100' },
    { id: '2c-meio', name: '2º Meio C', division: 'meio', year: 2, color: '#ffb300' },
    { id: '3a-meio', name: '3º Meio A', division: 'meio', year: 3, color: '#ffeb3b' },
    { id: '3b-meio', name: '3º Meio B', division: 'meio', year: 3, color: '#fff176' },
    { id: '3c-meio', name: '3º Meio C', division: 'meio', year: 3, color: '#fff59d' },
    
    // Info
    { id: '1a-info', name: '1º Info A', division: 'info', year: 1, color: '#ff5722' },
    { id: '1b-info', name: '1º Info B', division: 'info', year: 1, color: '#ff7043' },
    { id: '2a-info', name: '2º Info A', division: 'info', year: 2, color: '#ffc107' },
    { id: '2b-info', name: '2º Info B', division: 'info', year: 2, color: '#ffca28' },
    { id: '3a-info', name: '3º Info A', division: 'info', year: 3, color: '#fff9c4' },
    { id: '3b-info', name: '3º Info B', division: 'info', year: 3, color: '#fffde7' },
  ];

  const filteredTurmas = turmas?.filter(turma =>
    turma.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getDivisionIcon = (division: string) => {
    switch (division) {
      case 'agro':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5zM12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
            <path d="M12 6c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
          </svg>
        );
      case 'meio':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        );
      case 'info':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-5 14H4v-4h11v4zm0-5H4V9h11v4zm5 5h-4V9h4v9z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  const getDivisionName = (division: string) => {
    switch (division) {
      case 'agro':
        return 'Agropecuária';
      case 'meio':
        return 'Meio Ambiente';
      case 'info':
        return 'Informática';
      default:
        return division;
    }
  };

  // Group turmas by division
  const groupedTurmas = filteredTurmas.reduce((acc, turma) => {
    if (!acc[turma.division]) {
      acc[turma.division] = [];
    }
    acc[turma.division].push(turma);
    return acc;
  }, {} as Record<string, typeof turmas>);

  // Sort divisions in the order we want
  const divisionOrder = ['agro', 'meio', 'info'];

  return (
    <div className="h-full flex flex-col">
      {/* Input de pesquisa */}
      <section className="mb-6">
        <div className="relative">
          <Input
            type="text"
            placeholder="Buscar turma..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            aria-label="Buscar turma"
          />
          <svg 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </section>

      {/* Seção de Turmas por Divisão */}
      <section className="flex-1">
        <div className="space-y-6">
          {divisionOrder.map((division) => {
            const divisionTurmas = groupedTurmas[division];
            if (!divisionTurmas || divisionTurmas.length === 0) return null;

            return (
              <div key={division}>
                <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3 flex items-center gap-2">
                  {getDivisionIcon(division)}
                  {getDivisionName(division)}
                </h3>
                <div className="space-y-1">
                  {divisionTurmas
                    .sort((a, b) => a.year - b.year || a.name.localeCompare(b.name))
                    .map((turma) => (
                    <button
                      key={turma.id}
                      className="w-full flex items-center gap-3 p-3 rounded-md text-sm text-text-secondary hover:bg-background-card hover:text-text-primary transition-all duration-200 cursor-pointer text-left border border-transparent hover:border-border-default"
                      aria-label={`Selecionar turma ${turma.name}`}
                    >
                      <div 
                        className="w-3 h-3 rounded-sm flex-shrink-0"
                        style={{ backgroundColor: turma.color }}
                        aria-hidden="true"
                      ></div>
                      <span className="truncate">{turma.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
} 