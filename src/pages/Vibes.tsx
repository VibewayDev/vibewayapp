import { Zap, Play, Heart, Repeat2, TrendingUp, Users } from 'lucide-react';

const vibesFeed = [
  {
    id: 1,
    user: 'neonwave',
    avatar: 'N',
    avatarColor: 'from-vibe-600 to-neon-pink',
    track: 'Midnight Frequencies',
    genre: 'Electronic',
    time: '2m ago',
    likes: 142,
    plays: '1.2K',
    img: 'https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    id: 2,
    user: 'lo_fi_dreamer',
    avatar: 'L',
    avatarColor: 'from-blue-600 to-cyan-500',
    track: 'Rain on Glass',
    genre: 'Lo-fi',
    time: '15m ago',
    likes: 89,
    plays: '834',
    img: 'https://images.pexels.com/photos/1626481/pexels-photo-1626481.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    id: 3,
    user: 'pulse_theory',
    avatar: 'P',
    avatarColor: 'from-green-600 to-teal-400',
    track: 'Orbital Drift',
    genre: 'Ambient',
    time: '1h ago',
    likes: 311,
    plays: '4.8K',
    img: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    id: 4,
    user: 'synth_witch',
    avatar: 'S',
    avatarColor: 'from-pink-600 to-rose-500',
    track: 'Velvet Undertow',
    genre: 'Synth',
    time: '3h ago',
    likes: 204,
    plays: '2.3K',
    img: 'https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
];

const trendingTags = ['#deephouse', '#lofi', '#ambientwave', '#techno', '#chillhop', '#bassline', '#atmospheric', '#synthpop'];

export default function Vibes() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Vibes</h1>
          <p className="text-gray-500 text-sm">What the scene is feeling right now</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-vibe-600 text-white text-sm font-medium hover:bg-vibe-500 shadow-neon-sm transition-all duration-200">
          <Zap size={14} />
          Drop a vibe
        </button>
      </div>

      {/* Trending tags */}
      <div className="flex gap-2 flex-wrap">
        {trendingTags.map((tag) => (
          <button
            key={tag}
            className="px-3 py-1.5 rounded-full text-xs font-medium bg-dark-surface border border-dark-border text-gray-400 hover:text-vibe-300 hover:border-vibe-600/40 transition-all duration-200"
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Feed */}
      <div className="space-y-4">
        {vibesFeed.map((item) => (
          <div
            key={item.id}
            className="group p-5 rounded-2xl bg-dark-surface border border-dark-border hover:border-vibe-600/30 transition-all duration-200"
          >
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className={`w-10 h-10 flex-shrink-0 rounded-full bg-gradient-to-br ${item.avatarColor} flex items-center justify-center text-white text-sm font-bold shadow-neon-sm`}>
                {item.avatar}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-white font-medium text-sm">@{item.user}</span>
                  <span className="text-gray-600 text-xs">·</span>
                  <span className="text-gray-600 text-xs">{item.time}</span>
                  <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-medium bg-vibe-600/15 text-vibe-300 border border-vibe-600/25">
                    {item.genre}
                  </span>
                </div>

                {/* Track card */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-dark-card border border-dark-border hover:border-vibe-600/25 transition-all duration-200 cursor-pointer">
                  <img
                    src={item.img}
                    alt={item.track}
                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{item.track}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{item.plays} plays</p>
                  </div>
                  <button className="w-9 h-9 rounded-full bg-vibe-600/20 hover:bg-vibe-600/40 flex items-center justify-center transition-all duration-200 group-hover:shadow-neon-sm">
                    <Play size={14} className="text-vibe-400 ml-0.5" />
                  </button>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-5 mt-3">
                  <button className="flex items-center gap-1.5 text-gray-500 hover:text-red-400 transition-colors duration-200 text-xs">
                    <Heart size={14} />
                    {item.likes}
                  </button>
                  <button className="flex items-center gap-1.5 text-gray-500 hover:text-vibe-400 transition-colors duration-200 text-xs">
                    <Repeat2 size={14} />
                    Revibe
                  </button>
                  <button className="flex items-center gap-1.5 text-gray-500 hover:text-green-400 transition-colors duration-200 text-xs">
                    <TrendingUp size={14} />
                    Boost
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load more */}
      <div className="flex justify-center pt-2">
        <button className="px-6 py-2.5 rounded-xl border border-dark-border text-gray-400 text-sm hover:border-vibe-600/40 hover:text-white transition-all duration-200">
          Load more vibes
        </button>
      </div>
    </div>
  );
}
