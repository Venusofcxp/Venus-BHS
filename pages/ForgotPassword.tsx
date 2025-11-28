import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Mail, ArrowLeft, CheckCircle } from 'lucide-react';

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 2000);
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] animate-fadeIn">
      <div className="w-full max-w-md p-8 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
        
        {!success && (
          <button 
            onClick={() => navigate('/login')}
            className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors text-sm group"
          >
            <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" /> Voltar para Login
          </button>
        )}

        <h2 className="text-3xl font-bold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">
          Recuperar Senha
        </h2>
        
        {!success ? (
          <>
            <p className="text-center text-gray-400 mb-8">
              Digite seu e-mail cadastrado e enviaremos as instruções para redefinir sua senha.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
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

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold rounded-lg shadow-lg shadow-amber-900/20 transition-all transform hover:scale-[1.02] flex justify-center items-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : 'Enviar Link de Recuperação'}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center space-y-6 animate-slideUp py-4">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto border border-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.2)]">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <div>
                <h3 className="text-xl font-bold text-white mb-2">E-mail Enviado!</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                Enviamos um link de recuperação para <br/>
                <span className="text-amber-400 font-medium">{email}</span>.
                <br/>Verifique sua caixa de entrada e spam.
                </p>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg transition-colors border border-white/5"
            >
              Voltar ao Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;