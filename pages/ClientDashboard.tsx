import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StorageService } from '../services/storage';
import { User, HotelProfile, Reservation, Notification } from '../types';
import { 
  Home, Calendar, Heart, Bell, MessageSquare, User as UserIcon, LogOut, 
  Search, MapPin, Star, Filter, ArrowRight, Download, Send, Settings, Menu, X 
} from 'lucide-react';

const ClientDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hotels, setHotels] = useState<HotelProfile[]>([]);

  useEffect(() => {
    const currentUser = StorageService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setReservations(StorageService.getReservationsForClient(currentUser.id));
      setNotifications(StorageService.getNotifications(currentUser.id));
      setHotels(StorageService.getAllHotels());
    }
  }, []);

  const handleLogout = () => {
    StorageService.logout();
    navigate('/login');
  };

  const SidebarItem = ({ id, icon: Icon, label, badge }: any) => (
    <button 
      onClick={() => { setActiveSection(id); setMobileMenuOpen(false); }}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
        activeSection === id 
        ? 'bg-gradient-to-r from-amber-500/20 to-amber-600/10 text-amber-400 border-l-4 border-amber-500' 
        : 'text-gray-400 hover:bg-white/5 hover:text-white'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
      {badge > 0 && (
        <span className="ml-auto bg-amber-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </button>
  );

  // --- Views ---

  const HomeView = () => (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome & Banner */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Olá, <span className="text-amber-400">{user?.name}</span></h1>
          <p className="text-gray-400">Pronto para sua próxima aventura em Barreirinhas?</p>
        </div>
        <div className="hidden md:block">
           <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-purple-600 flex items-center justify-center font-bold text-lg text-white shadow-lg">
              {user?.name.charAt(0)}
           </div>
        </div>
      </div>

      {/* Shortcuts */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Reservas Ativas', icon: Calendar, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Histórico', icon: Star, color: 'text-purple-400', bg: 'bg-purple-500/10' },
          { label: 'Mensagens', icon: MessageSquare, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Ofertas', icon: Heart, color: 'text-rose-400', bg: 'bg-rose-500/10' },
        ].map((item, idx) => (
          <div key={idx} className="bg-slate-900/50 border border-white/5 p-4 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer group">
             <div className={`w-10 h-10 rounded-lg ${item.bg} ${item.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <item.icon className="w-5 h-5" />
             </div>
             <p className="font-medium text-gray-200">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Promo Banner */}
      <div className="relative rounded-3xl overflow-hidden h-64 shadow-2xl group">
        <img src="https://picsum.photos/1200/600" alt="Promo" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent p-8 flex flex-col justify-center items-start">
            <span className="bg-amber-500 text-black text-xs font-bold px-3 py-1 rounded-full mb-4">DESTAQUE DA SEMANA</span>
            <h2 className="text-3xl font-bold text-white mb-2 max-w-md">Grand Vênus Resort com 20% OFF</h2>
            <p className="text-gray-300 mb-6 max-w-sm">Aproveite o luxo nas margens do Rio Preguiças com condições especiais para membros.</p>
            <button className="bg-white text-black px-6 py-2 rounded-lg font-bold hover:bg-amber-400 transition-colors">
              Ver Oferta
            </button>
        </div>
      </div>

      {/* Suggested Hotels */}
      <div>
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-white">Recomendados para você</h3>
            <button className="text-sm text-amber-400 hover:underline">Ver todos</button>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-6 custom-scrollbar">
            {hotels.map(hotel => (
                <div key={hotel.id} className="min-w-[280px] bg-slate-900 border border-white/5 rounded-2xl overflow-hidden hover:border-amber-500/30 transition-all group">
                    <div className="h-40 relative">
                        <img src={hotel.images[0]} className="w-full h-full object-cover" alt={hotel.hotelName} />
                        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md p-1.5 rounded-full">
                            <Heart className="w-4 h-4 text-white hover:text-red-500 cursor-pointer transition-colors" />
                        </div>
                    </div>
                    <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                             <h4 className="font-bold text-white truncate pr-2">{hotel.hotelName}</h4>
                             <div className="flex items-center text-amber-400 text-xs font-bold">
                                <Star className="w-3 h-3 mr-1 fill-amber-400" /> 4.8
                             </div>
                        </div>
                        <p className="text-xs text-gray-500 flex items-center mb-3">
                            <MapPin className="w-3 h-3 mr-1" /> {hotel.neighborhood}, {hotel.city}
                        </p>
                        <div className="flex justify-between items-center">
                             <span className="text-lg font-bold text-white">R$ {hotel.pricePerNight} <span className="text-xs text-gray-500 font-normal">/noite</span></span>
                             <button className="p-2 bg-amber-500/10 text-amber-400 rounded-lg hover:bg-amber-500 hover:text-black transition-colors">
                                <ArrowRight className="w-4 h-4" />
                             </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );

  const ReservationsView = () => {
    const [tab, setTab] = useState<'CONFIRMED' | 'PENDING' | 'COMPLETED' | 'CANCELLED'>('CONFIRMED');
    const filtered = reservations.filter(r => r.status === tab);

    return (
      <div className="space-y-6 animate-fadeIn">
        <h2 className="text-2xl font-bold text-white">Minhas Reservas</h2>
        
        {/* Tabs */}
        <div className="flex space-x-2 overflow-x-auto pb-2 border-b border-white/10">
            {[
                { id: 'CONFIRMED', label: 'Ativas' },
                { id: 'PENDING', label: 'Pendentes' },
                { id: 'COMPLETED', label: 'Concluídas' },
                { id: 'CANCELLED', label: 'Canceladas' }
            ].map(t => (
                <button 
                    key={t.id}
                    onClick={() => setTab(t.id as any)}
                    className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${tab === t.id ? 'border-amber-500 text-amber-400' : 'border-transparent text-gray-400 hover:text-white'}`}
                >
                    {t.label}
                </button>
            ))}
        </div>

        {/* List */}
        <div className="space-y-4">
            {filtered.length > 0 ? filtered.map(res => (
                <div key={res.id} className="bg-slate-900/50 border border-white/10 rounded-2xl p-4 md:p-6 flex flex-col md:flex-row gap-6 hover:border-amber-500/30 transition-colors">
                    <img src={res.hotelImage} alt={res.hotelName} className="w-full md:w-48 h-32 object-cover rounded-xl" />
                    <div className="flex-1 flex flex-col justify-between">
                        <div>
                             <div className="flex justify-between items-start">
                                <h3 className="text-xl font-bold text-white">{res.hotelName}</h3>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold 
                                    ${res.status === 'CONFIRMED' ? 'bg-green-500/10 text-green-400' : 
                                      res.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-400' :
                                      res.status === 'CANCELLED' ? 'bg-red-500/10 text-red-400' : 'bg-gray-500/10 text-gray-400'}`}>
                                    {res.status === 'CONFIRMED' ? 'Confirmada' : res.status === 'PENDING' ? 'Aguardando' : res.status === 'CANCELLED' ? 'Cancelada' : 'Finalizada'}
                                </span>
                             </div>
                             <p className="text-gray-400 text-sm mt-1">{res.roomName}</p>
                             <div className="flex items-center gap-4 mt-3 text-sm text-gray-300">
                                 <div className="flex items-center"><Calendar className="w-4 h-4 mr-1 text-amber-500" /> {new Date(res.checkIn).toLocaleDateString()} - {new Date(res.checkOut).toLocaleDateString()}</div>
                             </div>
                        </div>
                        <div className="flex flex-wrap items-end justify-between mt-4">
                            <div>
                                <span className="text-xs text-gray-500">Valor Total</span>
                                <p className="text-xl font-bold text-white">R$ {res.totalPrice}</p>
                            </div>
                            <div className="flex gap-2 mt-2 md:mt-0">
                                <button className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg text-sm text-white font-medium transition-colors">Ver Detalhes</button>
                                {res.status === 'CONFIRMED' && (
                                    <button className="px-4 py-2 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 rounded-lg text-sm text-amber-400 font-medium transition-colors flex items-center">
                                        <Download className="w-4 h-4 mr-2" /> Voucher
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )) : (
                <div className="text-center py-12 text-gray-500 bg-slate-900/30 rounded-2xl border border-white/5">
                    <Calendar className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>Nenhuma reserva encontrada nesta categoria.</p>
                </div>
            )}
        </div>
      </div>
    );
  };

  const NotificationsView = () => (
      <div className="space-y-6 animate-fadeIn">
        <h2 className="text-2xl font-bold text-white">Notificações</h2>
        <div className="space-y-3">
            {notifications.map(notif => (
                <div key={notif.id} className={`p-4 rounded-xl border flex gap-4 ${notif.read ? 'bg-slate-900/30 border-white/5' : 'bg-slate-800/50 border-amber-500/30'}`}>
                    <div className={`w-2 h-2 mt-2 rounded-full shrink-0 ${notif.type === 'success' ? 'bg-green-500' : notif.type === 'info' ? 'bg-blue-500' : 'bg-amber-500'}`} />
                    <div className="flex-1">
                        <div className="flex justify-between">
                            <h4 className={`font-bold ${notif.read ? 'text-gray-300' : 'text-white'}`}>{notif.title}</h4>
                            <span className="text-xs text-gray-500">{new Date(notif.date).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">{notif.message}</p>
                    </div>
                </div>
            ))}
        </div>
      </div>
  );

  const ProfileView = () => (
      <div className="max-w-2xl animate-fadeIn">
          <h2 className="text-2xl font-bold text-white mb-6">Meu Perfil</h2>
          <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-8">
              <div className="flex items-center gap-6 mb-8">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-purple-600 flex items-center justify-center text-3xl font-bold text-white shadow-xl">
                      {user?.name.charAt(0)}
                  </div>
                  <div>
                      <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white hover:bg-white/10 transition-colors">
                          Alterar Foto
                      </button>
                  </div>
              </div>
              <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                          <label className="text-sm text-gray-400">Nome</label>
                          <input type="text" defaultValue={user?.name} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-amber-500 outline-none" />
                      </div>
                      <div className="space-y-2">
                          <label className="text-sm text-gray-400">E-mail</label>
                          <input type="email" defaultValue={user?.email} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-amber-500 outline-none" />
                      </div>
                      <div className="space-y-2">
                          <label className="text-sm text-gray-400">Telefone</label>
                          <input type="text" defaultValue="(98) 99999-9999" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-amber-500 outline-none" />
                      </div>
                      <div className="space-y-2">
                          <label className="text-sm text-gray-400">CPF</label>
                          <input type="text" defaultValue="000.000.000-00" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-amber-500 outline-none" />
                      </div>
                  </div>
                  <div className="pt-6 border-t border-white/10 flex justify-end">
                      <button type="button" className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg shadow-lg shadow-green-900/20 transition-all">
                          Salvar Alterações
                      </button>
                  </div>
              </form>
          </div>
      </div>
  );
  
  const ChatView = () => (
      <div className="h-[600px] bg-slate-900/50 border border-white/10 rounded-2xl flex overflow-hidden animate-fadeIn">
          {/* Sidebar */}
          <div className="w-1/3 border-r border-white/10 bg-black/20">
              <div className="p-4 border-b border-white/10">
                  <h3 className="font-bold text-white">Mensagens</h3>
              </div>
              <div className="overflow-y-auto h-full">
                  {[1, 2].map(i => (
                      <div key={i} className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-white/5 transition-colors ${i === 1 ? 'bg-white/5' : ''}`}>
                          <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden">
                              <img src={`https://picsum.photos/200?random=${i}`} className="w-full h-full object-cover" />
                          </div>
                          <div>
                              <h4 className="text-sm font-bold text-white">Grand Vênus Resort</h4>
                              <p className="text-xs text-gray-400 truncate">Sua reserva foi confirmada!</p>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
          {/* Chat Area */}
          <div className="flex-1 flex flex-col bg-black/40">
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden">
                          <img src="https://picsum.photos/200?random=1" className="w-full h-full object-cover" />
                      </div>
                      <div>
                          <h4 className="font-bold text-white">Grand Vênus Resort</h4>
                          <span className="text-xs text-green-400 flex items-center"><span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1"></span> Online</span>
                      </div>
                  </div>
              </div>
              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                  <div className="flex justify-start">
                      <div className="bg-white/10 text-white p-3 rounded-2xl rounded-tl-none max-w-xs text-sm">
                          Olá! Minha reserva inclui café da manhã?
                      </div>
                  </div>
                  <div className="flex justify-end">
                      <div className="bg-amber-500/20 text-amber-100 border border-amber-500/20 p-3 rounded-2xl rounded-tr-none max-w-xs text-sm">
                          Olá, João! Sim, todas as diárias incluem nosso buffet completo de café da manhã.
                      </div>
                  </div>
              </div>
              <div className="p-4 border-t border-white/10 bg-black/20">
                  <div className="flex gap-2">
                      <input type="text" placeholder="Digite sua mensagem..." className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-amber-500 outline-none" />
                      <button className="p-2 bg-amber-500 text-black rounded-lg hover:bg-amber-400 transition-colors">
                          <Send className="w-5 h-5" />
                      </button>
                  </div>
              </div>
          </div>
      </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-gray-200 flex">
      {/* Mobile Menu Button */}
      <button 
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden fixed top-4 right-4 z-50 p-2 bg-slate-800 rounded-lg text-white shadow-lg"
      >
        {mobileMenuOpen ? <X /> : <Menu />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-40 w-64 bg-black/90 md:bg-black/40 border-r border-white/10 backdrop-blur-xl transform transition-transform duration-300 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6">
            <div className="flex items-center gap-2 mb-8">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.5)]">
                    <span className="font-bold text-white text-lg">V</span>
                </div>
                <span className="font-bold text-xl text-white tracking-tight">Vênus BHS</span>
            </div>
            
            <nav className="space-y-1">
                <SidebarItem id="home" icon={Home} label="Início" />
                <SidebarItem id="reservations" icon={Calendar} label="Minhas Reservas" badge={reservations.filter(r => r.status === 'CONFIRMED').length} />
                <SidebarItem id="favorites" icon={Heart} label="Favoritos" />
                <SidebarItem id="notifications" icon={Bell} label="Notificações" badge={notifications.filter(n => !n.read).length} />
                <SidebarItem id="chat" icon={MessageSquare} label="Chat" />
                <SidebarItem id="profile" icon={UserIcon} label="Meu Perfil" />
            </nav>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full p-6 border-t border-white/10">
            <button onClick={handleLogout} className="flex items-center space-x-3 text-red-400 hover:text-red-300 transition-colors w-full px-4 py-2 rounded-lg hover:bg-red-500/10">
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Sair</span>
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-screen relative">
        {/* Top Gradient */}
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-purple-900/10 to-transparent pointer-events-none" />
        
        <div className="container mx-auto px-4 md:px-8 py-8 md:py-12 relative z-10 max-w-6xl">
            {activeSection === 'home' && <HomeView />}
            {activeSection === 'reservations' && <ReservationsView />}
            {activeSection === 'notifications' && <NotificationsView />}
            {activeSection === 'chat' && <ChatView />}
            {activeSection === 'profile' && <ProfileView />}
            {activeSection === 'favorites' && (
                <div className="text-center py-20 text-gray-500">
                    <Heart className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <h3 className="text-xl font-bold mb-2">Sua lista de desejos está vazia</h3>
                    <p>Explore hotéis e salve seus favoritos aqui.</p>
                </div>
            )}
        </div>
      </main>
    </div>
  );
};

export default ClientDashboard;