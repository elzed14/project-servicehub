import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, Flag } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Review {
  _id: string;
  user: {
    name: string;
    avatar?: string;
  };
  rating: number;
  comment: string;
  images: string[];
  helpful: number;
  createdAt: string;
}

interface ReviewListProps {
  serviceId: string;
}

const ReviewList: React.FC<ReviewListProps> = ({ serviceId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchReviews();
  }, [serviceId, page]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/reviews/service/${serviceId}?page=${page}&limit=5`);
      const data = await response.json();
      setReviews(data.reviews);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Erreur lors du chargement des avis:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleHelpful = async (reviewId: string) => {
    try {
      await fetch(`/api/reviews/${reviewId}/helpful`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      fetchReviews();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
      />
    ));
  };

  if (loading) {
    return <div className="animate-pulse bg-gray-200 h-20 rounded"></div>;
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review._id} className="bg-white rounded-lg shadow p-4">
          <div className="flex items-start space-x-3">
            <img
              src={review.user.avatar || '/default-avatar.png'}
              alt={review.user.name}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">{review.user.name}</h4>
                  <div className="flex items-center space-x-1">
                    {renderStars(review.rating)}
                    <span className="text-sm text-gray-600 ml-2">
                      {formatDistanceToNow(new Date(review.createdAt), { locale: fr })}
                    </span>
                  </div>
                </div>
              </div>
              
              <p className="mt-2 text-gray-700">{review.comment}</p>
              
              {review.images.length > 0 && (
                <div className="mt-3 flex space-x-2">
                  {review.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Image ${index + 1}`}
                      className="w-20 h-20 rounded object-cover"
                    />
                  ))}
                </div>
              )}
              
              <div className="mt-3 flex items-center space-x-4">
                <button
                  onClick={() => handleHelpful(review._id)}
                  className="flex items-center space-x-1 text-sm text-gray-600 hover:text-blue-600"
                >
                  <ThumbsUp size={16} />
                  <span>Utile ({review.helpful})</span>
                </button>
                
                <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-red-600">
                  <Flag size={16} />
                  <span>Signaler</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-4">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => setPage(pageNum)}
              className={`px-3 py-1 rounded ${
                page === pageNum
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {pageNum}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewList;
