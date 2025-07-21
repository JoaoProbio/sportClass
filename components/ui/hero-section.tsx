import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

const HERO_IMAGE_URL =
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'; // Example Unsplash image

const HeroSection = () => {
  return (
    <section className="relative flex flex-col-reverse lg:flex-row items-center justify-center min-h-screen w-full px-4 py-12 lg:py-0 bg-transparent">
      {/* Left: Text Content */}
      <div className="flex flex-col items-center lg:items-start justify-center w-full lg:w-1/2 text-center lg:text-left z-10">
        {/* Badge */}
        <span className="inline-block mb-6 px-4 py-1 rounded-xl border border-slate-200 bg-white/80 text-xs font-medium tracking-widest text-slate-500 uppercase shadow-sm">
          SCIENCE-BASED AESTHETICS
        </span>
        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4 text-slate-800 dark:text-white">
          Glow-Up <span className="text-slate-400">Without Surgery</span>
        </h1>
        {/* Subtitle */}
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-xl mx-auto lg:mx-0">
          Get your personalized facial analysis and transformation plan based on 2000+ academic studies.
        </p>
        {/* CTA Button */}
        <a
          href=""
          className="inline-flex items-center justify-center px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg transition-colors duration-200 text-lg focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 group"
          tabIndex={0}
          aria-label="Start Now"
        >
          Start-Now
          <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </a>
      </div>
      {/* Right: Image (hidden on mobile) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center mb-10 lg:mb-0">
        <div className="relative w-full max-w-md aspect-[4/3] rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-white/30">
          <Image
            src={HERO_IMAGE_URL}
            alt="Glow-up inspiration"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-center"
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 