import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StorageService } from '../services/storage';
import { UserRole, ClientProfile, HotelProfile } from '../types';
import { User, Building2, Upload, Loader2, Mail, Phone, FileText, MapPin, Clock, Lock } from 'lucide-react';

// COMPONENT MOVED OUTSIDE TO PREVENT RE-RENDERING/FOCUS LOSS
interface InputFieldProps {
  label?: string;
  name: string;
  type?: string;
  placeholder?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  icon?: any;
  error?: string;
}

const InputField = ({ label, name, type = "text", placeholder, value, onChange, onBlur, icon: Icon, error }: InputFieldProps) => (
  <div className="space-y-1 w-full">
      {label && <label className="text-xs text-gray-400 ml-1">{label}</label>}
      <div className="relative group">
          {Icon && <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-white transition-colors" />}
          <input 
              name={name}
              type={type}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              placeholder={placeholder}
              className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3 bg-white/5 border rounded-lg outline-none transition-all placeholder-gray-600 text-white
                  ${error ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-amber-500'}
                  focus:bg-white/10`}
          />
      </div>
      {error && <p className="text-xs text-red-400 ml-1 animate-pulse">{error}</p>}
  </div>
);

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'client' | 'hotel'>('client');
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  
  // Touched state for validation visualization
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Client State
  const [clientData, setClientData] = useState({
    name: '', surname: '', email: '', whatsapp: '', cpf: '', password: '', confirmPassword: '', terms: false
  });

  // Hotel State
  const [hotelData, setHotelData] = useState({
    name: '', email: '', whatsapp: '', cpfOrCnpj: '', password: '', confirmPassword: '',
    hotelName: '', address: '', neighborhood: '', city: 'Barreirinhas', zipCode: '',
    hotelCnpj: '', roomsCount: 0, category: 'Hotel', amenities: [] as string[],
    googleMapsUrl: '', checkInTime: '', checkOutTime: '', cancellationPolicy: ''
  });

  const handleClientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setClientData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleHotelChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setHotelData(prev => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTouched(prev => ({ ...prev, [e.target.name]: true }));
  };

  const handleAmenityChange = (amenity: string) => {
    setHotelData(prev => {
      const amenities = prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity];
      return { ...prev, amenities };
    });
  };

  // Simple Validation Logic
  const getError = (name: string, value: string, activeForm: 'client' | 'hotel') => {
    if (!touched[name]) return '';
    if (!value && name !== 'googleMapsUrl') return 'Campo obrigatório';
    
    if (name === 'email' && !/\S+@\S+\.\S+/.test(value)) return 'E-mail inválido';
    if (name === 'password' && value.length < 6) return 'Mínimo 6 caracteres';
    if (name === 'confirmPassword') {
        const password = activeForm === 'client' ? clientData.password : hotelData.password;
        if (value !== password) return 'Senhas não conferem';
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError('');
    setLoading(true);

    // Final Validation Check
    const isClient = activeTab === 'client';
    const data = isClient ? clientData : hotelData;
    
    if (data.password !== data.confirmPassword) {
        setGeneralError("As senhas não coincidem.");
        setLoading(false);
        return;
    }

    setTimeout(() => {
      let success = false;

      if (isClient) {
        if (!clientData.terms) {
            setGeneralError("Você precisa aceitar os termos.");
            setLoading(false);
            return;
        }

        const newClient: ClientProfile = {
          id: Date.now().toString(),
          role: UserRole.CLIENT,
          name: clientData.name,
          email: clientData.email,
          password: clientData.password,
          surname: clientData.surname,
          whatsapp: clientData.whatsapp,
          cpf: clientData.cpf
        };
        success = StorageService.registerUser(newClient);
      } else {
        const newHotel: HotelProfile = {
            id: Date.now().toString(),
            role: UserRole.HOTEL,
            name: hotelData.name,
            email: hotelData.email,
            password: hotelData.password,
            whatsapp: hotelData.whatsapp,
            cpfOrCnpj: hotelData.cpfOrCnpj,
            hotelName: hotelData.hotelName,
            address: hotelData.address,
            neighborhood: hotelData.neighborhood,
            city: hotelData.city,
            zipCode: hotelData.zipCode,
            hotelCnpj: hotelData.hotelCnpj,
            roomsCount: Number(hotelData.roomsCount),
            category: hotelData.category,
            amenities: hotelData.amenities,
            images: ['https://picsum.photos/800/600'], // Placeholder
            pricePerNight: 0, // Default,
            googleMapsUrl: hotelData.googleMapsUrl,
            checkInTime: hotelData.checkInTime,
            checkOutTime: hotelData.checkOutTime,
            cancellationPolicy: hotelData.cancellationPolicy
        };
        success = StorageService.registerUser(newHotel);
      }

      setLoading(false);
      if (success) {
        navigate('/login');
      } else {
        setGeneralError('E-mail já cadastrado.');
      }
    }, 1500);
  };

  return (
    <div className="flex justify-center items-start min-h-screen py-8 animate-fadeIn">
      <div className="w-full max-w-2xl p-6 md:p-10 rounded-3xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        
        <h2 className="text-3xl font-bold text-center mb-8 text-white">Criar Conta</h2>

        {/* Tabs */}
        <div className="flex p-1 bg-white/5 rounded-xl mb-8 border border-white/10">
          <button
            onClick={() => setActiveTab('client')}
            className={`flex-1 flex items-center justify-center py-3 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'client' 
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-lg' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <User className="w-4 h-4 mr-2" /> Cliente
          </button>
          <button
            onClick={() => setActiveTab('hotel')}
            className={`flex-1 flex items-center justify-center py-3 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'hotel' 
                ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Building2 className="w-4 h-4 mr-2" /> Hotel / Pousada
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {activeTab === 'client' ? (
            <div className="space-y-4 animate-fadeIn">
              <div className="grid grid-cols-2 gap-4">
                <InputField name="name" value={clientData.name} onChange={handleClientChange} onBlur={handleBlur} placeholder="Nome" error={getError('name', clientData.name, 'client')} />
                <InputField name="surname" value={clientData.surname} onChange={handleClientChange} onBlur={handleBlur} placeholder="Sobrenome" error={getError('surname', clientData.surname, 'client')} />
              </div>
              <InputField name="email" type="email" icon={Mail} value={clientData.email} onChange={handleClientChange} onBlur={handleBlur} placeholder="E-mail" error={getError('email', clientData.email, 'client')} />
              <div className="grid grid-cols-2 gap-4">
                <InputField name="whatsapp" icon={Phone} value={clientData.whatsapp} onChange={handleClientChange} onBlur={handleBlur} placeholder="WhatsApp (com DDD)" error={getError('whatsapp', clientData.whatsapp, 'client')} />
                <InputField name="cpf" icon={FileText} value={clientData.cpf} onChange={handleClientChange} onBlur={handleBlur} placeholder="CPF" error={getError('cpf', clientData.cpf, 'client')} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InputField name="password" type="password" icon={Lock} value={clientData.password} onChange={handleClientChange} onBlur={handleBlur} placeholder="Senha" error={getError('password', clientData.password, 'client')} />
                <InputField name="confirmPassword" type="password" icon={Lock} value={clientData.confirmPassword} onChange={handleClientChange} onBlur={handleBlur} placeholder="Confirmar Senha" error={getError('confirmPassword', clientData.confirmPassword, 'client')} />
              </div>
              <div className="flex items-center space-x-2 pt-2 bg-white/5 p-3 rounded-lg border border-white/5">
                <input required name="terms" type="checkbox" onChange={handleClientChange} id="terms" className="w-4 h-4 rounded border-gray-600 text-amber-500 focus:ring-amber-500 bg-transparent" />
                <label htmlFor="terms" className="text-sm text-gray-400">Aceito os <a href="#" className="text-amber-500 underline">Termos de Uso</a> e Política de Privacidade</label>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-fadeIn">
              {/* Hotel Owner Info */}
              <div className="space-y-4">
                <h3 className="text-amber-400 font-semibold text-sm uppercase tracking-wider flex items-center gap-2"><User className="w-4 h-4" /> Dados do Responsável</h3>
                <InputField name="name" value={hotelData.name} onChange={handleHotelChange} onBlur={handleBlur} placeholder="Nome Completo" error={getError('name', hotelData.name, 'hotel')} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField name="email" type="email" icon={Mail} value={hotelData.email} onChange={handleHotelChange} onBlur={handleBlur} placeholder="E-mail" error={getError('email', hotelData.email, 'hotel')} />
                    <InputField name="whatsapp" icon={Phone} value={hotelData.whatsapp} onChange={handleHotelChange} onBlur={handleBlur} placeholder="WhatsApp" error={getError('whatsapp', hotelData.whatsapp, 'hotel')} />
                </div>
                <InputField name="cpfOrCnpj" icon={FileText} value={hotelData.cpfOrCnpj} onChange={handleHotelChange} onBlur={handleBlur} placeholder="CPF do Responsável" error={getError('cpfOrCnpj', hotelData.cpfOrCnpj, 'hotel')} />
                <div className="grid grid-cols-2 gap-4">
                  <InputField name="password" type="password" icon={Lock} value={hotelData.password} onChange={handleHotelChange} onBlur={handleBlur} placeholder="Senha" error={getError('password', hotelData.password, 'hotel')} />
                  <InputField name="confirmPassword" type="password" icon={Lock} value={hotelData.confirmPassword} onChange={handleHotelChange} onBlur={handleBlur} placeholder="Confirmar Senha" error={getError('confirmPassword', hotelData.confirmPassword, 'hotel')} />
                </div>
              </div>

              {/* Hotel Info */}
              <div className="space-y-4 border-t border-white/10 pt-6">
                <h3 className="text-purple-400 font-semibold text-sm uppercase tracking-wider flex items-center gap-2"><Building2 className="w-4 h-4" /> Dados do Estabelecimento</h3>
                
                <InputField name="hotelName" value={hotelData.hotelName} onChange={handleHotelChange} onBlur={handleBlur} placeholder="Nome do Hotel/Pousada" error={getError('hotelName', hotelData.hotelName, 'hotel')} />
                
                <div className="grid grid-cols-2 gap-4">
                     <InputField name="hotelCnpj" icon={FileText} value={hotelData.hotelCnpj} onChange={handleHotelChange} onBlur={handleBlur} placeholder="CNPJ do Hotel" />
                     <div className="space-y-1">
                        <select name="category" value={hotelData.category} onChange={handleHotelChange} className="w-full pl-4 pr-8 py-3 bg-white/5 border border-white/10 rounded-lg outline-none text-white focus:border-purple-500 appearance-none">
                            <option value="Hotel" className="bg-slate-900">Hotel</option>
                            <option value="Pousada" className="bg-slate-900">Pousada</option>
                            <option value="Resort" className="bg-slate-900">Resort</option>
                            <option value="Hostel" className="bg-slate-900">Hostel</option>
                        </select>
                     </div>
                </div>

                <InputField name="address" icon={MapPin} value={hotelData.address} onChange={handleHotelChange} onBlur={handleBlur} placeholder="Endereço Completo" error={getError('address', hotelData.address, 'hotel')} />
                
                <div className="grid grid-cols-2 gap-4">
                  <InputField name="neighborhood" value={hotelData.neighborhood} onChange={handleHotelChange} onBlur={handleBlur} placeholder="Bairro" />
                  <InputField name="zipCode" value={hotelData.zipCode} onChange={handleHotelChange} onBlur={handleBlur} placeholder="CEP" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <input name="city" value="Barreirinhas" readOnly className="w-full pl-4 py-3 bg-white/5 border border-white/10 rounded-lg text-gray-500 cursor-not-allowed" />
                    <InputField name="roomsCount" type="number" value={hotelData.roomsCount} onChange={handleHotelChange} onBlur={handleBlur} placeholder="Qtd. Quartos" />
                </div>

                {/* Additional Info Fields */}
                <div className="space-y-4 pt-2">
                    <h4 className="text-xs text-gray-400 uppercase font-semibold">Políticas e Localização</h4>
                    <InputField name="googleMapsUrl" icon={MapPin} value={hotelData.googleMapsUrl} onChange={handleHotelChange} onBlur={handleBlur} placeholder="Link do Google Maps" />
                    
                    <div className="grid grid-cols-2 gap-4">
                        <InputField name="checkInTime" icon={Clock} label="Check-in" value={hotelData.checkInTime} onChange={handleHotelChange} onBlur={handleBlur} placeholder="Ex: 14:00" />
                        <InputField name="checkOutTime" icon={Clock} label="Check-out" value={hotelData.checkOutTime} onChange={handleHotelChange} onBlur={handleBlur} placeholder="Ex: 12:00" />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs text-gray-400 ml-1">Política de Cancelamento</label>
                        <textarea 
                            name="cancellationPolicy" 
                            value={hotelData.cancellationPolicy} 
                            onChange={handleHotelChange}
                            placeholder="Descreva as regras de cancelamento..."
                            className="w-full p-4 bg-white/5 border border-white/10 rounded-lg outline-none focus:border-purple-500 text-white min-h-[80px]"
                        />
                    </div>
                </div>
                
                {/* Amenities */}
                <div className="pt-4">
                    <label className="text-sm text-gray-400 block mb-2 font-semibold">Comodidades Oferecidas</label>
                    <div className="grid grid-cols-2 gap-3">
                        {['Wi-Fi', 'Café da Manhã', 'Piscina', 'Ar Condicionado', 'Estacionamento', 'Pet Friendly', 'Academia', 'Restaurante'].map(opt => (
                            <label key={opt} className={`flex items-center space-x-2 p-3 rounded-lg border transition-all cursor-pointer ${hotelData.amenities.includes(opt) ? 'bg-purple-500/10 border-purple-500/40' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}>
                                <input 
                                    type="checkbox" 
                                    checked={hotelData.amenities.includes(opt)}
                                    onChange={() => handleAmenityChange(opt)}
                                    className="w-4 h-4 rounded border-gray-600 text-purple-500 focus:ring-purple-500 bg-transparent"
                                />
                                <span className={`text-sm ${hotelData.amenities.includes(opt) ? 'text-purple-300' : 'text-gray-400'}`}>{opt}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Simulated File Upload */}
                <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-purple-500/50 hover:bg-purple-500/5 transition-colors cursor-pointer group">
                    <Upload className="w-10 h-10 text-gray-500 mx-auto mb-3 group-hover:text-purple-400 transition-colors" />
                    <p className="text-sm text-gray-300 font-medium">Fotos do Estabelecimento</p>
                    <p className="text-xs text-gray-500 mt-1">Clique para enviar fotos da fachada, quartos e áreas comuns</p>
                </div>

              </div>
            </div>
          )}

          {generalError && <div className="text-red-400 text-center text-sm p-2 bg-red-500/10 rounded-lg border border-red-500/20">{generalError}</div>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform hover:scale-[1.01] flex justify-center items-center ${
                activeTab === 'client' 
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black hover:from-amber-400 shadow-amber-900/20' 
                : 'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-500 shadow-purple-900/20'
            } ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? <Loader2 className="animate-spin" /> : (activeTab === 'client' ? 'Cadastrar Cliente' : 'Cadastrar Hotel')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;