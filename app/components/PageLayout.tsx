'use client';

import { useState } from 'react';
import NavigationHeader from './NavigationHeader';
import SportsNavigation from './SportsNavigation';
import Sidebar from './Sidebar';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { usePathname } from 'next/navigation';
import React from 'react';
import BottomNavBar from './BottomNavBar';

interface PageLayoutProps {
  children: React.ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();
  const pathParts = pathname.split('/').filter(Boolean);
  const breadcrumbItems = [
    { href: '/', label: 'Início' },
    ...pathParts.map((part, idx) => {
      const href = '/' + pathParts.slice(0, idx + 1).join('/');
      // Formatar: primeira letra maiúscula, '-' e '_' viram espaço
      const label = part
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
      return { href, label };
    })
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-background">
      
      <div className="bg-yellow-500/10 border-b border-yellow-500/20 px-4 py-2">
        <div className="flex items-center justify-center gap-2 text-sm text-yellow-300">
          <span className="font-medium text-xs">Você está em <strong>Modo teste.</strong> Todas as interações são simuladas.</span>
        </div>
      </div>

      <div className="max-w-[1320px] mx-auto">
        {/* Header Fixo */}
        <NavigationHeader isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        
        {/* Navegação Esportiva */}
        <SportsNavigation
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />
      </div>
      
      {/* Layout Principal */}
      <div className="flex max-w-[1320px] mx-auto">
        {/* Sidebar - apenas no desktop */}
        {isSidebarOpen && (
          <div className="hidden">
            <Sidebar />
          </div>
        )}
        
        {/* Conteúdo Principal */}
        <main className="flex-1 p-4 md:p-6 pb-20">
          {/* Breadcrumb */}
          <Breadcrumb>
            <BreadcrumbList>
              {/* Separador */}
              {breadcrumbItems.map((item, idx) => (
                <React.Fragment key={item.href + '-' + idx}>
                  <BreadcrumbItem>
                    {idx < breadcrumbItems.length - 1 ? (
                      <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage>{item.label}</BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                  {idx < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
          {/* Fim do Breadcrumb */}
          {children}
        </main>
      </div>
      {/* Bottom Navigation Bar - Mobile only */}
      <BottomNavBar />
    </div>
  );
} 