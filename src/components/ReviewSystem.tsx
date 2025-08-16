import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, ThumbsDown, Flag, User, Calendar, Filter } from 'lucide-react';

interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: Date;
  helpful: number;
  notHelpful: number;
  isVerified: boolean;
  serviceId: string;
  response?: {
    text: string;
    date: Date;
  };
}

interface ReviewSystemProps {
  serviceId: string;
  currentUserId?: string;
  canReview?: boolean;
  onReviewSubmit?: (review: Omit<Review, 'id' | 'date' | 'helpful' | 'notHelpful'>) => void;
}

export default function ReviewSystem({ 
  serviceId, 
  currentUserId, 
  canReview = false, 
  onReviewSubmit 
}: ReviewSystemProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: ''
  });
  const [filter, setFilter] = useState<'all' | 1 | 2 | 3 | 4 | 5>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'helpful' | 'rating'>('recent');
  const [loading, setLoading] = useState(false);

  // Mock data - à remplacer par des appels API
  const mockReviews: Review[] = [
    {
      id: '1',
      userId: 'user1',
      userName: 'Marie Dubois',
      userAvatar: '/api/placeholder/40/40',
      rating: 5,
      comment: 'Excellent service ! Le prestataire a été très professionnel et a livré exactement ce que je demandais. Je recommande vivement !',
      date: new Date('2024-01-15'),
      helpful: 12,
      notHelpful: 1,
      isVerified: true,
      serviceId,
      response: {
        text: 'Merci beaucoup Marie ! C\'était un plaisir de travailler avec vous.',
        date: new Date('2024-01-16')
      }
    },
    {
      id: '2',
      userId: 'user2',
      userName: 'Jean Martin',
      userAvatar: '/api/placeholder/40/40',
      rating: 4,
      comment: 'Bon travail dans l\'ensemble. Quelques petits ajustements ont été nécessaires mais le résultat final est satisfaisant.',
      date: new Date('2024-01-10'),
      helpful: 8,
      notHelpful: 2,
      isVerified: true,
      serviceId
    },
    {
      id: '3',
      userId: 'user3',
      userName: 'Sophie Laurent',
      userAvatar: '/api/placeholder/40/40',
      rating: 5,
      comment: 'Parfait ! Livraison rapide et qualité au rendez-vous. Je ferai appel à ce prestataire à nouveau.',
      date: new Date('2024-01-05'),
      helpful: 15,
      notHelpful: 0,
      isVerified: true,
      serviceId
    }
  ];

  useEffect(() => {
    // Simuler le chargement des avis
    setLoading(true);
    setTimeout(() => {
      setReviews(mockReviews);
      setLoading(false);
    }, 1000);
  }, [serviceId]);

  const handleSubmitReview = async () => {
    if (newReview.rating === 0 || !newReview.comment.trim()) return;

    const review = {
      userId: currentUserId || 'current-user',
      userName: 'Utilisateur actuel',
      userAvatar: '/api/placeholder/40/40',
      rating: newReview.rating,
      comment: newReview.comment.trim(),
      isVerified: true,
      serviceId
    };

    if (onReviewSubmit) {
      onReviewSubmit(review);
    }

    // Ajouter localement pour l'aperçu
    const fullReview: Review = {
      ...review,
      id: Date.now().toString(),
      date: new Date(),
      helpful: 0,
      notHelpful: 0
    };

    setReviews(prev => [fullReview, ...prev]);
    setNewReview({ rating: 0, comment: '' });
    setShowReviewForm(false);
  };

  const handleHelpful = (reviewId: string, isHelpful: boolean) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId 
        ? {
            ...review,
            helpful: isHelpful ? review.helpful + 1 : review.helpful,
            notHelpful: !isHelpful ? review.notHelpful + 1 : review.notHelpful
          }
        : review
    ));
  };

  const getFilteredAndSortedReviews = () => {
    let filtered = reviews;

    // Filtrer par note
    if (filter !== 'all') {
      filtered = filtered.filter(review => review.rating === filter);
    }

    // Trier
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'helpful':
          return b.helpful - a.helpful;
        case 'rating':
          return b.rating - a.rating;
        case 'recent':
        default:
          return b.date.getTime() - a.date.getTime();
      }
    });

    return filtered;
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating as keyof typeof distribution]++;
    });
    return distribution;
  };

  const distribution = getRatingDistribution();
  const filteredReviews = getFilteredAndSortedReviews();

  return (
    <div className="bg-white rounded-lg p-6">
      {/* En-tête avec statistiques */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold">Avis clients</h3>
          {canReview && !showReviewForm && (
            <button
              onClick={() => setShowReviewForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Laisser un avis
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Note moyenne */}
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {getAverageRating()}
            </div>
            <div className="flex justify-center mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-6 h-6 ${
                    i < Math.round(Number(getAverageRating())) 
                      ? 'text-yellow-400 fill-current' 
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-gray-600">
              Basé sur {reviews.length} avis
            </p>
          </div>

          {/* Distribution des notes */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map(rating => (
              <div key={rating} className="flex items-center space-x-2">
                <span className="text-sm font-medium w-8">{rating}</span>
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{
                      width: `${reviews.length > 0 ? (distribution[rating as keyof typeof distribution] / reviews.length) * 100 : 0}%`
                    }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-8">
                  {distribution[rating as keyof typeof distribution]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Formulaire d'avis */}
      {showReviewForm && (
        <div className="mb-8 p-6 bg-gray-50 rounded-lg">
          <h4 className="text-lg font-semibold mb-4">Laisser un avis</h4>
          
          {/* Sélection de note */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Note *
            </label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map(rating => (
                <button
                  key={rating}
                  onClick={() => setNewReview(prev => ({ ...prev, rating }))}
                  className={`p-1 ${
                    rating <= newReview.rating ? 'text-yellow-400' : 'text-gray-300'
                  } hover:text-yellow-400`}
                >
                  <Star className="w-8 h-8 fill-current" />
                </button>
              ))}
            </div>
          </div>

          {/* Commentaire */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Commentaire *
            </label>
            <textarea
              value={newReview.comment}
              onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
              rows={4}
              placeholder="Partagez votre expérience..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Boutons */}
          <div className="flex space-x-3">
            <button
              onClick={handleSubmitReview}
              disabled={newReview.rating === 0 || !newReview.comment.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Publier l'avis
            </button>
            <button
              onClick={() => {
                setShowReviewForm(false);
                setNewReview({ rating: 0, comment: '' });
              }}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Filtres et tri */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium">Filtrer :</span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Toutes les notes</option>
              <option value={5}>5 étoiles</option>
              <option value={4}>4 étoiles</option>
              <option value={3}>3 étoiles</option>
              <option value={2}>2 étoiles</option>
              <option value={1}>1 étoile</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Trier :</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="recent">Plus récents</option>
              <option value="helpful">Plus utiles</option>
              <option value="rating">Note décroissante</option>
            </select>
          </div>
        </div>

        <span className="text-sm text-gray-600">
          {filteredReviews.length} avis affichés
        </span>
      </div>

      {/* Liste des avis */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Chargement des avis...</p>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Aucun avis pour ce filtre.</p>
          </div>
        ) : (
          filteredReviews.map(review => (
            <div key={review.id} className="border-b border-gray-100 pb-6 last:border-b-0">
              <div className="flex items-start space-x-4">
                <img
                  src={review.userAvatar}
                  alt={review.userName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h5 className="font-medium">{review.userName}</h5>
                    {review.isVerified && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Vérifié
                      </span>
                    )}
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      {review.date.toLocaleDateString('fr-FR')}
                    </span>
                  </div>

                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {review.comment}
                  </p>

                  {/* Réponse du prestataire */}
                  {review.response && (
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium">Réponse du prestataire</span>
                        <span className="text-sm text-gray-500">
                          {review.response.date.toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm">
                        {review.response.text}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleHelpful(review.id, true)}
                      className="flex items-center space-x-1 text-sm text-gray-500 hover:text-green-600"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span>Utile ({review.helpful})</span>
                    </button>
                    <button
                      onClick={() => handleHelpful(review.id, false)}
                      className="flex items-center space-x-1 text-sm text-gray-500 hover:text-red-600"
                    >
                      <ThumbsDown className="w-4 h-4" />
                      <span>Pas utile ({review.notHelpful})</span>
                    </button>
                    <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-red-600">
                      <Flag className="w-4 h-4" />
                      <span>Signaler</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}