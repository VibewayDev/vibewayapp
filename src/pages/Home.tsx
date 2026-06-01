import { TrendingUp, Flame, Clock, Zap, ArrowRight, Play } from 'lucide-react';

const trendingVibes = [
  { id: 1, title: 'Lo-fi Morning Sessions',  genre: 'Lo-fi',      plays: '12.4K', color: 'from-blue-600 to-cyan-500',    img: 'https://images.pexels.com/photos/1626481/pexels-photo-1626481.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 2, title: 'Neon City Beats',         genre: 'Electronic', plays: '9.1K',  color: 'from-vibe-600 to-neon-pink',   img: 'https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 3, title: 'Late Night Frequencies',  genre: 'Ambient',    plays: '7.8K',  color: 'from-green-600 to-teal-500',   img: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 4, title: 'Chill Waves Vol. 3',      genre: 'Chill',      plays: '6.3K',  color: 'from-orange-500 to-amber-400', img: 'https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg?auto=compress&cs=tinysrgb&w=400' },
];

const liveChannels = [
  { id: 1, name: 'Deep Space Radio',   listeners: 842,  tag: 'Live',   dot: 'bg-red-500' },
  { id: 2, name: 'Sunset Groove FM',  listeners: 1205, tag: 'Live',   dot: 'bg-red-500' },
  { id: 3, name: 'Study Beats 24/7',  listeners: 3381, tag: 'Always', dot: 'bg-green-500' },
];

const stats = [
  { label: 'Active Vibes',    value: '2.4M',  icon: Zap },
  { label: 'Live Streams',    value: '318',   icon: Flame },
  { label: 'Played Today',    value: '89K',   icon: Play },
  { label: 'New This Week',   value: '+1.2K', icon: TrendingUp },
];

export default function Home() {
  return (
    <div className="space-y-10 animate-fade-in">
      {/* Greeting */}
      <div>
        <p className="text-gray-500 text-sm mb-1">Good vibes,</p>
        <h1 className="text-3xl font-bold text-white">What's the frequency?</h1>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="p-5 rounded-2xl bg-dark-surface border border-dark-border hover:border-vibe-600/30 transition-all duration-200 group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-500 text-xs font-medium">{label}</span>
              <div className="w-7 h-7 rounded-lg bg-vibe-600/15 flex items-center justify-center group-hover:shadow-neon-sm transition-all duration-200">
                <Icon size={13} className="text-vibe-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{value}</p>
          </div>
        ))}
      </div>

      {/* Trending vibes */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-vibe-400" />
            <h2 className="text-lg font-semibold text-white">Trending vibes</h2>
          </div>
          <button className="flex items-center gap-1 text-xs text-vibe-400 hover:text-vibe-300 transition-colors duration-200">
            See all <ArrowRight size={12} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {trendingVibes.map((vibe) => (
            <div
              key={vibe.id}
              className="group relative rounded-2xl overflow-hidden cursor-pointer border border-dark-border hover:border-vibe-600/40 transition-all duration-300 hover:shadow-neon-sm"
            >
              {/* Cover image */}
              <div className="relative h-40 overflow-hidden">
                <img
                  src={vibe.img}
                  alt={vibe.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-card via-dark-card/40 to-transparent" />

                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="w-12 h-12 rounded-full bg-vibe-600/80 backdrop-blur-sm flex items-center justify-center shadow-neon">
                    <Play size={18} className="text-white ml-0.5" fill="white" />
                  </div>
                </div>

                {/* Genre badge */}
                <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-semibold text-white bg-gradient-to-r ${vibe.color} shadow-neon-sm`}>
                  {vibe.genre}
                </span>
              </div>

              {/* Info */}
              <div className="p-4 bg-dark-surface">
                <p className="text-white font-medium text-sm truncate mb-1">{vibe.title}</p>
                <p className="text-gray-500 text-xs">{vibe.plays} plays</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Live channels */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Flame size={16} className="text-red-400" />
            <h2 className="text-lg font-semibold text-white">Live channels</h2>
          </div>
          <button className="flex items-center gap-1 text-xs text-vibe-400 hover:text-vibe-300 transition-colors duration-200">
            Browse all <ArrowRight size={12} />
          </button>
        </div>

        <div className="space-y-3">
          {liveChannels.map((ch) => (
            <div
              key={ch.id}
              className="group flex items-center justify-between p-5 rounded-2xl bg-dark-surface border border-dark-border hover:border-vibe-600/30 transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-vibe-600 to-neon-pink flex items-center justify-center shadow-neon-sm">
                  <Radio size={18} className="text-white" />
                  <span className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${ch.dot} border-2 border-dark-surface`} />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{ch.name}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{ch.listeners.toLocaleString()} listeners</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold text-white ${ch.tag === 'Live' ? 'bg-red-500/80' : 'bg-green-600/80'}`}>
                  {ch.tag}
                </span>
                <ArrowRight size={14} className="text-gray-600 group-hover:text-vibe-400 group-hover:translate-x-0.5 transition-all duration-200" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent */}
      <section>
        <div className="flex items-center gap-2 mb-5">
          <Clock size={16} className="text-gray-500" />
          <h2 className="text-lg font-semibold text-white">Recently played</h2>
        </div>
        <div className="flex flex-col items-center justify-center py-16 rounded-2xl bg-dark-surface border border-dark-border border-dashed">
          <div className="w-12 h-12 rounded-full bg-dark-card flex items-center justify-center mb-4">
            <Clock size={20} className="text-gray-600" />
          </div>
          <p className="text-gray-500 text-sm">Nothing yet — start exploring vibes</p>
        </div>
      </section>
    </div>
  );
}

function Radio({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" />
      <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.4" />
      <circle cx="12" cy="12" r="2" />
      <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.4" />
      <path d="M19.1 4.9C23 8.8 23 15.1 19.1 19" />
    </svg>
  );
}
