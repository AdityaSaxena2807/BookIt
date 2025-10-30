import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Clock,
  Star,
  CheckCircle,
  Calendar,
  Users,
  Loader2,
  ChevronLeft,
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { getExperienceById } from '../services/api';
import type { ExperienceDetails, Slot } from '../types';

export default function DetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [experience, setExperience] = useState<ExperienceDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [guests, setGuests] = useState(1);

  useEffect(() => {
    if (id) {
      fetchExperience();
    }
  }, [id]);

  const fetchExperience = async () => {
    try {
      setLoading(true);
      const data = await getExperienceById(id!);
      setExperience(data);

      // Auto-select first available date
      if (data.slotsByDate && Object.keys(data.slotsByDate).length > 0) {
        const firstDate = Object.keys(data.slotsByDate)[0];
        setSelectedDate(firstDate);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load experience');
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    if (!selectedSlot) {
      alert('Please select a time slot');
      return;
    }

    if (selectedSlot.isFull) {
      alert('This slot is fully booked');
      return;
    }

    if (guests > selectedSlot.available) {
      alert(`Only ${selectedSlot.available} spots available`);
      return;
    }

    // Navigate to checkout with booking data
    navigate('/checkout', {
      state: {
        experience,
        slot: selectedSlot,
        guests,
        date: selectedDate,
      },
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  if (error || !experience) {
    return (
      <div className="container-custom py-16">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600">{error || 'Experience not found'}</p>
          <button onClick={() => navigate('/')} className="btn-primary mt-4">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const availableDates = experience.slotsByDate
    ? Object.keys(experience.slotsByDate)
    : [];
  const slotsForSelectedDate = selectedDate
    ? experience.slotsByDate?.[selectedDate] || []
    : [];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Back Button */}
      <div className="container-custom py-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back to Experiences</span>
        </button>
      </div>

      {/* Hero Image */}
      <div className="container-custom">
        <div className="relative h-96 rounded-2xl overflow-hidden mb-8">
          <img
            src={experience.image}
            alt={experience.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="container-custom pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-8 shadow-sm">
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="bg-primary-100 text-primary-700 px-4 py-1 rounded-full text-sm font-medium">
                    {experience.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{experience.rating}</span>
                    <span className="text-gray-500">
                      ({experience.reviewCount} reviews)
                    </span>
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                  {experience.title}
                </h1>
                <div className="flex items-center gap-6 text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    <span>{experience.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    <span>{experience.duration}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-3">About</h2>
                <p className="text-gray-700 leading-relaxed">
                  {experience.description}
                </p>
              </div>

              {/* Highlights */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Highlights
                </h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {experience.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* What's Included */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  What's Included
                </h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {experience.included.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-lg sticky top-24">
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-bold text-gray-900">
                    ${experience.price}
                  </span>
                  <span className="text-gray-600">per person</span>
                </div>
              </div>

              {/* Select Date */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Select Date
                </label>
                <select
                  className="input-field"
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setSelectedSlot(null);
                  }}
                >
                  <option value="">Choose a date</option>
                  {availableDates.map((date) => (
                    <option key={date} value={date}>
                      {format(parseISO(date), 'EEEE, MMM dd, yyyy')}
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Time Slot */}
              {selectedDate && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Select Time
                  </label>
                  <div className="space-y-2">
                    {slotsForSelectedDate.map((slot) => (
                      <button
                        key={slot.id}
                        onClick={() => setSelectedSlot(slot)}
                        disabled={slot.isFull}
                        className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                          selectedSlot?.id === slot.id
                            ? 'border-primary-600 bg-primary-50'
                            : slot.isFull
                            ? 'border-gray-200 bg-gray-100 cursor-not-allowed opacity-50'
                            : 'border-gray-200 hover:border-primary-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">
                            {slot.startTime} - {slot.endTime}
                          </span>
                          <span
                            className={`text-sm ${
                              slot.isFull ? 'text-red-600' : 'text-gray-600'
                            }`}
                          >
                            {slot.isFull
                              ? 'Sold Out'
                              : `${slot.available} spots left`}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Number of Guests */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  <Users className="w-4 h-4 inline mr-1" />
                  Number of Guests
                </label>
                <input
                  type="number"
                  min="1"
                  max={selectedSlot?.available || 10}
                  value={guests}
                  onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
                  className="input-field"
                />
              </div>

              {/* Total Price */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-primary-600">
                    ${(selectedSlot?.price || experience.price) * guests}
                  </span>
                </div>
              </div>

              {/* Book Button */}
              <button
                onClick={handleBookNow}
                disabled={!selectedSlot || selectedSlot.isFull}
                className="btn-primary w-full"
              >
                Book Now
              </button>

              {selectedSlot?.isFull && (
                <p className="text-red-600 text-sm text-center mt-2">
                  This slot is fully booked. Please select another time.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}