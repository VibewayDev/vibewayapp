import { useState, useEffect, useRef } from 'react';
import { Send, AlertTriangle, Users, MessageSquare, X, Lock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { queueMessage } from '../lib/offlineStore';
import { useTheme } from '../lib/timeTheme';
import { useProfile } from '../lib/profileContext';
import { useTemperature } from '../hooks/useTemperature';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderColor: string;
  senderInitial: string;
  content: string;
  isSos: boolean;
  createdAt: Date;
  isSelf: boolean;
}

interface Conversation {
  id: string;
  username: string;
  avatarColor: string;
  avatarInitial: string;
  lastMessage: string;
  unread: number;
  online: boolean;
}

const MOCK_CONVOS: Conversation[] = [
  { id: 'tv3', username: 'alex_v',    avatarColor: 'from-emerald-500 to-teal-600',  avatarInitial: 'A', lastMessage: 'Sí, bajo en Plaza',     unread: 2, online: true },
  { id: 'tv1', username: 'viajera_M', avatarColor: 'from-rose-500 to-pink-600',     avatarInitial: 'M', lastMessage: '¿Qué línea tomaste?',   unread: 0, online: true },
  { id: 'tv6', username: 'luna_t',    avatarColor: 'from-violet-500 to-purple-600', avatarInitial: 'L', lastMessage: '👋',                    unread: 1, online: false },
];

const MOCK_PRIVATE_MSGS: Message[] = [
  { id: 'm1', senderId: 'tv3',  senderName: 'alex_v', senderColor: 'from-emerald-500 to-teal-600', senderInitial: 'A', content: 'Hey! ¿Vas al Centro?',       isSos: false, createdAt: new Date(Date.now() - 300_000), isSelf: false },
  { id: 'm2', senderId: 'self', senderName: 'tú',     senderColor: 'from-amber-400 to-orange-500', senderInitial: 'T', content: 'Sí, bajo en Plaza del Sol', isSos: false, createdAt: new Date(Date.now() - 200_000), isSelf: true },
  { id: 'm3', senderId: 'tv3',  senderName: 'alex_v', senderColor: 'from-emerald-500 to-teal-600', senderInitial: 'A', content: 'Genial, yo también 🙌',     isSos: false, createdAt: new Date(Date.now() - 120_000), isSelf: false },
];

const MOCK_GROUP_MSGS: Message[] = [
  { id: 'g1', senderId: 'tv1', senderName: 'viajera_M', senderColor: 'from-rose-500 to-pink-600',    senderInitial: 'M', content: 'El tren lleva 5 min de retraso', isSos: false, createdAt: new Date(Date.now() - 420_000), isSelf: false },
  { id: 'g2', senderId: 'tv4', senderName: 'sol_r',     senderColor: 'from-amber-500 to-orange-600', senderInitial: 'S', content: 'Hay mucha gente en el vagón 3', isSos: false, createdAt: new Date(Date.now() - 300_000), isSelf: false },
  { id: 'g3', senderId: 'self', senderName: 'tú',       senderColor: 'from-amber-400 to-orange-500', senderInitial: 'T', content: 'Gracias por el aviso!',         isSos: false, createdAt: new Date(Date.now() - 180_000), isSelf: true },
];

function formatTime(d: Date) {
  return d.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });
}

function TempBadge({ temp, loading }: { temp: number | null; loading: boolean }) {
  if (loading) return null;
  return (
    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
      style={{ background: 'rgba(245,166,35,0.15)', color: '#f5a623', border: '1px solid rgba(245,166,35,0.25)' }}>
      🌡️ {temp !== null ? `${temp}°C` : '--°C'}
    </span>
  );
}

function Avatar({ color, initial, size = 36, online }: { color: string; initial: string; size?: number; online?: boolean }) {
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <div className={`w-full h-full rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold`}
        style={{ fontSize: size * 0.36 }}>
        {initial}
      </div>
      {online !== undefined && (
        <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 ${online ? 'bg-radar-green' : 'bg-slate-500'}`}
          style={{ borderColor: 'inherit' }} />
      )}
    </div>
  );
}

function SOSBanner({ onDismiss, isNight }: { onDismiss: () => void; isNight: boolean }) {
  const [seconds, setSeconds] = useState(10);
  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => { if (s <= 1) { onDismiss(); return 0; } return s - 1; }), 1000);
    return () => clearInterval(id);
  }, [onDismiss]);

  return (
    <div className="mx-3 mb-3">
      <div className="relative flex items-start gap-3 px-4 py-3 rounded-2xl border-2 border-radar-red animate-pulse"
        style={{ background: 'rgba(255,59,92,0.15)', boxShadow: '0 0 24px 6px rgba(255,59,92,0.35)' }}>
        <AlertTriangle size={20} className="text-radar-red flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-radar-red font-bold text-sm">EMERGENCIA SOS</p>
          <p className={`text-xs mt-0.5 ${isNight ? 'text-slate-300' : 'text-slate-600'}`}>
            Solicitud de ayuda activa en tu ruta.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-radar-red font-mono text-sm font-bold">{seconds}s</span>
          <button onClick={onDismiss}><X size={14} className="text-slate-400" /></button>
        </div>
        <div className="absolute bottom-0 left-0 h-0.5 bg-radar-red rounded-full transition-all duration-1000"
          style={{ width: `${(seconds / 10) * 100}%` }} />
      </div>
    </div>
  );
}

// Modal SOS personalizable
function SOSModal({ onSend, onCancel, isNight }: { onSend: (text: string) => void; onCancel: () => void; isNight: boolean }) {
  const [text, setText] = useState('⚠️ NECESITO AYUDA — EMERGENCIA EN RUTA');
  return (
    <div className="fixed inset-0 z-50 flex items-end" style={{ background: 'rgba(0,0,0,0.8)' }}>
      <div className="w-full rounded-t-3xl p-5 pb-10" style={{ background: '#1a0008', border: '1px solid rgba(255,59,92,0.3)' }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,59,92,0.2)' }}>
            <AlertTriangle size={20} className="text-red-400" />
          </div>
          <div>
            <h3 className="text-red-400 font-bold text-base">🆘 EMERGENCIA</h3>
            <p className="text-slate-400 text-xs">El mensaje se fijará 10 segundos para todos</p>
          </div>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none mb-4"
          style={{ background: 'rgba(255,59,92,0.1)', border: '1px solid rgba(255,59,92,0.3)', color: '#ff6b6b' }}
          placeholder="Describe tu emergencia..."
        />
        <button onClick={() => onSend(text)}
          className="w-full py-3 rounded-xl font-bold text-white text-sm mb-2 active:scale-95 transition-all"
          style={{ background: 'linear-gradient(135deg,#ff3b5c,#ff1a1a)', boxShadow: '0 0 20px rgba(255,59,92,0.5)' }}>
          🆘 ENVIAR SOS AHORA
        </button>
        <button onClick={onCancel}
          className="w-full py-2.5 rounded-xl text-slate-400 text-sm border border-slate-700">
          Cancelar
        </button>
      </div>
    </div>
  );
}

export default function Chats() {
  const { theme } = useTheme();
  const { profile } = useProfile();
  const { temp, loading: tempLoading } = useTemperature();
  const isNight = theme === 'night';

  const [tab, setTab]                 = useState<'private' | 'group'>('private');
  const [activeConvo, setActiveConvo] = useState<Conversation | null>(null);
  const [privateMessages, setPrivate] = useState<Message[]>(MOCK_PRIVATE_MSGS);
  const [groupMessages, setGroup]     = useState<Message[]>(MOCK_GROUP_MSGS);
  const [input, setInput]             = useState('');
  const [sosBanner, setSosBanner]     = useState(false);
  const [sosModal, setSosModal]       = useState(false);
  const [sending, setSending]         = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [privateMessages, groupMessages, activeConvo]);

  async function sendMessage(isSos = false, sosText?: string) {
    const text = sosText ?? (isSos ? '⚠️ NECESITO AYUDA — EMERGENCIA EN RUTA' : input.trim());
    if (!text) return;
    setSending(true);

    const newMsg: Message = {
      id: `local-${Date.now()}`,
      senderId: profile.id,
      senderName: profile.username,
      senderColor: profile.avatarColor,
      senderInitial: profile.avatarInitial,
      content: text,
      isSos,
      createdAt: new Date(),
      isSelf: true,
    };

    if (tab === 'group') {
      setGroup((prev) => [...prev, newMsg]);
      if (isSos) setSosBanner(true);
      try {
        await supabase.from('room_messages').insert({
          room_id: 'linea-42',
          sender_id: profile.id,
          content: text,
          is_sos: isSos,
        });
      } catch {
        await queueMessage({ type: 'group', senderId: profile.id, roomId: 'linea-42', content: text, isSos, createdAt: new Date().toISOString() });
      }
    } else if (activeConvo) {
      setPrivate((prev) => [...prev, newMsg]);
      try {
        await supabase.from('messages').insert({
          sender_id: profile.id,
          receiver_id: activeConvo.id,
          content: text,
        });
      } catch {
        await queueMessage({ type: 'private', senderId: profile.id, receiverId: activeConvo.id, content: text, isSos: false, createdAt: new Date().toISOString() });
      }
    }

    setInput('');
    setSending(false);
  }

  const bg      = isNight ? 'bg-night-base'       : 'bg-day-base';
  const surface = isNight ? 'bg-night-surface'    : 'bg-white';
  const card    = isNight ? 'bg-night-card'       : 'bg-white';
  const border  = isNight ? 'border-night-border' : 'border-day-border';
  const textPri = isNight ? 'text-white'          : 'text-day-text';
  const textSec = isNight ? 'text-slate-400'      : 'text-slate-500';
  const gold    = isNight ? 'text-radar-gold'     : 'text-amber-600';

  // Conversation thread
  if (activeConvo && tab === 'private') {
    return (
      <div className={`flex flex-col h-screen ${bg} transition-colors duration-700`}>
        <div className={`flex items-center gap-3 px-4 pt-12 pb-3 border-b ${surface} ${border}`}>
          <button onClick={() => setActiveConvo(null)} className={`${textSec} mr-1`}><X size={18} /></button>
          <Avatar color={activeConvo.avatarColor} initial={activeConvo.avatarInitial} size={36} online={activeConvo.online} />
          <div className="flex-1">
            <p className={`font-semibold text-sm ${textPri}`}>@{activeConvo.username}</p>
            <p className="text-[10px] text-radar-green">{activeConvo.online ? 'En ruta' : 'Desconectado'}</p>
          </div>
          <TempBadge temp={temp} loading={tempLoading} />
          <div className="flex items-center gap-1 ml-2">
            <Lock size={11} className={textSec} />
            <span className={`text-[9px] ${textSec}`}>cifrado</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {privateMessages.map((m) => (
            <div key={m.id} className={`flex ${m.isSelf ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] flex flex-col gap-1 ${m.isSelf ? 'items-end' : 'items-start'}`}>
                <div className={`px-4 py-2.5 rounded-2xl text-sm leading-snug ${
                  m.isSelf
                    ? isNight ? 'bg-radar-gold/20 text-white border border-radar-gold/25 rounded-br-sm' : 'bg-amber-100 text-amber-900 rounded-br-sm'
                    : isNight ? 'bg-night-card text-white border border-night-border rounded-bl-sm' : 'bg-day-surface text-day-text border border-day-border rounded-bl-sm'
                }`}>
                  {m.content}
                </div>
                <span className={`text-[9px] ${textSec}`}>{formatTime(m.createdAt)}</span>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div className={`px-4 py-4 border-t ${surface} ${border} pb-28`}>
          <div className="flex items-center gap-2">
            <input value={input} onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Escribe un mensaje..."
              className={`flex-1 px-4 py-3 rounded-xl border text-sm outline-none transition-all ${
                isNight ? 'bg-night-card border-night-border text-white placeholder-slate-500 focus:border-radar-gold/50'
                        : 'bg-day-surface border-day-border text-day-text placeholder-slate-400 focus:border-amber-400'
              }`} />
            <button onClick={() => sendMessage()} disabled={!input.trim() || sending}
              className={`p-3 rounded-xl transition-all ${
                input.trim() ? isNight ? 'bg-radar-gold text-night-base shadow-neon-gold' : 'bg-amber-500 text-white'
                             : isNight ? 'bg-night-card text-night-muted' : 'bg-day-surface text-day-muted'
              }`}>
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col min-h-screen ${bg} transition-colors duration-700`}>
      <div className={`px-4 pt-12 pb-4 ${surface} border-b ${border}`}>
        <h1 className={`text-xl font-bold mb-4 ${textPri}`}>Mis Encuentros</h1>
        <div className={`flex rounded-xl border overflow-hidden ${border}`} style={{ background: isNight ? '#0d1c3f' : '#f0f4ff' }}>
          <button onClick={() => setTab('private')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-all ${
              tab === 'private' ? isNight ? 'bg-radar-gold/15 text-radar-gold' : 'bg-amber-100 text-amber-700' : textSec
            }`}>
            <MessageSquare size={14} />Privados
          </button>
          <button onClick={() => setTab('group')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-all ${
              tab === 'group' ? isNight ? 'bg-radar-gold/15 text-radar-gold' : 'bg-amber-100 text-amber-700' : textSec
            }`}>
            <Users size={14} />Sala Ruta
          </button>
        </div>
      </div>

      {tab === 'private' && (
        <div className="flex-1 divide-y" style={{ borderColor: isNight ? '#1a2d55' : '#e8edf9' }}>
          {MOCK_CONVOS.map((c) => (
            <button key={c.id} onClick={() => setActiveConvo(c)}
              className={`w-full flex items-center gap-3 px-4 py-4 text-left transition-all ${isNight ? 'hover:bg-night-surface' : 'hover:bg-day-surface'}`}>
              <Avatar color={c.avatarColor} initial={c.avatarInitial} size={44} online={c.online} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className={`font-semibold text-sm ${textPri}`}>@{c.username}</span>
                  {c.unread > 0 && (
                    <span className="w-5 h-5 rounded-full bg-radar-gold flex items-center justify-center text-[10px] font-bold text-night-base">{c.unread}</span>
                  )}
                </div>
                <p className={`text-xs mt-0.5 truncate ${textSec}`}>{c.lastMessage}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {tab === 'group' && (
        <div className="flex flex-col flex-1">
          <div className={`px-4 py-3 flex items-center justify-between border-b ${border}`}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-radar-green animate-pulse" />
              <span className={`text-xs font-semibold ${isNight ? 'text-radar-green' : 'text-green-600'}`}>
                Sala activa · Línea 42
              </span>
            </div>
            <div className="flex items-center gap-2">
              <TempBadge temp={temp} loading={tempLoading} />
              <span className={`text-[10px] ${textSec}`}>6 pasajeros</span>
            </div>
          </div>

          {sosBanner && <SOSBanner onDismiss={() => setSosBanner(false)} isNight={isNight} />}
          {sosModal && (
            <SOSModal
              isNight={isNight}
              onCancel={() => setSosModal(false)}
              onSend={(text) => { setSosModal(false); sendMessage(true, text); }}
            />
          )}

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ maxHeight: 'calc(100vh - 340px)' }}>
            {groupMessages.map((m) => (
              <div key={m.id} className={`flex ${m.isSelf ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-2 max-w-[80%] ${m.isSelf ? 'flex-row-reverse' : 'flex-row'}`}>
                  {!m.isSelf && <Avatar color={m.senderColor} initial={m.senderInitial} size={28} />}
                  <div className={`flex flex-col gap-1 ${m.isSelf ? 'items-end' : 'items-start'}`}>
                    {!m.isSelf && <span className={`text-[10px] font-medium ${gold}`}>@{m.senderName}</span>}
                    <div className={`px-3 py-2 rounded-xl text-sm leading-snug ${
                      m.isSos ? 'bg-radar-red/20 text-radar-red border border-radar-red/40 font-semibold'
                      : m.isSelf
                        ? isNight ? 'bg-radar-gold/20 text-white border border-radar-gold/25' : 'bg-amber-100 text-amber-900'
                        : isNight ? `${card} text-white border ${border}` : 'bg-day-surface text-day-text border border-day-border'
                    }`}>
                      {m.isSos && <AlertTriangle size={12} className="inline mr-1.5 mb-0.5" />}
                      {m.content}
                    </div>
                    <span className={`text-[9px] ${textSec}`}>{formatTime(m.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div className={`px-4 py-3 border-t ${surface} ${border} pb-28`}>
            <button onClick={() => setSosModal(true)}
              className="w-full flex items-center justify-center gap-2 py-3 mb-3 rounded-xl font-bold text-sm transition-all active:scale-95"
              style={{ background: 'linear-gradient(135deg,#ff3b5c,#ff6b35)', boxShadow: '0 0 20px 4px rgba(255,59,92,0.4)', color: 'white' }}>
              <AlertTriangle size={16} />
              BOTÓN SOS · EMERGENCIA
            </button>
            <div className="flex items-center gap-2">
              <input value={input} onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Escribe a la sala..."
                className={`flex-1 px-4 py-3 rounded-xl border text-sm outline-none transition-all ${
                  isNight ? 'bg-night-card border-night-border text-white placeholder-slate-500 focus:border-radar-gold/50'
                          : 'bg-day-surface border-day-border text-day-text placeholder-slate-400 focus:border-amber-400'
                }`} />
              <button onClick={() => sendMessage()} disabled={!input.trim() || sending}
                className={`p-3 rounded-xl transition-all ${
                  input.trim() ? isNight ? 'bg-radar-gold text-night-base shadow-neon-gold' : 'bg-amber-500 text-white'
                               : isNight ? 'bg-night-card text-night-muted' : 'bg-day-surface text-day-muted'
                }`}>
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
