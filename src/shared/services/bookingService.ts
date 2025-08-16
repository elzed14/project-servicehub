// Service de réservation
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface Booking {
  _id: string;
  serviceId: string;
  expertId: string;
  clientId: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  message?: string;
  createdAt: string;
}

interface BookingRequest {
  serviceId: string;
  expertId: string;
  date: string;
  time: string;
  duration: number;
  message?: string;
}

class BookingService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('servicehub_token');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  // Créer une réservation
  async createBooking(bookingData: BookingRequest): Promise<{ success: boolean; booking?: Booking; message?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Create booking error:', error);
      return { success: false, message: 'Erreur de connexion au serveur' };
    }
  }

  // Obtenir les réservations de l'utilisateur
  async getUserBookings(): Promise<{ bookings: Booking[], total: number }> {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/user`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const result = await response.json();
      return result.success ? { bookings: result.data, total: result.total } : { bookings: [], total: 0 };
    } catch (error) {
      console.error('Get user bookings error:', error);
      return { bookings: [], total: 0 };
    }
  }

  // Obtenir les réservations d'un expert
  async getExpertBookings(): Promise<{ bookings: Booking[], total: number }> {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/expert`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const result = await response.json();
      return result.success ? { bookings: result.data, total: result.total } : { bookings: [], total: 0 };
    } catch (error) {
      console.error('Get expert bookings error:', error);
      return { bookings: [], total: 0 };
    }
  }

  // Mettre à jour le statut d'une réservation
  async updateBookingStatus(bookingId: string, status: Booking['status']): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ status }),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Update booking status error:', error);
      return { success: false, message: 'Erreur de connexion au serveur' };
    }
  }

  // Obtenir les créneaux disponibles d'un expert
  async getAvailableSlots(expertId: string, date: string): Promise<string[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/slots/${expertId}?date=${date}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const result = await response.json();
      return result.success ? result.data : [];
    } catch (error) {
      console.error('Get available slots error:', error);
      return [];
    }
  }
}

export const bookingService = new BookingService();
export type { Booking, BookingRequest };