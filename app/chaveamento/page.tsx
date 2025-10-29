"use client";

import React from "react";
import PageLayout from "../components/PageLayout";
import TransitionLayout from "../components/TransitionLayout";

/**
 * ChaveamentoPage
 * - Mantém apenas um banner responsivo de "Em desenvolvimento".
 * - Layout pensado para telas pequenas: banner ocupa largura disponível e
 *   organize conteúdo verticalmente em mobile, horizontal em telas maiores.
 */

export default function ChaveamentoPage() {
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
                <span className="flex rounded-full bg-yellow-100 p-2">
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
                  Esta seção está em desenvolvimento. Algumas funcionalidades e
                  visualizações ainda estão sendo implementadas e podem estar
                  incompletas.
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <a
                    href="https://drive.google.com/drive/u/0/folders/1puzgat42ZPVGgFwz5pOPEcFD--abSZKM?fbclid=PAb21jcANri7NleHRuA2FlbQIxMQABp_DrUqAWEM3N1mFj_VuEggOXx_dALiKpmw00rkqto5ZRngz4NPlWcZbRq1qY_aem_3-Ch4A5dCN1_E690iN3D9w"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800"
                  >
                    <span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-external-link-icon lucide-external-link"
                      >
                        <path d="M15 3h6v6" />
                        <path d="M10 14 21 3" />
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      </svg>
                    </span>{" "}
                    Sugestão: exportar relatório
                  </a>
                  <span className="inline-flex items-center gap-2 rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800">
                    Em breve: visualização de chaveamento
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    </TransitionLayout>
  );
}
