import { useState } from 'react';
import { Search, SlidersHorizontal, TrendingUp, Music2, Headphones, Mic2, Drum, Guitar } from 'lucide-react';

const genres = [
  { label: 'All',        active: true  },
  { label: 'Electronic', active: false },
  { label: 'Lo-fi',      active: false },
  { label: 'Ambient',    active: false },
  { label: 'Hip-hop',    active: false },
  { label: 'Jazz',       active: false },
  { label: 'Indie',      active: false },
  { label: 'Techno',     active: false },
];

const collections = [
  {
    id: 1, title: 'Cyberpunk Frequencies',
    tracks: 24, followers: '8.2K',
    img: 'https://images.pexels.com/photos/3783471/pexels-photo-3783471.jpeg?auto=compress&cs=tinysrgb&w=600',
    color: 'from-vibe-800 to-dark-card',
  },
  {
    id: 2, title: 'Sunrise Meditation',
    tracks: 18, followers: '5.4K',
    img: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=600',
    color: 'from-orange-900 to-dark-card',
  },
  {
    id: 3, title: 'Underground Sessions',
    tracks: 31, followers: '14.1K',
    img: 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=600',
    color: 'from-gray-800 to-dark-card',
  },
  {
    id: 4, title: 'Tokyo Nights',
    tracks: 22, followers: '9.7K',
    img: 'https://images.pexels.com/photos/3052361/pexels-photo-3052361.jpeg?auto=compress&cs=tinysrgb&w=600',
    color: 'from-pink-900 to-dark-card',
  },
  {
    id: 5, title: 'Basement Techno',
    tracks: 40, followers: '21.3K',
    img: 'https://images.pexels.com/photos/1540319/pexels-photo-1540319.jpeg?auto=compress&cs=tinysrgb&w=600',
    color: 'from-blue-900 to-dark-card',
  },
  {
    id: 6, title: 'Acoustic Solitude',
    tracks: 15, followers: '3.8K',
    img: 'https://images.pexels.com/photos/1021876/pexels-photo-1021876.jpeg?auto=compress&cs=tinysrgb&w=600',
    color: 'from-amber-900 to-dark-card',
  },
];

const categories = [
  { icon: TrendingUp, label: 'Trending',  count: 240 },
  { icon: Headphones, label: 'Podcasts',  count: 118 },
  { icon: Mic2,       label: 'Artists',   count: 3400 },
  { icon: Music2,     label: 'Albums',    count: 890 },
  { icon: Drum,       label: 'Beats',     count: 620 },
  { icon: Guitar,     label: 'Acoustic',  count: 205 },
];

export default function Explore() {
  const [activeGenre, setActiveGenre] = useState('All');
  const [query, setQuery] = useState('');

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Explore</h1>
        <p className="text-gray-500 text-sm">Discover sounds, collections, and artists</p>
      </div>

      {/* Search bar */}
      <div className="relative flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search vibes, artists, genres..."
            className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-dark-surface border border-dark-border text-white placeholder-gray-600 text-sm focus:outline-none focus:border-vibe-600/60 focus:shadow-neon-sm transition-all duration-200"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-3.5 rounded-xl bg-dark-surface border border-dark-border text-gray-400 hover:text-white hover:border-vibe-600/40 transition-all duration-200 text-sm">
          <SlidersHorizontal size={15} />
          <span className="hidden sm:inline">Filters</span>
        </button>
      </div>

      {/* Genre chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {genres.map((g) => (
          <button
            key={g.label}
            onClick={() => setActiveGenre(g.label)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 ${
              activeGenre === g.label
                ? 'bg-vibe-600 text-white shadow-neon-sm'
                : 'bg-dark-surface border border-dark-border text-gray-400 hover:text-white hover:border-vibe-600/40'
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>

      {/* Browse categories */}
      <section>
        <h2 className="text-base font-semibold text-white mb-4">Browse categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map(({ icon: Icon, label, count }) => (
            <button
              key={label}
              className="group flex flex-col items-start gap-3 p-4 rounded-2xl bg-dark-surface border border-dark-border hover:border-vibe-600/40 hover:shadow-neon-sm transition-all duration-200 text-left"
            >
              <div className="w-9 h-9 rounded-xl bg-vibe-600/15 flex items-center justify-center group-hover:bg-vibe-600/25 transition-colors duration-200">
                <Icon size={16} className="text-vibe-400" />
              </div>
              <div>
                <p className="text-white text-sm font-medium">{label}</p>
                <p className="text-gray-600 text-xs">{count.toLocaleString()}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Featured collections */}
      <section>
        <h2 className="text-base font-semibold text-white mb-4">Featured collections</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {collections.map((col) => (
            <div
              key={col.id}
              className="group relative rounded-2xl overflow-hidden cursor-pointer border border-dark-border hover:border-vibe-600/40 transition-all duration-300 hover:shadow-neon-sm"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={col.img}
                  alt={col.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${col.color} opacity-80`} />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white font-semibold text-sm">{col.title}</p>
                  <p className="text-gray-300 text-xs mt-1">{col.tracks} tracks · {col.followers} followers</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
