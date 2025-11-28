import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Star, ShieldCheck, ArrowRight, Search, BedDouble, CheckCircle } from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-24 pb-12">
      {/* Hero Section */}
      <section className="text-center pt-12 md:pt-24 space-y-8 animate-slideUp">
        <div className="inline-block px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-sm font-medium mb-4 animate-pulse">
          O Futuro da Hotelaria Chegou
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
          <span className="block text-white mb-2">Descubra Barreirinhas</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-500 to-purple-500 drop-shadow-2xl">
             Com Inteligência
          </span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
          A Plataforma Inteligente da Hotelaria em Barreirinhas. Conecte-se aos melhores hotéis, pousadas e resorts com a tecnologia Vênus BHS.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <button 
            onClick={() => navigate('/register')}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:shadow-[0_0_30px_rgba(245,158,11,0.6)] transition-all transform hover:-translate-y-1 hover:scale-105 flex items-center justify-center"
          >
            Começar Agora <ArrowRight className="ml-2 w-5 h-5" />
          </button>
          <button 
            onClick={() => navigate('/login')}
            className="w-full sm:w-auto px-8 py-4 border border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl backdrop-blur-sm transition-all hover:border-white/40"
          >
            Já tenho conta
          </button>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="grid md:grid-cols-3 gap-8">
        {[
          {
            icon: <MapPin className="w-8 h-8 text-amber-400" />,
            title: "Localização Premium",
            desc: "Encontre os melhores estadias no coração de Barreirinhas e Lençóis Maranhenses."
          },
          {
            icon: <Star className="w-8 h-8 text-purple-400" />,
            title: "Curadoria Vênus",
            desc: "Hotéis selecionados e avaliados com o padrão de qualidade Vênus BHS."
          },
          {
            icon: <ShieldCheck className="w-8 h-8 text-emerald-400" />,
            title: "Reserva Segura",
            desc: "Tecnologia de ponta para garantir sua segurança e tranquilidade."
          }
        ].map((feature, idx) => (
          <div key={idx} className="p-8 rounded-2xl bg-gradient-to-b from-white/10 to-transparent border border-white/5 hover:border-amber-500/30 hover:bg-white/5 transition-all duration-300 group shadow-lg hover:shadow-amber-500/10">
            <div className="mb-4 p-3 rounded-lg bg-black/50 w-fit group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-300 transition-colors">{feature.title}</h3>
            <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </section>

      {/* How It Works */}
      <section className="py-12 border-y border-white/5 bg-black/20">
         <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Como Funciona</h2>
            <p className="text-gray-400">Reserve sua estadia perfeita em 3 passos simples</p>
         </div>
         <div className="grid md:grid-cols-3 gap-8 text-center px-4">
             <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-500/40 text-amber-400">
                    <Search className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">1. Encontre</h3>
                <p className="text-gray-400 text-sm max-w-xs">Pesquise por localização, preço e comodidades ideais para você.</p>
             </div>
             <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/40 text-purple-400">
                    <BedDouble className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">2. Escolha</h3>
                <p className="text-gray-400 text-sm max-w-xs">Veja fotos, detalhes e avaliações para tomar a melhor decisão.</p>
             </div>
             <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/40 text-emerald-400">
                    <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">3. Aproveite</h3>
                <p className="text-gray-400 text-sm max-w-xs">Garanta sua reserva com segurança e aproveite a viagem.</p>
             </div>
         </div>
      </section>

      {/* CTA Section */}
      <section className="relative rounded-3xl overflow-hidden p-12 text-center border border-amber-500/20 shadow-[0_0_50px_rgba(245,158,11,0.1)]">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/40 to-amber-900/40 z-0" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 z-0 mix-blend-overlay"></div>
        <div className="relative z-10 space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Pronto para a experiência Vênus?</h2>
          <p className="text-gray-300 max-w-xl mx-auto">
            Junte-se a milhares de viajantes e hoteleiros que estão transformando o turismo na região.
          </p>
          <button 
             onClick={() => navigate('/register')}
             className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-amber-100 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]"
          >
            Criar Conta Gratuita
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;