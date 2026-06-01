import { Bell, Heart, UserPlus, Zap, Music2 } from 'lucide-react';

const notifications = [
  {
    id: 1,
    type: 'like',
    icon: Heart,
    iconColor: 'text-red-400',
    iconBg: 'bg-red-500/15',
    user: 'neonwave',
    action: 'liked your vibe',
    track: 'Midnight Frequencies',
    time: '2 min ago',
    read: false,
  },
  {
    id: 2,
    type: 'follow',
    icon: UserPlus,
    iconColor: 'text-vibe-400',
    iconBg: 'bg-vibe-600/15',
    user: 'lo_fi_dreamer',
    action: 'started following you',
    track: null,
    time: '18 min ago',
    read: false,
  },
  {
    id: 3,
    type: 'vibe',
    icon: Zap,
    iconColor: 'text-yellow-400',
    iconBg: 'bg-yellow-500/15',
    user: 'pulse_theory',
    action: 'revibed your track',
    track: 'Orbital Drift',
    time: '1 hr ago',
    read: false,
  },
  {
    id: 4,
    type: 'track',
    icon: Music2,
    iconColor: 'text-green-400',
    iconBg: 'bg-green-500/15',
    user: 'vibeway',
    action: 'New drop in your followed genre — Electronic',
    track: 'Neon City Beats',
    time: '3 hr ago',
    read: true,
  },
  {
    id: 5,
    type: 'like',
    icon: Heart,
    iconColor: 'text-red-400',
    iconBg: 'bg-red-500/15',
    user: 'synth_witch',
    action: 'liked your vibe',
    track: 'Rain on Glass',
    time: '5 hr ago',
    read: true,
  },
];

export default function Activity() {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Activity</h1>
          <p className="text-gray-500 text-sm">Your notifications and updates</p>
        </div>
        {unreadCount > 0 && (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-vibe-600/20 border border-vibe-600/30 text-vibe-300 text-xs font-medium">
            <Bell size={12} />
            {unreadCount} new
          </span>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {['All', 'Mentions', 'Follows', 'Likes'].map((tab, i) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              i === 0
                ? 'bg-vibe-600/20 text-vibe-300 border border-vibe-600/30 shadow-neon-sm'
                : 'text-gray-500 hover:text-white hover:bg-dark-surface border border-transparent'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Notification list */}
      <div className="space-y-2">
        {notifications.map((n) => {
          const Icon = n.icon;
          return (
            <div
              key={n.id}
              className={`group flex items-start gap-4 p-5 rounded-2xl transition-all duration-200 cursor-pointer border ${
                !n.read
                  ? 'bg-dark-surface border-dark-border hover:border-vibe-600/30'
                  : 'bg-dark-base border-transparent hover:bg-dark-surface hover:border-dark-border'
              }`}
            >
              {/* Unread dot */}
              {!n.read && (
                <span className="mt-2 flex-shrink-0 w-2 h-2 rounded-full bg-vibe-400 shadow-neon-sm" />
              )}
              {n.read && <span className="mt-2 flex-shrink-0 w-2 h-2" />}

              {/* Icon */}
              <div className={`flex-shrink-0 w-10 h-10 rounded-xl ${n.iconBg} flex items-center justify-center`}>
                <Icon size={16} className={n.iconColor} />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white">
                  <span className="font-semibold">@{n.user}</span>{' '}
                  <span className={n.read ? 'text-gray-400' : 'text-gray-300'}>{n.action}</span>
                  {n.track && (
                    <span className="text-vibe-400 font-medium"> "{n.track}"</span>
                  )}
                </p>
                <p className="text-xs text-gray-600 mt-1">{n.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
