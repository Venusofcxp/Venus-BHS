import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Home, User } from 'lucide-react';
import { StorageService } from '../services/storage';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = StorageService.getCurrentUser();

  const handleLogout = () => {
    StorageService.logout();
    navigate('/login');
  };

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isHome = location.pathname === '/';
  
  // Dashboard routes handle their own navigation layout
  const isDashboard = location.pathname.startsWith('/dashboard');

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-950 text-white selection:bg-amber-500 selection:text-black">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] right-[20%] w-[300px] h-[300px] bg-amber-500/5 rounded-full blur-[80px]" />
      </div>

      {/* Navigation - Hidden on Dashboards */}
      {!isDashboard && (
        <nav className="sticky top-0 z-50 border-b border-white/10 backdrop-blur-md bg-black/40 shadow-lg shadow-black/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center cursor-pointer group" onClick={() => navigate('/')}>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-purple-600 mr-2 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.5)] group-hover:scale-110 transition-transform duration-300">
                  <span className="font-bold text-white text-lg">V</span>
                </div>
                <span className="font-bold text-2xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-amber-200 group-hover:text-amber-300 transition-colors">
                  Vênus BHS
                </span>
              </div>

              <div className="flex items-center space-x-4">
                {user ? (
                  <>
                    <div className="hidden md:flex items-center text-sm text-gray-300 mr-4 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                      <User className="w-4 h-4 mr-2 text-amber-500" />
                      Olá, {user.name}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 transition-colors hover:bg-red-500/10 rounded-lg"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sair
                    </button>
                  </>
                ) : (
                  !isAuthPage && (
                    <>
                      <button
                        onClick={() => navigate('/login')}
                        className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
                      >
                        Entrar
                      </button>
                      <button
                        onClick={() => navigate('/register')}
                        className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold py-2 px-4 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:shadow-[0_0_20px_rgba(245,158,11,0.5)] transition-all transform hover:scale-105"
                      >
                        Criar Conta
                      </button>
                    </>
                  )
                )}
              </div>
            </div>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className={`relative z-10 ${!isDashboard ? 'container mx-auto px-4 py-8' : ''} animate-fadeIn`}>
        {children}
      </main>

      {/* Footer (Only on Home) */}
      {isHome && (
        <footer className="relative z-10 border-t border-white/10 bg-black/40 py-8 mt-12">
          <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
            <p>&copy; 2024 Vênus BHS. A Plataforma Inteligente da Hotelaria em Barreirinhas.</p>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Layout;