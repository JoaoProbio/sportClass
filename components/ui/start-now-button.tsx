import { ArrowRight } from 'lucide-react';

const StartNowButton = () => (
  <a
    href="/jogos"
    className="inline-flex items-center justify-between px-4 py-2 bg-orange-400/10 rounded-sm font-medium text-white text-sm focus:outline-none group shadow-md"
    tabIndex={0}
    aria-label="Start Now"
  >
    <span>Start-Now</span>
    <span className="h-5 w-px bg-white/30 mx-4" aria-hidden="true" />
    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
  </a>
);

export default StartNowButton; 