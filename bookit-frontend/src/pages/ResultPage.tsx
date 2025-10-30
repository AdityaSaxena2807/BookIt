import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import {
  CheckCircle,
  XCircle,
  MapPin,
  Calendar,
  Clock,
  Users,
  Mail,
  Phone,
  Download,
  Home,
  Loader2,
} from 'lucide-react';
import { getBookingById } from '../services/api';

export default function ResultPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      setLoading(true);
      const data = await getBookingById(bookingId!);
      setBooking(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load booking details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="bg-gray-50 min-h-screen py-16">
        <div className="container-custom max-w-2xl">
          <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Booking Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              {error || 'The booking you are looking for does not exist.'}
            </p>
            <Link to="/" className="btn-primary inline-flex items-center gap-2">
              <Home className="w-5 h-5" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isSuccess = booking.status === 'confirmed';

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="container-custom max-w-3xl">
        {/* Success/Error Card */}
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm text-center mb-8">
          {isSuccess ? (
            <>
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                Booking Confirmed!
              </h1>
              <p className="text-lg text-gray-600 mb-2">
                Your booking has been successfully confirmed.
              </p>
              <p className="text-gray-600">
                A confirmation email has been sent to{' '}
                <span className="font-medium">{booking.email}</span>
              </p>
            </>
          ) : (
            <>
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-12 h-12 text-red-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                Booking Failed
              </h1>
              <p className="text-lg text-gray-600">
                Unfortunately, we couldn't process your booking.
              </p>
            </>
          )}
        </div>

        {isSuccess && (
          <>
            {/* Booking Details */}
            <div className="bg-white rounded-2xl p-8 shadow-sm mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Booking Details
              </h2>

              {/* Experience Info */}
              <div className="flex gap-4 mb-6 pb-6 border-b">
                <img
                  src={booking.experienceImage}
                  alt={booking.experienceTitle}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">
                    {booking.experienceTitle}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>{booking.location}</span>
                  </div>
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-primary-600" />
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-semibold text-gray-900">
                      {format(parseISO(booking.date), 'EEEE, MMM dd, yyyy')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Clock className="w-5 h-5 text-primary-600" />
                  <div>
                    <p className="text-sm text-gray-600">Time</p>
                    <p className="font-semibold text-gray-900">{booking.time}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Users className="w-5 h-5 text-primary-600" />
                  <div>
                    <p className="text-sm text-gray-600">Guests</p>
                    <p className="font-semibold text-gray-900">
                      {booking.guests} Guest{booking.guests > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="w-5 h-5 flex items-center justify-center text-primary-600 font-bold">
                    $
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="font-semibold text-gray-900">
                      ${booking.totalPrice.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-700">
                    <Users className="w-5 h-5 text-gray-400" />
                    <span>{booking.name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <span>{booking.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <span>{booking.phone}</span>
                  </div>
                </div>
              </div>

              {/* Booking ID */}
              <div className="border-t mt-6 pt-6">
                <div className="bg-primary-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Booking Reference</p>
                  <p className="font-mono font-semibold text-primary-700">
                    {booking.id}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => window.print()}
                className="btn-secondary flex-1 flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download Confirmation
              </button>
              <Link
                to="/"
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                <Home className="w-5 h-5" />
                Book Another Experience
              </Link>
            </div>
          </>
        )}

        {!isSuccess && (
          <div className="text-center">
            <Link to="/" className="btn-primary inline-flex items-center gap-2">
              <Home className="w-5 h-5" />
              Back to Home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}