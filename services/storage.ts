import { ClientProfile, HotelProfile, User, UserRole, Room, Reservation, Notification, ReservationStatus } from '../types';

const USERS_KEY = 'venus_users';
const CURRENT_USER_KEY = 'venus_current_user';
const ROOMS_KEY = 'venus_rooms';
const RESERVATIONS_KEY = 'venus_reservations';
const NOTIFICATIONS_KEY = 'venus_notifications';

// Mock Data Initialization
const initializeMockData = () => {
  const stored = localStorage.getItem(USERS_KEY);
  if (!stored) {
    const mockHotels: HotelProfile[] = [
      {
        id: 'h1',
        name: 'Carlos Hoteleiro',
        email: 'hotel@venus.com',
        role: UserRole.HOTEL,
        password: '123',
        whatsapp: '98999999999',
        cpfOrCnpj: '00000000000',
        hotelName: 'Grand Vênus Resort',
        address: 'Av. Beira Rio, 100',
        neighborhood: 'Centro',
        city: 'Barreirinhas',
        zipCode: '65590-000',
        hotelCnpj: '11111111000111',
        roomsCount: 50,
        category: 'Resort',
        amenities: ['Wi-Fi', 'Piscina', 'Café da Manhã', 'Ar Condicionado', 'Academia'],
        pricePerNight: 450,
        images: ['https://picsum.photos/800/600'],
        description: 'Luxo e conforto nas margens do Rio Preguiças.',
        checkInTime: '14:00',
        checkOutTime: '12:00',
        cancellationPolicy: 'Cancelamento gratuito até 48 horas antes do check-in.',
        googleMapsUrl: 'https://maps.google.com/?q=Barreirinhas'
      },
      {
        id: 'h2',
        name: 'Maria Pousada',
        email: 'pousada@venus.com',
        role: UserRole.HOTEL,
        password: '123',
        whatsapp: '98988888888',
        cpfOrCnpj: '22222222222',
        hotelName: 'Pousada das Dunas',
        address: 'Rua das Areias, 42',
        neighborhood: 'Canto',
        city: 'Barreirinhas',
        zipCode: '65590-000',
        hotelCnpj: '22222222000122',
        roomsCount: 12,
        category: 'Pousada',
        amenities: ['Wi-Fi', 'Café da Manhã'],
        pricePerNight: 180,
        images: ['https://picsum.photos/800/601'],
        description: 'Simplicidade e aconchego perto dos lençóis.',
        checkInTime: '13:00',
        checkOutTime: '11:00',
        cancellationPolicy: 'Não reembolsável.',
        googleMapsUrl: 'https://maps.google.com/?q=Barreirinhas'
      }
    ];
    localStorage.setItem(USERS_KEY, JSON.stringify(mockHotels));
  }

  // Initialize Rooms
  if (!localStorage.getItem(ROOMS_KEY)) {
    const mockRooms: Room[] = [
      {
        id: 'r1',
        hotelId: 'h1',
        name: 'Suíte Master Ocean',
        capacity: 2,
        price: 550,
        description: 'Vista para o rio, banheira de hidromassagem e cama king size.',
        images: ['https://picsum.photos/400/300'],
        isAvailable: true,
        amenities: ['Ar Condicionado', 'Wi-Fi', 'Banheira', 'TV 50"']
      },
      {
        id: 'r2',
        hotelId: 'h1',
        name: 'Quarto Standard',
        capacity: 3,
        price: 350,
        description: 'Conforto ideal para pequenas famílias.',
        images: ['https://picsum.photos/401/300'],
        isAvailable: true,
        amenities: ['Ar Condicionado', 'Wi-Fi', 'TV 32"']
      }
    ];
    localStorage.setItem(ROOMS_KEY, JSON.stringify(mockRooms));
  }

  // Initialize Reservations
  if (!localStorage.getItem(RESERVATIONS_KEY)) {
    const mockReservations: Reservation[] = [
      {
        id: 'res1',
        hotelId: 'h1',
        hotelName: 'Grand Vênus Resort',
        hotelImage: 'https://picsum.photos/800/600',
        clientId: 'c1', // Assuming a client might exist or will be created
        clientName: 'João Silva',
        roomName: 'Suíte Master Ocean',
        checkIn: '2024-06-10',
        checkOut: '2024-06-15',
        totalPrice: 2750,
        status: 'CONFIRMED',
        createdAt: '2024-06-01'
      },
      {
        id: 'res2',
        hotelId: 'h1',
        hotelName: 'Grand Vênus Resort',
        hotelImage: 'https://picsum.photos/800/600',
        clientId: 'c1',
        clientName: 'Ana Souza',
        roomName: 'Quarto Standard',
        checkIn: '2024-07-20',
        checkOut: '2024-07-22',
        totalPrice: 700,
        status: 'PENDING',
        createdAt: '2024-06-05'
      }
    ];
    localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(mockReservations));
  }
};

initializeMockData();

export const StorageService = {
  getUsers: (): User[] => {
    const usersStr = localStorage.getItem(USERS_KEY);
    return usersStr ? JSON.parse(usersStr) : [];
  },

  registerUser: (user: ClientProfile | HotelProfile): boolean => {
    const users = StorageService.getUsers();
    if (users.find(u => u.email === user.email)) {
      return false; // User exists
    }
    users.push(user);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return true;
  },

  login: (email: string, pass: string): User | null => {
    const users = StorageService.getUsers();
    const user = users.find(u => u.email === email && u.password === pass);
    if (user) {
      const { password, ...safeUser } = user; 
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));
      return safeUser as User;
    }
    return null;
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem(CURRENT_USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },

  logout: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  updateHotel: (updatedHotel: HotelProfile) => {
    const users = StorageService.getUsers();
    const index = users.findIndex(u => u.id === updatedHotel.id);
    if (index !== -1) {
      users[index] = updatedHotel;
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      const currentUser = StorageService.getCurrentUser();
      if (currentUser && currentUser.id === updatedHotel.id) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedHotel));
      }
    }
  },

  getAllHotels: (): HotelProfile[] => {
    const users = StorageService.getUsers();
    return users.filter((u): u is HotelProfile => u.role === UserRole.HOTEL);
  },

  // --- Rooms ---
  getRooms: (hotelId: string): Room[] => {
    const rooms = JSON.parse(localStorage.getItem(ROOMS_KEY) || '[]');
    return rooms.filter((r: Room) => r.hotelId === hotelId);
  },

  saveRoom: (room: Room) => {
    const rooms = JSON.parse(localStorage.getItem(ROOMS_KEY) || '[]');
    const index = rooms.findIndex((r: Room) => r.id === room.id);
    if (index >= 0) {
      rooms[index] = room;
    } else {
      rooms.push(room);
    }
    localStorage.setItem(ROOMS_KEY, JSON.stringify(rooms));
  },

  deleteRoom: (roomId: string) => {
    const rooms = JSON.parse(localStorage.getItem(ROOMS_KEY) || '[]');
    const filtered = rooms.filter((r: Room) => r.id !== roomId);
    localStorage.setItem(ROOMS_KEY, JSON.stringify(filtered));
  },

  // --- Reservations ---
  getReservationsForHotel: (hotelId: string): Reservation[] => {
    const res = JSON.parse(localStorage.getItem(RESERVATIONS_KEY) || '[]');
    return res.filter((r: Reservation) => r.hotelId === hotelId);
  },

  getReservationsForClient: (clientId: string): Reservation[] => {
    // For demo purposes, if userId is not found, return all or mock specific logic
    const res = JSON.parse(localStorage.getItem(RESERVATIONS_KEY) || '[]');
    // In a real app, we filter by clientId. For this demo, let's return all sample reservations if we are a client
    // OR create a specific binding. Let's filter loosely for demo if ID matches or just return all for visual purposes if empty.
    const filtered = res.filter((r: Reservation) => r.clientId === clientId);
    return filtered.length > 0 ? filtered : res; // Fallback to show data for demo
  },

  updateReservationStatus: (id: string, status: ReservationStatus) => {
    const res = JSON.parse(localStorage.getItem(RESERVATIONS_KEY) || '[]');
    const index = res.findIndex((r: Reservation) => r.id === id);
    if (index >= 0) {
      res[index].status = status;
      localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(res));
    }
  },

  // --- Notifications ---
  getNotifications: (userId: string): Notification[] => {
    // Returning mock notifications
    return [
      { id: 'n1', userId, title: 'Reserva Confirmada', message: 'Sua reserva no Grand Vênus foi confirmada!', date: '2024-06-02', read: false, type: 'success' },
      { id: 'n2', userId, title: 'Promoção Relâmpago', message: '30% de desconto em resorts selecionados.', date: '2024-06-05', read: true, type: 'info' }
    ];
  }
};