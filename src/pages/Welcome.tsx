import { useNavigate } from 'react-router-dom';
import { ArrowRight, Zap, Music, Radio, Waves } from 'lucide-react';
import Logo from '../components/Logo';

const features = [
  { icon: Zap,   title: 'Instant Vibes',  desc: 'Discover trending sounds in real time.' },
  { icon: Music, title: 'Curated Drops',  desc: 'Hand-picked collections updated daily.' },
  { icon: Radio, title: 'Live Channels',  desc: 'Tune into live audio streams worldwide.' },
  { icon: Waves, title: 'Wave Sync',      desc: 'Sync your vibe with your crew.' },
];

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-dark-base overflow-hidden flex flex-col">
      {/* Ambient background blobs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-vibe-700/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-neon-pink/8 blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-vibe-600/5 blur-[150px]" />
      </div>

      {/* Grid overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(168,85,247,1) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 md:px-12 py-6">
        <div className="flex items-center gap-3">
          <Logo size={44} animated />
          <span className="text-2xl font-bold tracking-tight text-white">
            vibe<span className="text-vibe-400">way</span>
          </span>
        </div>
        <button
          onClick={() => navigate('/home')}
          className="text-sm text-gray-400 hover:text-white transition-colors duration-200 border border-dark-border hover:border-vibe-600/50 px-4 py-2 rounded-lg"
        >
          Sign in
        </button>
      </header>

      {/* Hero */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 md:px-12 text-center py-16">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-vibe-600/15 border border-vibe-600/30 text-vibe-300 text-xs font-medium mb-8 animate-fade-in shadow-neon-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-vibe-400 animate-pulse" />
          Now live — vibeway beta
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6 animate-slide-up">
          Feel the{' '}
          <span className="relative inline-block">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-vibe-400 via-neon-purple to-neon-pink">
              frequency
            </span>
            <span className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-vibe-400 via-neon-purple to-neon-pink opacity-60" />
          </span>
          <br />of your world.
        </h1>

        <p className="max-w-xl text-gray-400 text-lg md:text-xl leading-relaxed mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          vibeway is your space for real-time audio discovery, live streams, and synced experiences with the people who matter.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <button
            onClick={() => navigate('/home')}
            className="group flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-vibe-600 to-vibe-500 text-white font-semibold text-base shadow-neon hover:shadow-neon-lg transition-all duration-300 hover:scale-105 active:scale-95"
          >
            Get started free
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-200" />
          </button>
          <button
            onClick={() => navigate('/explore')}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl border border-dark-border text-gray-300 font-medium text-base hover:border-vibe-600/50 hover:text-white transition-all duration-200"
          >
            Explore vibes
          </button>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-20 w-full max-w-4xl animate-fade-in" style={{ animationDelay: '0.3s' }}>
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group p-6 rounded-2xl bg-dark-surface/80 border border-dark-border hover:border-vibe-600/40 transition-all duration-300 hover:shadow-neon-sm backdrop-blur-sm text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-vibe-600/20 border border-vibe-600/30 flex items-center justify-center mb-4 group-hover:shadow-neon-sm transition-all duration-300">
                <Icon size={18} className="text-vibe-400" />
              </div>
              <h3 className="text-white font-semibold text-sm mb-1">{title}</h3>
              <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-6 text-gray-600 text-xs">
        © 2026 vibeway · Built for the frequency seekers
      </footer>
    </div>
  );
}
