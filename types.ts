export enum UserRole {
  CLIENT = 'CLIENT',
  HOTEL = 'HOTEL'
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  password?: string; // stored for simulation only
}

export interface ClientProfile extends User {
  surname: string;
  whatsapp: string;
  cpf: string;
}

export interface HotelProfile extends User {
  whatsapp: string;
  cpfOrCnpj: string;
  hotelName: string;
  address: string;
  neighborhood: string;
  city: string;
  zipCode: string;
  hotelCnpj: string;
  roomsCount: number;
  category: string;
  amenities: string[];
  description?: string;
  pricePerNight?: number;
  images: string[]; // Placeholder URLs
  
  // New Fields
  googleMapsUrl?: string;
  checkInTime?: string;
  checkOutTime?: string;
  cancellationPolicy?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

// --- New Types for Dashboard Features ---

export interface Room {
  id: string;
  hotelId: string;
  name: string;
  capacity: number;
  price: number;
  description: string;
  images: string[];
  isAvailable: boolean;
  amenities: string[];
}

export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

export interface Reservation {
  id: string;
  hotelId: string;
  hotelName: string;
  hotelImage: string;
  clientId: string;
  clientName: string;
  clientPhoto?: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: ReservationStatus;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
}