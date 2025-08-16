import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, User, MessageCircle, CreditCard } from 'lucide-react';
import { ModernButton } from '../ui/ModernButton';
import { bookingService, BookingRequest } from '../../services/bookingService';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  expertId: string;
  serviceId: string;
  serviceName: string;
  expertName: string;
  price: number;
  onBookingSuccess: (bookingId: string) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  expertId,
  serviceId,
  serviceName,
  expertName,
  price,
  onBookingSuccess
}) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [duration, setDuration] = useState(1);
  const [message, setMessage] = useState('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Générer les dates disponibles (7 prochains jours)
  const getAvailableDates = () => {
    const dates = [];
    for (let i = 1; i <= 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  // Charger les créneaux disponibles quand la date change
  useEffect(() => {
    if (selectedDate) {
      loadAvailableSlots();
    }
  }, [selectedDate]);

  const loadAvailableSlots = async () => {
    try {
      const slots = await bookingService.getAvailableSlots(expertId, selectedDate);
      setAvailableSlots(slots);
    } catch (error) {
      console.error('Error loading slots:', error);
      // Créneaux par défaut si erreur
      setAvailableSlots(['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']);
    }
  };

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime) {
      setError('Veuillez sélectionner une date et une heure');
      return;
    }

    setIsLoading(true);
    setError('');

    const bookingData: BookingRequest = {
      serviceId,
      expertId,
      date: selectedDate,
      time: selectedTime,
      duration,
      message
    };

    try {
      const result = await bookingService.createBooking(bookingData);
      
      if (result.success && result.booking) {
        onBookingSuccess(result.booking._id);
        onClose();
      } else {
        setError(result.message || 'Erreur lors de la réservation');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    } finally {
      setIsLoading(false);
    }
  };

  const totalPrice = price * duration;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Réserver un service</h2>
              <p className="text-gray-600">{serviceName} avec {expertName}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Contenu */}
          <div className="p-6 space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Sélection de date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <Calendar className="w-4 h-4 inline mr-2" />
                Choisir une date
              </label>
              <div className="grid grid-cols-3 gap-3">
                {getAvailableDates().map((date) => {
                  const dateObj = new Date(date);
                  const isSelected = selectedDate === date;
                  return (
                    <button
                      key={date}
                      onClick={() => setSelectedDate(date)}
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-sm font-medium">
                        {dateObj.toLocaleDateString('fr-FR', { weekday: 'short' })}
                      </div>
                      <div className="text-xs text-gray-500">
                        {dateObj.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sélection d'heure */}
            {selectedDate && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <Clock className="w-4 h-4 inline mr-2" />
                  Choisir un créneau
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {availableSlots.map((time) => {
                    const isSelected = selectedTime === time;
                    return (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`p-2 rounded-lg border-2 transition-colors ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Durée */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Durée (heures)
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={1}>1 heure</option>
                <option value={2}>2 heures</option>
                <option value={3}>3 heures</option>
                <option value={4}>4 heures</option>
              </select>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MessageCircle className="w-4 h-4 inline mr-2" />
                Message pour l'expert (optionnel)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Décrivez vos besoins spécifiques..."
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Résumé */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Résumé de la réservation</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Service :</span>
                  <span className="font-medium">{serviceName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Expert :</span>
                  <span className="font-medium">{expertName}</span>
                </div>
                {selectedDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date :</span>
                    <span className="font-medium">
                      {new Date(selectedDate).toLocaleDateString('fr-FR', { 
                        weekday: 'long', 
                        day: 'numeric', 
                        month: 'long' 
                      })}
                    </span>
                  </div>
                )}
                {selectedTime && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Heure :</span>
                    <span className="font-medium">{selectedTime}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Durée :</span>
                  <span className="font-medium">{duration}h</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-2">
                  <span className="font-semibold text-gray-900">Total :</span>
                  <span className="font-bold text-blue-600">{totalPrice.toLocaleString()} FCFA</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <ModernButton
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1"
              >
                Annuler
              </ModernButton>
              <ModernButton
                onClick={handleBooking}
                disabled={isLoading || !selectedDate || !selectedTime}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Réservation...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Confirmer ({totalPrice.toLocaleString()} FCFA)
                  </>
                )}
              </ModernButton>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};