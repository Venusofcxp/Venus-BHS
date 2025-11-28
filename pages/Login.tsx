import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StorageService } from '../services/storage';
import { UserRole } from '../types';
import { Loader2, Mail, Lock } from 'lucide-react';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password.length < 3) {
        setError('A senha deve ter pelo menos 3 caracteres.');
        setLoading(false);
        return;
    }

    // Simulate network delay
    setTimeout(() => {
      const user = StorageService.login(email, password);
      if (user) {
        if (user.role === UserRole.CLIENT) {
          navigate('/dashboard-client');
        } else {
          navigate('/dashboard-hotel');
        }
      } else {
        setError('E-mail ou senha incorretos.');
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] animate-fadeIn">
      <div className="w-full max-w-md p-8 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
        <h2 className="text-3xl font-bold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">
          Bem-vindo de volta
        </h2>
        <p className="text-center text-gray-400 mb-8">Acesse sua conta Vênus BHS</p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative group">
            <label className="block text-sm font-medium text-gray-300 mb-2">E-mail</label>
            <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-amber-500 transition-colors" />
                <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white placeholder-gray-600 transition-all outline-none"
                placeholder="seu@email.com"
                />
            </div>
          </div>

          <div className="relative group">
            <label className="block text-sm font-medium text-gray-300 mb-2">Senha</label>
            <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-amber-500 transition-colors" />
                <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white placeholder-gray-600 transition-all outline-none"
                placeholder="••••••••"
                />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg text-center animate-pulse">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold rounded-lg shadow-lg shadow-amber-900/20 transition-all transform hover:scale-[1.02] flex justify-center items-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Entrar'}
          </button>
        </form>

        <div className="mt-8 text-center space-y-4">
          <button 
            onClick={() => navigate('/forgot-password')} 
            className="block w-full text-sm text-gray-400 hover:text-amber-400 transition-colors outline-none focus:text-amber-400"
          >
            Esqueci minha senha
          </button>
          <p className="text-gray-500 text-sm">
            Não tem uma conta?{' '}
            <button onClick={() => navigate('/register')} className="text-amber-400 hover:text-amber-300 font-medium ml-1">
              Criar conta
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;