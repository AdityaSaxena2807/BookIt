import axios from 'axios';
import type {
  Experience,
  ExperienceDetails,
  BookingFormData,
  BookingResponse,
  PromoValidationResponse,
} from '../types';

const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Experience APIs
export const getExperiences = async (params?: {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}): Promise<Experience[]> => {
  const response = await api.get('/experiences', { params });
  return response.data;
};

export const getExperienceById = async (id: string): Promise<ExperienceDetails> => {
  const response = await api.get(`/experiences/${id}`);
  return response.data;
};

// Booking APIs
export const createBooking = async (data: BookingFormData): Promise<BookingResponse> => {
  const response = await api.post('/bookings', data);
  return response.data;
};

export const getBookingById = async (id: string) => {
  const response = await api.get(`/bookings/${id}`);
  return response.data;
};

// Promo Code APIs
export const validatePromoCode = async (
  code: string,
  amount: number
): Promise<PromoValidationResponse> => {
  const response = await api.post('/promo/validate', { code, amount });
  return response.data;
};

export default api;