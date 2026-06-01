import { Music2, Users, Heart, Play, Settings2, ExternalLink } from 'lucide-react';

const stats = [
  { label: 'Vibes',     value: '47'  },
  { label: 'Followers', value: '1.2K' },
  { label: 'Following', value: '234' },
];

const recentVibes = [
  {
    id: 1,
    title: 'Midnight Frequencies',
    genre: 'Electronic',
    plays: '1.2K',
    likes: 142,
    img: 'https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    id: 2,
    title: 'Rain on Glass',
    genre: 'Lo-fi',
    plays: '834',
    likes: 89,
    img: 'https://images.pexels.com/photos/1626481/pexels-photo-1626481.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    id: 3,
    title: 'Orbital Drift',
    genre: 'Ambient',
    plays: '4.8K',
    likes: 311,
    img: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
];

export default function Profile() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Profile header */}
      <div className="relative rounded-2xl overflow-hidden bg-dark-surface border border-dark-border">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-vibe-900 via-vibe-700 to-neon-pink/50 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)',
              backgroundSize: '30px 30px',
            }}
          />
        </div>

        {/* Avatar + info */}
        <div className="px-6 pb-6">
          <div className="flex items-end justify-between -mt-10 mb-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-vibe-500 to-neon-pink border-4 border-dark-surface flex items-center justify-center text-white text-2xl font-bold shadow-neon">
                V
              </div>
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-dark-surface" />
            </div>
            <div className="flex gap-2 mb-1">
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-dark-border text-gray-400 hover:border-vibe-600/40 hover:text-white text-sm transition-all duration-200">
                <Settings2 size={13} />
                Edit
              </button>
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-vibe-600/20 border border-vibe-600/30 text-vibe-300 hover:bg-vibe-600/30 text-sm transition-all duration-200">
                <ExternalLink size={13} />
                Share
              </button>
            </div>
          </div>

          <h2 className="text-xl font-bold text-white">vibeway user</h2>
          <p className="text-gray-500 text-sm mt-1">Tuning in to the frequencies that matter</p>

          {/* Tags */}
          <div className="flex gap-2 mt-3 flex-wrap">
            {['Electronic', 'Lo-fi', 'Ambient'].map((tag) => (
              <span key={tag} className="px-2.5 py-1 rounded-full text-xs text-gray-400 bg-dark-card border border-dark-border">
                {tag}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div className="flex gap-6 mt-5 pt-5 border-t border-dark-border">
            {stats.map(({ label, value }) => (
              <div key={label} className="text-center">
                <p className="text-xl font-bold text-white">{value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-dark-surface border border-dark-border w-fit">
        {['My Vibes', 'Liked', 'Following'].map((tab, i) => (
          <button
            key={tab}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              i === 0
                ? 'bg-vibe-600/25 text-vibe-300 shadow-neon-sm'
                : 'text-gray-500 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Vibes grid */}
      <div className="space-y-3">
        {recentVibes.map((v) => (
          <div
            key={v.id}
            className="group flex items-center gap-4 p-4 rounded-2xl bg-dark-surface border border-dark-border hover:border-vibe-600/30 transition-all duration-200 cursor-pointer"
          >
            <img
              src={v.img}
              alt={v.title}
              className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm truncate">{v.title}</p>
              <p className="text-gray-500 text-xs mt-0.5">{v.genre}</p>
            </div>
            <div className="flex items-center gap-4 text-gray-500 text-xs">
              <span className="flex items-center gap-1">
                <Play size={12} className="text-gray-600" />
                {v.plays}
              </span>
              <span className="flex items-center gap-1">
                <Heart size={12} className="text-gray-600" />
                {v.likes}
              </span>
            </div>
            <button className="w-9 h-9 rounded-full bg-dark-card hover:bg-vibe-600/25 flex items-center justify-center transition-all duration-200 group-hover:shadow-neon-sm flex-shrink-0">
              <Play size={13} className="text-vibe-400 ml-0.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Empty state for liked/following */}
      <div className="flex flex-col items-center justify-center py-12 rounded-2xl bg-dark-surface border border-dark-border border-dashed">
        <div className="w-12 h-12 rounded-full bg-dark-card flex items-center justify-center mb-4">
          <Music2 size={20} className="text-gray-600" />
        </div>
        <p className="text-gray-500 text-sm">More vibes coming soon</p>
      </div>
    </div>
  );
}
