'use client';

import { useState, useEffect } from 'react';
import PageLayout from '../components/PageLayout';
import { useSport } from '../providers/SportContext';
import TransitionLayout from '../components/TransitionLayout';

export default function CalendarioPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);
  const { activeSport, setActiveSport } = useSport();

  useEffect(() => {
    setSelectedDate(new Date());
    setSelectedMonth(new Date());
    setMounted(true);
  }, []);

  const jogos = [
    {
      id: 1,
      data: '2025-03-15',
      time: '14:00',
      team1: '3º Ano A',
      team2: '3º Ano B',
      sport: 'Futsal',
      court: 'Quadra Principal',
      status: 'finished',
      score: '2 - 1'
    },
    {
      id: 2,
      data: '2025-03-15',
      time: '15:30',
      team1: '2º Ano A',
      team2: '2º Ano B',
      sport: 'Basquete',
      court: 'Quadra Coberta',
      status: 'finished',
      score: '45 - 38'
    },
    {
      id: 3,
      data: '2025-03-16',
      time: '14:00',
      team1: '3º Ano A',
      team2: '2º Ano A',
      sport: 'Vôlei',
      court: 'Quadra de Vôlei',
      status: 'upcoming'
    },
    {
      id: 4,
      data: '2025-03-16',
      time: '15:30',
      team1: '1º Ano A',
      team2: '1º Ano B',
      sport: 'Futsal',
      court: 'Quadra Principal',
      status: 'upcoming'
    },
    {
      id: 5,
      data: '2025-03-17',
      time: '14:00',
      team1: '3º Ano A',
      team2: '1º Ano A',
      sport: 'Handebol',
      court: 'Quadra Coberta',
      status: 'upcoming'
    },
    {
      id: 6,
      data: '2025-03-17',
      time: '15:30',
      team1: '2º Ano A',
      team2: '1º Ano A',
      sport: 'Tênis de Mesa',
      court: 'Quadra de Tênis',
      status: 'upcoming'
    },
    {
      id: 7,
      data: '2025-03-18',
      time: '14:00',
      team1: '3º Ano B',
      team2: '2º Ano B',
      sport: 'Futsal',
      court: 'Quadra Principal',
      status: 'upcoming'
    },
    {
      id: 8,
      data: '2025-03-18',
      time: '15:30',
      team1: '1º Ano B',
      team2: '2º Ano B',
      sport: 'Basquete',
      court: 'Quadra Coberta',
      status: 'upcoming'
    }
  ];

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'live':
        return { 
          label: 'AO VIVO', 
          color: 'bg-red-500/20 border border-red-500 text-red-500', 
          icon: (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" fill="currentColor"/>
              <circle cx="12" cy="12" r="6" fill="white"/>
            </svg>
          )
        };
      case 'finished':
        return { 
          label: 'FINALIZADO', 
          color: 'bg-green-500/20 border border-green-500 text-green-500', 
          icon: (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
          )
        };
      case 'upcoming':
        return { 
          label: 'EM BREVE', 
          color: 'bg-blue-500/20 border border-blue-500 text-blue-500', 
          icon: (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
              <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
            </svg>
          )
        };
      case 'postponed':
        return { 
          label: 'ADIADO', 
          color: 'bg-gray-500/20 border border-gray-500 text-gray-500', 
          icon: (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
            </svg>
          )
        };
      default:
        return { 
          label: 'DESCONHECIDO', 
          color: 'bg-gray-400/20 border border-gray-400 text-gray-400', 
          icon: (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM12 6c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"/>
            </svg>
          )
        };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const weekdays = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const months = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
    
    const weekday = weekdays[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${weekday}, ${day} de ${month} de ${year}`;
  };

  const sports = [
    { id: 'futsal', label: 'Futsal', icon: '/soccer.svg', isSvg: true },
    { id: 'basquete', label: 'Basquete', icon: '/basketball.svg', isSvg: true },
    { id: 'volei', label: 'Vôlei', icon: '/volleyball.svg', isSvg: true },
    { id: 'handebol', label: 'Handebol', icon: '/handball.svg', isSvg: true },
    { id: 'tenis-de-mesa', label: 'Tênis de Mesa', icon: '/table-tennis.svg', isSvg: true },
  ];

  const filteredJogos = jogos.filter(jogo => {
    // Filtro por esporte
    return jogo.sport.toLowerCase() === activeSport || activeSport === 'todos';
  });

  const renderSportIcon = (sport: string) => {
    switch (sport.toLowerCase()) {
      case 'futsal':
        return (
          <svg className="w-5 h-5 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 1000 1000">
            <path d="M 499.890625 83.332031 C 269.765625 83.332031 83.226562 269.875 83.226562 500 C 83.226562 730.082031 269.765625 916.667969 499.890625 916.667969 C 729.976562 916.667969 916.558594 730.082031 916.558594 500 C 916.558594 269.875 729.976562 83.332031 499.890625 83.332031 Z M 267.804688 576.164062 L 215.101562 710.410156 C 171.582031 651.574219 145.832031 578.796875 145.832031 500 C 145.832031 486.300781 146.640625 472.792969 148.152344 459.503906 L 261.597656 552.414062 C 268.597656 558.164062 271.097656 567.746094 267.804688 576.164062 Z M 314.265625 286.496094 L 216.890625 287.253906 C 259.527344 230.605469 318.757812 187.167969 387.375 164.164062 L 332.765625 274.871094 C 329.265625 281.953125 322.097656 286.453125 314.265625 286.496094 Z M 500 854.167969 C 458.851562 854.167969 419.355469 847.125 382.617188 834.222656 L 489.300781 771.453125 C 495.847656 767.578125 503.929688 767.578125 510.46875 771.453125 L 617.136719 834.308594 C 580.46875 847.15625 541.054688 854.167969 500 854.167969 Z M 630.097656 553.902344 L 513.460938 638.648438 C 505.382812 644.554688 494.398438 644.554688 486.320312 638.648438 L 369.636719 553.902344 C 361.558594 547.996094 358.191406 537.609375 361.28125 528.101562 L 405.824219 390.921875 C 408.914062 381.414062 417.777344 374.996094 427.792969 374.996094 L 572.035156 374.996094 C 582.003906 374.996094 590.863281 381.414062 593.957031 390.921875 L 638.496094 528.101562 C 641.589844 537.609375 638.222656 547.996094 630.097656 553.902344 Z M 667.054688 274.871094 L 612.332031 164.046875 C 681.085938 187.023438 740.429688 230.519531 783.132812 287.253906 L 685.554688 286.496094 C 677.679688 286.453125 670.511719 281.953125 667.054688 274.871094 Z M 784.824219 710.511719 L 731.972656 576.164062 C 728.679688 567.746094 731.179688 558.164062 738.179688 552.414062 L 851.835938 459.308594 C 853.363281 472.660156 854.167969 486.238281 854.167969 500 C 854.167969 578.84375 828.390625 651.660156 784.824219 710.511719 Z M 784.824219 710.511719"/>
          </svg>
        );
      case 'basquete':
        return (
          <svg className="w-5 h-5 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 1000 1000">
            <path d="M 500 83.332031 C 269.875 83.332031 83.332031 269.875 83.332031 500 C 83.332031 730.082031 269.875 916.667969 500 916.667969 C 730.082031 916.667969 916.667969 730.082031 916.667969 500 C 916.667969 269.875 730.082031 83.332031 500 83.332031 Z M 689.3125 531.261719 C 695.875 605.75 725.398438 673.726562 770.914062 727.886719 C 757.441406 743.878906 742.578125 758.667969 726.515625 772.066406 C 669.914062 706.460938 633.601562 623.003906 626.75 531.242188 L 531.25 531.242188 L 531.25 852.800781 C 520.953125 853.707031 510.527344 854.167969 500 854.167969 C 489.46875 854.167969 479.046875 853.703125 468.746094 852.800781 L 468.746094 531.242188 L 373.246094 531.242188 C 366.398438 623.003906 330.082031 706.460938 273.484375 772.066406 C 257.421875 758.667969 242.558594 743.882812 229.085938 727.886719 C 274.621094 673.730469 304.144531 605.753906 310.710938 531.261719 L 147.199219 531.261719 C 146.296875 520.960938 145.832031 510.535156 145.832031 500 C 145.832031 489.472656 146.296875 479.050781 147.199219 468.757812 L 310.710938 468.757812 C 304.144531 394.265625 274.617188 326.28125 229.074219 272.121094 C 242.554688 256.125 257.417969 241.335938 273.480469 227.933594 C 330.082031 293.535156 366.394531 376.992188 373.246094 468.757812 L 468.746094 468.757812 L 468.746094 147.199219 C 479.046875 146.296875 489.472656 145.832031 500 145.832031 C 510.527344 145.832031 520.953125 146.296875 531.25 147.199219 L 531.25 468.757812 L 626.75 468.757812 C 633.601562 376.992188 669.914062 293.539062 726.515625 227.933594 C 742.582031 241.335938 757.449219 256.128906 770.921875 272.125 C 725.402344 326.285156 695.878906 394.265625 689.3125 468.757812 L 852.800781 468.757812 C 853.707031 479.050781 854.167969 489.472656 854.167969 500 C 854.167969 510.535156 853.703125 520.960938 852.800781 531.261719 Z M 689.3125 531.261719"/>
          </svg>
        );
      case 'vôlei': 
      case 'volei': 
        return (
          <svg className="w-5 h-5 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" clipRule="evenodd" d="M22.494 12.3592C19.8895 9.52584 16.1522 7.75015 12.0003 7.75015C11.8124 7.75015 11.6255 7.75378 11.4395 7.76097C11.5368 8.9511 11.8671 10.1394 12.4492 11.2594C14.2158 11.332 15.874 11.8314 17.3217 12.6577C19.0134 13.6232 20.4181 15.0357 21.3745 16.7346C22.0436 15.4124 22.4412 13.9295 22.494 12.3592ZM20.4509 18.2327C18.5386 20.8213 15.4653 22.5 12 22.5C6.20101 22.5 1.5 17.799 1.5 12C1.5 6.20101 6.20101 1.5 12 1.5C11.9999 1.5 12.0001 1.5 12 1.5C11.8027 1.5 11.607 1.50544 11.4124 1.51618C11.3916 1.55145 11.3709 1.58683 11.3505 1.62231C10.3982 3.27408 9.89946 5.15586 9.90898 7.06304C9.91729 8.72981 10.3139 10.4155 11.1342 11.9817C10.4553 13.0458 9.59145 13.926 8.60943 14.6054C8.51019 14.4479 8.41357 14.2878 8.31965 14.1251C6.24307 10.5284 5.91266 6.40267 7.06539 2.72961C6.39669 3.08632 5.77112 3.51327 5.19853 4.00061C4.49922 7.59727 5.04475 11.4529 7.02061 14.8751C7.11451 15.0378 7.21088 15.1981 7.30966 15.3562C5.78234 16.0801 4.07251 16.3794 2.375 16.2023C2.61185 16.744 2.8931 17.2619 3.21415 17.7514C5.16335 17.7724 7.08857 17.262 8.77029 16.2798C10.2096 15.4392 11.4711 14.2529 12.4173 12.7594C13.6784 12.8153 14.8726 13.1233 15.952 13.6342C15.8652 13.7989 15.7748 13.9627 15.6809 14.1254C15.466 14.4977 15.2369 14.8564 14.9948 15.2014C12.8961 18.1916 9.80894 20.1573 6.44076 20.909C7.07496 21.3056 7.75454 21.6364 8.46996 21.8917C11.5198 20.8425 14.2613 18.8574 16.2225 16.0631C16.49 15.682 16.7429 15.286 16.9799 14.8754C17.0738 14.7127 17.1645 14.549 17.252 14.3844C18.6419 15.3447 19.7555 16.6751 20.4509 18.2327ZM13.1728 1.56477C17.7934 2.0783 21.5092 5.59018 22.3305 10.1108C19.5652 7.70604 15.9527 6.25015 12.0003 6.25015C11.8125 6.25015 11.6255 6.25344 11.4393 6.25996C11.5502 4.89396 11.9631 3.56289 12.65 2.37146C12.8096 2.09461 12.984 1.82527 13.1728 1.56477Z"/>
          </svg>
        );
      case 'handebol':
        return (
          <svg className="w-5 h-5 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 1000 1000">
            <path d="M 568.289062 603.992188 C 545.488281 600.824219 524.449219 616.734375 521.285156 639.527344 L 505.875 750.402344 L 435.519531 896.761719 C 425.550781 917.503906 434.28125 942.398438 455.019531 952.367188 C 460.84375 955.167969 466.988281 956.488281 473.042969 956.488281 C 488.554688 956.488281 503.453125 947.78125 510.625 932.863281 L 583.800781 780.640625 C 585.667969 776.753906 586.921875 772.597656 587.515625 768.324219 L 603.820312 650.996094 C 606.988281 628.203125 591.082031 607.160156 568.289062 603.992188 Z M 868.359375 375.207031 L 697.703125 255.710938 C 694.066406 253.160156 690.039062 251.210938 685.785156 249.933594 L 570.683594 215.386719 L 558.777344 211.488281 C 556.882812 210.863281 554.972656 210.4375 553.0625 210.097656 L 447.152344 178.308594 L 416.59375 126.28125 C 405.941406 144.378906 389.191406 159.023438 367.957031 166.753906 C 361.035156 169.273438 353.910156 170.941406 346.671875 171.777344 L 383.582031 234.617188 C 388.910156 243.683594 397.460938 250.398438 407.53125 253.421875 L 492.792969 279.011719 L 428.296875 475.601562 C 424.855469 486.105469 425.722656 497.542969 430.710938 507.40625 C 435.703125 517.269531 444.40625 524.742188 454.910156 528.183594 L 573.683594 567.117188 C 577.914062 568.507812 582.292969 569.191406 586.664062 569.191406 C 593.140625 569.191406 599.597656 567.679688 605.484375 564.699219 C 615.34375 559.707031 622.816406 551 626.257812 540.496094 L 688.371094 350.910156 L 820.558594 443.46875 C 827.832031 448.5625 836.167969 451.007812 844.421875 451.007812 C 857.554688 451.007812 870.484375 444.808594 878.585938 433.238281 C 891.792969 414.386719 887.210938 388.40625 868.359375 375.207031 Z M 674.382812 187.238281 C 717.617188 171.5 739.910156 123.695312 724.171875 80.457031 C 708.433594 37.222656 660.628906 14.925781 617.390625 30.664062 C 574.15625 46.402344 551.863281 94.207031 567.601562 137.445312 C 583.335938 180.679688 631.144531 202.976562 674.382812 187.238281 Z M 481.578125 610.808594 C 485.160156 588.078125 469.632812 566.753906 446.898438 563.171875 L 319.035156 543.039062 C 303.308594 540.558594 287.550781 547.261719 278.421875 560.296875 L 151.996094 740.855469 C 138.796875 759.707031 143.378906 785.691406 162.226562 798.886719 C 169.503906 803.980469 177.835938 806.425781 186.089844 806.425781 C 199.226562 806.421875 212.152344 800.226562 220.257812 788.652344 L 331.761719 629.402344 L 433.9375 645.492188 C 456.664062 649.066406 477.996094 633.542969 481.578125 610.808594 Z M 357.273438 137.386719 C 389.699219 125.582031 406.421875 89.726562 394.617188 57.300781 C 382.816406 24.871094 346.957031 8.152344 314.535156 19.957031 C 282.105469 31.757812 265.386719 67.613281 277.1875 100.042969 C 288.988281 132.472656 324.847656 149.1875 357.273438 137.386719 Z M 357.273438 137.386719"/>
          </svg>
        );
      case 'tênis de mesa':
      case 'tenis de mesa':
        return (
          <svg className="w-5 h-5 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" clipRule="evenodd" d="M15.8135 16.5825C16.7836 15.8572 17.6524 14.8858 18.354 13.6706C20.9255 9.21673 19.5178 4.45664 15.6915 2.2475C11.8651 0.0383723 7.06906 1.21673 4.49763 5.67058C3.79599 6.88585 3.38911 8.12391 3.2461 9.32674L9.39018 12.874L15.8135 16.5825ZM14.339 17.4633L8.64018 14.1731L3.22059 11.0441C3.4506 13.5624 4.8638 15.7794 7.14012 17.0937C9.41643 18.4079 12.0431 18.5232 14.339 17.4633ZM5.34395 17.6976L3.19526 20.6951C3.02308 20.9353 3.09569 21.2716 3.35164 21.4194L5.3547 22.5759C5.61439 22.7258 5.94674 22.615 6.06452 22.3393L7.51223 18.9496C7.13192 18.7903 6.75688 18.6045 6.38909 18.3922C6.02099 18.1797 5.67235 17.9475 5.34395 17.6976ZM18.999 22.5003C20.3797 22.5003 21.499 21.3811 21.499 20.0003C21.499 18.6196 20.3797 17.5003 18.999 17.5003C17.6183 17.5003 16.499 18.6196 16.499 20.0003C16.499 21.3811 17.6183 22.5003 18.999 22.5003Z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  // Não renderizar até estar montado no cliente
  if (!mounted) {
    return (
      <TransitionLayout backgroundColor="var(--background)">
        <PageLayout>
          <div className="mt-2">
            <div className="space-y-4 md:space-y-6">
              <div>
                <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-text-primary mb-1 md:mb-2">
                  Calendário de Jogos
                </h1>
                <p className="text-xs md:text-sm text-text-secondary">
                  Visualize todos os jogos programados
                </p>
              </div>
            </div>
          </div>
        </PageLayout>
      </TransitionLayout>
    );
  }

  return (
    <TransitionLayout backgroundColor="var(--background)">
      <PageLayout>
        <div className="mt-2">
          <div className="space-y-4 md:space-y-6">
            {/* Header da Página */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-text-primary mb-1 md:mb-2">
                  Calendário de Jogos
                </h1>
                <p className="text-xs md:text-sm text-text-secondary">
                  Visualize todos os jogos programados
                </p>
              </div>
            </div>
            
            {/* Filtros */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveSport('todos')}
                className={`px-3 py-2 text-xs rounded-full transition-colors ${
                  activeSport === 'todos'
                    ? 'bg-accent-primary text-text-inverse'
                    : 'bg-background-card text-text-secondary hover:text-text-primary'
                }`}
              >
                Todos
              </button>
              {sports.map((sport) => (
                <button
                  key={sport.id}
                  onClick={() => setActiveSport(sport.id)}
                  className={`px-3 py-1 text-xs rounded-full transition-colors flex items-center gap-1 ${
                    activeSport === sport.id
                      ? 'bg-accent-primary text-text-inverse'
                      : 'bg-background-card text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {renderSportIcon(sport.id)}
                  {sport.label}
                </button>
              ))}
            </div>

            {/* Lista de Jogos */}
            <div className="space-y-3">
              {filteredJogos.map((jogo) => {
                const statusInfo = getStatusInfo(jogo.status);
                return (
                  <div
                    key={jogo.id}
                    className="bg-background-card rounded-lg p-4 border border-border-default hover:border-border-accent transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {renderSportIcon(jogo.sport)}
                        <span className="text-sm font-medium text-text-primary">
                          {jogo.sport}
                        </span>
                      </div>
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                        {statusInfo.icon}
                        {statusInfo.label}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-text-secondary">
                          {formatDate(jogo.data)}
                        </span>
                        <span className="text-sm font-medium text-text-primary">
                          {jogo.time}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-text-primary">
                            {jogo.team1}
                          </span>
                          <span className="text-sm text-text-secondary">vs</span>
                          <span className="text-sm font-medium text-text-primary">
                            {jogo.team2}
                          </span>
                        </div>
                        {jogo.score && (
                          <span className="text-sm font-bold text-accent-primary">
                            {jogo.score}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-text-muted">
                          {jogo.court}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </PageLayout>
    </TransitionLayout>
  );
} 