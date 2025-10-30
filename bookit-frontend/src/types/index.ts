export interface Experience {
  id: string;
  title: string;
  description: string;
  location: string;
  category: string;
  price: number;
  duration: string;
  image: string;
  rating: number;
  reviewCount: number;
  highlights: string[];
  included: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Slot {
  id: string;
  experienceId: string;
  date: string;
  startTime: string;
  endTime: string;
  capacity: number;
  booked: number;
  available: number;
  isFull: boolean;
  price: number;
}

export interface ExperienceDetails extends Experience {
  slots?: Slot[];
  slotsByDate?: Record<string, Slot[]>;
}

export interface BookingFormData {
  experienceId: string;
  slotId: string;
  name: string;
  email: string;
  phone: string;
  guests: number;
  promoCode?: string;
}

export interface BookingResponse {
  success: boolean;
  booking: {
    id: string;
    experienceTitle: string;
    date: string;
    time: string;
    guests: number;
    totalPrice: number;
    discount: number;
    status: string;
    name: string;
    email: string;
  };
}

export interface PromoValidationResponse {
  valid: boolean;
  code?: string;
  type?: string;
  value?: number;
  discount?: number;
  finalAmount?: number;
  message?: string;
  error?: string;
}