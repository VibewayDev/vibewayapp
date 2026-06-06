
import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Logo from '../components/Logo';

type Tab = 'login' | 'register' | 'forgot';

export default function LoginPage() {
  const { signIn, signUp, resetPassword } = useAuth();

  const [tab, setTab]           = useState<Tab>('login');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [success, setSuccess]   = useState<string | null>(null);

  function reset() { setError(null); setSuccess(null); }

  async function handleSubmit() {
    reset();
    setLoading(true);

    if (tab === 'login') {
      const { error } = await signIn(email, password);
      if (error) setError(error);
    } else if (tab === 'register') {
      if (!username.trim()) { setError('El @usuario es obligatorio'); setLoading(false); return; }
      if (username.includes(' ')) { setError('El usuario no puede tener espacios'); setLoading(false); return; }
      const { error } = await signUp(email, password, username.replace('@', ''));
      if (error) setError(error);
    } else {
      const { error } = await resetPassword(email);
      if (error) setError(error);
      else setSuccess('Enlace de recuperación enviado a tu correo 📧');
    }

    setLoading(false);
  }

  const inputCls = `w-full px-4 py-3 rounded-xl border bg-[#0d1c3f] border-[#1a2d55] text-white 
    placeholder-slate-500 text-sm outline-none focus:border-amber-500/60 transition-all`;

  return (
    <div className="min-h-screen bg-[#04091a] flex flex-col items-center justify-center px-5">
      {/* Background circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[200, 350, 500].map((r) => (
          <div key={r} className="absolute rounded-full border border-amber-500/5"
            style={{ width: r * 2, height: r * 2, top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}
          />
        ))}
      </div>

      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Logo size={56} />
          <h1 className="text-2xl font-bold text-white mt-3">vibeway</h1>
          <p className="text-amber-500 text-sm mt-1">Match en tiempo real para viajeros</p>
        </div>

        {/* Tab switcher — solo login y registro */}
        {tab !== 'forgot' && (
          <div className="flex rounded-xl border border-[#1a2d55] overflow-hidden mb-6 bg-[#0d1c3f]">
            <button
              onClick={() => { setTab('login'); reset(); }}
              className={`flex-1 py-2.5 text-sm font-medium transition-all ${
                tab === 'login' ? 'bg-amber-500/15 text-amber-400' : 'text-slate-400'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => { setTab('register'); reset(); }}
              className={`flex-1 py-2.5 text-sm font-medium transition-all ${
                tab === 'register' ? 'bg-amber-500/15 text-amber-400' : 'text-slate-400'
              }`}
            >
              Registrarse
            </button>
          </div>
        )}

        {/* Forgot password title */}
        {tab === 'forgot' && (
          <div className="mb-6">
            <h2 className="text-white font-bold text-lg">Recuperar contraseña</h2>
            <p className="text-slate-400 text-sm mt-1">Te enviaremos un enlace a tu correo</p>
          </div>
        )}

        {/* Form */}
        <div className="space-y-3">
          {/* Username — solo en registro */}
          {tab === 'register' && (
            <div className="relative">
              <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="@usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`${inputCls} pl-10`}
                autoCapitalize="none"
              />
            </div>
          )}

          {/* Email */}
          <div className="relative">
            <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`${inputCls} pl-10`}
              autoCapitalize="none"
            />
          </div>

          {/* Password — no en forgot */}
          {tab !== 'forgot' && (
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="Contraseña (mín. 6 caracteres)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                className={`${inputCls} pl-10 pr-10`}
              />
              <button
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500"
              >
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          )}

          {/* Forgot password link */}
          {tab === 'login' && (
            <div className="text-right">
              <button
                onClick={() => { setTab('forgot'); reset(); }}
                className="text-xs text-amber-500/70 hover:text-amber-400"
              >
                ¿Olvidaste tu clave?
              </button>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20">
              <AlertCircle size={14} className="text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-xs">{error}</p>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <CheckCircle size={14} className="text-emerald-400 flex-shrink-0" />
              <p className="text-emerald-400 text-xs">{success}</p>
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading || !email}
            className="w-full py-3 rounded-xl font-bold text-sm transition-all active:scale-95 disabled:opacity-50"
            style={{
              background: loading ? '#4a3000' : 'linear-gradient(135deg, #f5a623, #e8820c)',
              color: '#000',
              boxShadow: loading ? 'none' : '0 0 20px rgba(245,166,35,0.35)',
            }}
          >
            {loading
              ? 'Procesando...'
              : tab === 'login'
                ? 'Entrar →'
                : tab === 'register'
                  ? 'Crear cuenta'
                  : 'Enviar enlace'}
          </button>

          {/* Back to login */}
          {tab === 'forgot' && (
            <button
              onClick={() => { setTab('login'); reset(); }}
              className="w-full py-2 text-sm text-slate-400 hover:text-white transition-colors"
            >
              ← Volver al inicio de sesión
            </button>
          )}
        </div>

        <p className="text-center text-[11px] text-slate-600 mt-8">
          Sin registro permanente · Sin tracking
        </p>
      </div>
    </div>
  );
}
