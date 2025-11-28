import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StorageService } from '../services/storage';
import { HotelProfile, Room, Reservation } from '../types';
import { 
  LayoutDashboard, BedDouble, Calendar as CalendarIcon, MessageSquare, 
  BarChart3, Wallet, Settings, LogOut, Plus, Edit2, Trash2, X, 
  CheckCircle, XCircle, Search, MapPin, Globe, Menu
} from 'lucide-react';

const HotelDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [hotel, setHotel] = useState<HotelProfile | null>(null);
  const [activeSection, setActiveSection] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  
  // State for Modals
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);

  useEffect(() => {
    const user = StorageService.getCurrentUser() as HotelProfile;
    if (user) {
      setHotel(user);
      setRooms(StorageService.getRooms(user.id));
      setReservations(StorageService.getReservationsForHotel(user.id));
    }
  }, []);

  const handleLogout = () => {
    StorageService.logout();
    navigate('/login');
  };

  const SidebarItem = ({ id, icon: Icon, label }: any) => (
    <button 
      onClick={() => { setActiveSection(id); setMobileMenuOpen(false); }}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all mb-1 ${
        activeSection === id 
        ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20' 
        : 'text-gray-400 hover:bg-white/5 hover:text-white'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium text-sm">{label}</span>
    </button>
  );

  // --- Views ---

  const OverviewView = () => {
    // Mock Chart Data Bars
    const chartData = [40, 65, 50, 80, 60, 90, 75];

    return (
      <div className="space-y-8 animate-fadeIn">
        <h2 className="text-2xl font-bold text-white">Visão Geral</h2>
        
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
                { label: 'Ocupação Atual', value: '78%', sub: '+5% vs mês passado', icon: BarChart3, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                { label: 'Reservas do Mês', value: '142', sub: '12 pendentes', icon: CalendarIcon, color: 'text-purple-400', bg: 'bg-purple-500/10' },
                { label: 'Faturamento', value: 'R$ 42.5k', sub: 'Previsto: R$ 50k', icon: Wallet, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                { label: 'Quartos Livres', value: '8', sub: 'De 50 totais', icon: BedDouble, color: 'text-amber-400', bg: 'bg-amber-500/10' }
            ].map((kpi, idx) => (
                <div key={idx} className="bg-slate-900 border border-white/5 p-6 rounded-xl">
                    <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-lg ${kpi.bg} ${kpi.color}`}>
                            <kpi.icon className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-medium text-green-400 bg-green-500/10 px-2 py-1 rounded-full">
                            {kpi.sub.includes('+') ? '↑' : ''} {kpi.sub}
                        </span>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-1">{kpi.value}</h3>
                    <p className="text-gray-400 text-sm">{kpi.label}</p>
                </div>
            ))}
        </div>

        {/* Charts & Recent */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart */}
            <div className="lg:col-span-2 bg-slate-900 border border-white/5 rounded-xl p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-white">Ocupação Semanal</h3>
                    <select className="bg-black/30 border border-white/10 text-xs text-white rounded p-1 outline-none">
                        <option>Últimos 7 dias</option>
                    </select>
                </div>
                <div className="h-64 flex items-end justify-between gap-2 px-2">
                    {chartData.map((h, i) => (
                        <div key={i} className="w-full bg-slate-800 rounded-t-lg relative group hover:bg-purple-600 transition-colors" style={{height: `${h}%`}}>
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                {h}%
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500 px-2">
                    <span>Seg</span><span>Ter</span><span>Qua</span><span>Qui</span><span>Sex</span><span>Sáb</span><span>Dom</span>
                </div>
            </div>

            {/* Recent Bookings */}
            <div className="bg-slate-900 border border-white/5 rounded-xl p-6">
                <h3 className="font-bold text-white mb-4">Últimas Reservas</h3>
                <div className="space-y-4">
                    {reservations.slice(0, 4).map(res => (
                        <div key={res.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center font-bold text-xs">
                                {res.clientName.charAt(0)}
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-bold text-white">{res.clientName}</h4>
                                <p className="text-xs text-gray-400">{res.roomName}</p>
                            </div>
                            <div className="text-right">
                                <span className="block text-xs font-bold text-white">R$ {res.totalPrice}</span>
                                <span className={`text-[10px] ${res.status === 'CONFIRMED' ? 'text-green-400' : 'text-yellow-400'}`}>
                                    {res.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
                <button 
                  onClick={() => setActiveSection('reservations')}
                  className="w-full mt-4 py-2 text-sm text-purple-400 border border-purple-500/20 rounded-lg hover:bg-purple-500/10 transition-colors"
                >
                    Ver Todas
                </button>
            </div>
        </div>
      </div>
    );
  };

  const RoomsView = () => (
      <div className="space-y-6 animate-fadeIn">
          <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Gerenciar Quartos</h2>
              <button onClick={() => setIsRoomModalOpen(true)} className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors shadow-lg">
                  <Plus className="w-4 h-4 mr-2" /> Novo Quarto
              </button>
          </div>

          <div className="bg-slate-900 border border-white/5 rounded-xl overflow-hidden">
              <table className="w-full text-left">
                  <thead className="bg-black/20 text-xs uppercase text-gray-400 font-semibold">
                      <tr>
                          <th className="p-4">Quarto</th>
                          <th className="p-4">Capacidade</th>
                          <th className="p-4">Preço / Noite</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Ações</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                      {rooms.map(room => (
                          <tr key={room.id} className="hover:bg-white/5 transition-colors">
                              <td className="p-4">
                                  <div className="flex items-center gap-3">
                                      <img src={room.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover" />
                                      <div>
                                          <p className="font-bold text-white">{room.name}</p>
                                          <p className="text-xs text-gray-500 truncate max-w-[150px]">{room.description}</p>
                                      </div>
                                  </div>
                              </td>
                              <td className="p-4 text-gray-300">{room.capacity} Pessoas</td>
                              <td className="p-4 font-bold text-white">R$ {room.price}</td>
                              <td className="p-4">
                                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${room.isAvailable ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                      {room.isAvailable ? 'Disponível' : 'Ocupado'}
                                  </span>
                              </td>
                              <td className="p-4 text-right">
                                  <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                                  <button className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors ml-2"><Trash2 className="w-4 h-4" /></button>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
              {rooms.length === 0 && <div className="p-8 text-center text-gray-500">Nenhum quarto cadastrado.</div>}
          </div>
      </div>
  );

  const ReservationsView = () => (
      <div className="space-y-6 animate-fadeIn">
          <h2 className="text-2xl font-bold text-white">Gestão de Reservas</h2>
          
          <div className="flex gap-2 mb-4">
               <div className="relative flex-1">
                   <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                   <input type="text" placeholder="Buscar por hóspede ou quarto..." className="w-full bg-slate-900 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white text-sm outline-none focus:border-purple-500" />
               </div>
               <button className="px-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-gray-300 hover:text-white text-sm flex items-center gap-2">
                   <CalendarIcon className="w-4 h-4" /> Filtros
               </button>
          </div>

          <div className="space-y-4">
              {reservations.map(res => (
                  <div key={res.id} className="bg-slate-900 border border-white/5 p-4 rounded-xl flex flex-col md:flex-row items-center gap-4 hover:border-purple-500/30 transition-colors">
                      <div className="flex-1 w-full flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                              {res.clientName.charAt(0)}
                          </div>
                          <div>
                              <h3 className="font-bold text-white">{res.clientName}</h3>
                              <p className="text-sm text-gray-400">{res.roomName} • <span className="text-gray-500">{new Date(res.checkIn).toLocaleDateString()} - {new Date(res.checkOut).toLocaleDateString()}</span></p>
                          </div>
                      </div>
                      
                      <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                           <div className="text-right">
                               <p className="text-xs text-gray-500">Valor Total</p>
                               <p className="font-bold text-white">R$ {res.totalPrice}</p>
                           </div>
                           <span className={`px-3 py-1 rounded-full text-xs font-bold 
                                ${res.status === 'CONFIRMED' ? 'bg-green-500/10 text-green-400' : 
                                  res.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-400' : 
                                  'bg-red-500/10 text-red-400'}`}>
                                {res.status}
                           </span>
                           {res.status === 'PENDING' && (
                               <div className="flex gap-2">
                                   <button onClick={() => {
                                       StorageService.updateReservationStatus(res.id, 'CONFIRMED');
                                       setReservations(StorageService.getReservationsForHotel(hotel!.id));
                                   }} className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500 hover:text-black transition-all">
                                       <CheckCircle className="w-5 h-5" />
                                   </button>
                                   <button onClick={() => {
                                       StorageService.updateReservationStatus(res.id, 'CANCELLED');
                                       setReservations(StorageService.getReservationsForHotel(hotel!.id));
                                   }} className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500 hover:text-black transition-all">
                                       <XCircle className="w-5 h-5" />
                                   </button>
                               </div>
                           )}
                      </div>
                  </div>
              ))}
          </div>
      </div>
  );

  const SettingsView = () => (
      <div className="max-w-3xl animate-fadeIn">
          <h2 className="text-2xl font-bold text-white mb-6">Configurações do Hotel</h2>
          <div className="bg-slate-900 border border-white/5 rounded-xl p-6 md:p-8 space-y-6">
              
              <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-32 h-32 rounded-xl bg-slate-800 border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:border-purple-500 hover:text-purple-500 transition-all shrink-0">
                      <div className="mb-2"><MapPin className="w-8 h-8" /></div>
                      <span className="text-xs">Alterar Logo</span>
                  </div>
                  <div className="flex-1 space-y-4 w-full">
                      <div>
                          <label className="text-xs text-gray-500 block mb-1">Nome do Estabelecimento</label>
                          <input type="text" defaultValue={hotel?.hotelName} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-purple-500" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="text-xs text-gray-500 block mb-1">CNPJ</label>
                              <input type="text" defaultValue={hotel?.hotelCnpj} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-purple-500" />
                          </div>
                          <div>
                              <label className="text-xs text-gray-500 block mb-1">Telefone</label>
                              <input type="text" defaultValue={hotel?.whatsapp} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-purple-500" />
                          </div>
                      </div>
                  </div>
              </div>

              <div className="border-t border-white/5 pt-6 space-y-4">
                  <h3 className="font-bold text-white">Endereço & Localização</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <input type="text" defaultValue={hotel?.address} placeholder="Endereço" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-purple-500" />
                       <input type="text" defaultValue={hotel?.neighborhood} placeholder="Bairro" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-purple-500" />
                       <div className="md:col-span-2 relative">
                           <Globe className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                           <input type="text" defaultValue={hotel?.googleMapsUrl} placeholder="Link Google Maps" className="w-full pl-10 bg-black/40 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-purple-500" />
                       </div>
                  </div>
              </div>

              <div className="border-t border-white/5 pt-6">
                  <div className="flex justify-end">
                      <button className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg shadow-lg shadow-purple-900/20 transition-all">
                          Salvar Alterações
                      </button>
                  </div>
              </div>
          </div>
      </div>
  );

  return (
    <div className="min-h-screen bg-[#02040a] text-gray-200 flex font-sans">
      {/* Mobile Menu Button */}
      <button 
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden fixed top-4 right-4 z-50 p-2 bg-slate-800 rounded-lg text-white shadow-lg"
      >
        {mobileMenuOpen ? <X /> : <Menu />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-40 w-64 bg-[#0a0c14] border-r border-white/5 transform transition-transform duration-300 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
         <div className="h-full flex flex-col">
             <div className="p-6 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl">
                        {hotel?.hotelName.charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                        <h1 className="font-bold text-white truncate">{hotel?.hotelName}</h1>
                        <span className="text-xs text-purple-400">Painel do Parceiro</span>
                    </div>
                </div>
             </div>
             
             <nav className="flex-1 p-4 overflow-y-auto custom-scrollbar">
                 <p className="text-xs font-bold text-gray-600 uppercase mb-3 px-2 mt-2">Gestão</p>
                 <SidebarItem id="overview" icon={LayoutDashboard} label="Visão Geral" />
                 <SidebarItem id="rooms" icon={BedDouble} label="Quartos" />
                 <SidebarItem id="reservations" icon={CalendarIcon} label="Reservas" />
                 <SidebarItem id="messages" icon={MessageSquare} label="Mensagens" />
                 
                 <p className="text-xs font-bold text-gray-600 uppercase mb-3 px-2 mt-6">Financeiro</p>
                 <SidebarItem id="financial" icon={Wallet} label="Faturamento" />
                 <SidebarItem id="reports" icon={BarChart3} label="Relatórios" />

                 <p className="text-xs font-bold text-gray-600 uppercase mb-3 px-2 mt-6">Configuração</p>
                 <SidebarItem id="settings" icon={Settings} label="Hotel" />
             </nav>

             <div className="p-4 border-t border-white/5">
                 <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors">
                     <LogOut className="w-5 h-5 mr-3" /> Sair
                 </button>
             </div>
         </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto bg-black/20">
          <header className="sticky top-0 z-30 bg-[#02040a]/80 backdrop-blur-md border-b border-white/5 px-8 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white capitalize">{activeSection === 'overview' ? 'Visão Geral' : activeSection}</h2>
              <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">
                     {hotel?.name.charAt(0)}
                  </div>
              </div>
          </header>

          <div className="p-4 md:p-8 max-w-7xl mx-auto">
              {activeSection === 'overview' && <OverviewView />}
              {activeSection === 'rooms' && <RoomsView />}
              {activeSection === 'reservations' && <ReservationsView />}
              {activeSection === 'settings' && <SettingsView />}
              {/* Fallbacks for unfinished sections */}
              {(['messages', 'financial', 'reports'].includes(activeSection)) && (
                  <div className="flex flex-col items-center justify-center h-96 text-gray-500">
                      <Settings className="w-16 h-16 mb-4 opacity-20 animate-spin-slow" />
                      <h3 className="text-xl font-bold">Em Desenvolvimento</h3>
                      <p>Esta funcionalidade estará disponível em breve.</p>
                  </div>
              )}
          </div>
      </main>

      {/* Modals */}
      {isRoomModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
              <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-slideUp">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-white">Adicionar Novo Quarto</h3>
                      <button onClick={() => setIsRoomModalOpen(false)} className="text-gray-400 hover:text-white"><X /></button>
                  </div>
                  <form className="space-y-4" onSubmit={(e) => {
                      e.preventDefault();
                      // Logic to save would go here using StorageService.saveRoom
                      setIsRoomModalOpen(false);
                  }}>
                      <input type="text" placeholder="Nome do Quarto" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-purple-500" required />
                      <div className="grid grid-cols-2 gap-4">
                          <input type="number" placeholder="Capacidade" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-purple-500" required />
                          <input type="number" placeholder="Preço (R$)" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-purple-500" required />
                      </div>
                      <textarea placeholder="Descrição" rows={3} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-purple-500"></textarea>
                      <button type="submit" className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg transition-colors">Salvar Quarto</button>
                  </form>
              </div>
          </div>
      )}

    </div>
  );
};

export default HotelDashboard;