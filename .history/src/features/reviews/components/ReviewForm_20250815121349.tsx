import React, { useState } from 'react';
import { useAuth } from '../../../context/AppContext';
import { Star, Camera } from 'lucide-react';
import { createReview } from '../services/reviewService';

interface ReviewFormProps {
  serviceId: string;
  onReviewSubmitted: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ serviceId, onReviewSubmitted }) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('Vous devez être connecté pour laisser un avis');
      return;
    }

    if (rating === 0) {
      setError('Veuillez sélectionner une note');
      return;
    }

    if (comment.trim().length < 10) {
      setError('Le commentaire doit contenir au moins 10 caractères');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await createReview({
        serviceId,
        rating,
        comment,
        images
      });
      
      setRating(0);
      setComment('');
      setImages([]);
      onReviewSubmitted();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la création de l\'avis');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // Handle image upload logic here
      // For now, we'll just log the files
      console.log('Files to upload:', files);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Laisser un avis</h3>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Note
          </label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`p-1 rounded ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
              >
                <Star size={24} fill={rating >= star ? 'currentColor' : 'none'} />
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Commentaire
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Décrivez votre expérience avec ce service..."
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Images (optionnel)
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="flex items-center px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
            >
              <Camera size={20} className="mr-2" />
              Ajouter des images
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Envoi...' : 'Publier l\'avis'}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
