import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  Tag,
  Loader2,
  ChevronLeft,
} from 'lucide-react';
import { createBooking, validatePromoCode } from '../services/api';
import type { BookingFormData } from '../types';

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { experience, slot, guests, date } = location.state || {};

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    promoCode: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoApplied, setPromoApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');

  // Redirect if no booking data
  if (!experience || !slot) {
    navigate('/');
    return null;
  }

  const subtotal = slot.price * guests;
  const total = subtotal - discount;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim() || formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim() || formData.phone.length < 10) {
      newErrors.phone = 'Phone must be at least 10 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleApplyPromo = async () => {
    if (!formData.promoCode.trim()) {
      setPromoError('Please enter a promo code');
      return;
    }

    try {
      setPromoLoading(true);
      setPromoError('');
      const response = await validatePromoCode(formData.promoCode, subtotal);

      if (response.valid && response.discount) {
        setDiscount(response.discount);
        setPromoApplied(true);
        setPromoError('');
      }
    } catch (err: any) {
      setPromoError(
        err.response?.data?.error || 'Invalid promo code'
      );
      setDiscount(0);
      setPromoApplied(false);
    } finally {
      setPromoLoading(false);
    }
  };

  const handleRemovePromo = () => {
    setFormData((prev) => ({ ...prev, promoCode: '' }));
    setDiscount(0);
    setPromoApplied(false);
    setPromoError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const bookingData: BookingFormData = {
        experienceId: experience.id,
        slotId: slot.id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        guests: guests,
        promoCode: promoApplied ? formData.promoCode : undefined,
      };

      const response = await createBooking(bookingData);

      if (response.success) {
        navigate(`/result/${response.booking.id}`, {
          state: { success: true },
        });
      }
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container-custom">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">
                Complete Your Booking
              </h1>

              <form onSubmit={handleSubmit}>
                {/* Personal Information */}
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Personal Information
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`input-field ${
                          errors.name ? 'border-red-500' : ''
                        }`}
                        placeholder="John Doe"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`input-field ${
                          errors.email ? 'border-red-500' : ''
                        }`}
                        placeholder="john@example.com"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`input-field ${
                          errors.phone ? 'border-red-500' : ''
                        }`}
                        placeholder="+1234567890"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Promo Code */}
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Promo Code
                  </h2>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <input
                        type="text"
                        name="promoCode"
                        value={formData.promoCode}
                        onChange={handleInputChange}
                        disabled={promoApplied}
                        className="input-field"
                        placeholder="Enter promo code"
                      />
                    </div>
                    {!promoApplied ? (
                      <button
                        type="button"
                        onClick={handleApplyPromo}
                        disabled={promoLoading || !formData.promoCode.trim()}
                        className="btn-secondary whitespace-nowrap"
                      >
                        {promoLoading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          'Apply'
                        )}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleRemovePromo}
                        className="btn-secondary whitespace-nowrap"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  {promoError && (
                    <p className="text-red-500 text-sm mt-2">{promoError}</p>
                  )}
                  {promoApplied && (
                    <p className="text-green-600 text-sm mt-2 flex items-center gap-1">
                      <Tag className="w-4 h-4" />
                      Promo code applied! You saved ${discount.toFixed(2)}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full text-lg py-4"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    `Confirm Booking - $${total.toFixed(2)}`
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Booking Summary
              </h2>

              {/* Experience Image */}
              <div className="mb-4">
                <img
                  src={experience.image}
                  alt={experience.title}
                  className="w-full h-40 object-cover rounded-lg"
                />
              </div>

              {/* Experience Details */}
              <div className="space-y-3 mb-6">
                <h3 className="font-semibold text-gray-900">
                  {experience.title}
                </h3>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{experience.location}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{format(parseISO(date), 'EEEE, MMM dd, yyyy')}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>
                    {slot.startTime} - {slot.endTime}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>{guests} Guest{guests > 1 ? 's' : ''}</span>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-gray-700">
                  <span>
                    ${slot.price} x {guests} guest{guests > 1 ? 's' : ''}
                  </span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="border-t pt-2 flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-primary-600">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}