"use client";

import React from "react";
import PageLayout from "../components/PageLayout";
import TransitionLayout from "../components/TransitionLayout";

/**
 * EstatisticasPage (temporariamente)
 * - Mostra apenas um banner responsivo de "Em desenvolvimento".
 * - Conteúdo detalhado foi removido conforme solicitado.
 */

export default function EstatisticasPage() {
  return (
    <TransitionLayout>
      <PageLayout>
        <div className="min-h-[40vh] flex items-center justify-center py-8">
          <div className="w-full max-w-3xl mx-4">
            <div
              role="status"
              aria-live="polite"
              className="rounded-lg border border-yellow-300 bg-yellow-50 p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-sm"
            >
              <div className="flex-shrink-0">
                <span className="inline-flex items-center justify-center rounded-full bg-yellow-100 p-2">
                  <svg
                    className="h-6 w-6 text-yellow-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4m0 4h.01M4.93 19h14.14A2 2 0 0021 17.07V6.93A2 2 0 0019.07 5H4.93A2 2 0 003 6.93v10.14A2 2 0 004.93 19z"
                    />
                  </svg>
                </span>
              </div>

              <div className="flex-1">
                <h2 className="text-base sm:text-lg font-semibold text-yellow-800">
                  Em desenvolvimento
                </h2>
                <p className="mt-1 text-sm text-yellow-700">
                  A seção de Estatísticas está sendo melhorada. Dados e
                  visualizações adicionais serão disponibilizados em breve.
                </p>
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    </TransitionLayout>
  );
}
