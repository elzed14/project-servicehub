import React, { useState, useEffect, useCallback } from 'react';
import { Upload, Plus, X, Loader2, Image as ImageIcon, Trash2 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { serviceService } from '../shared/services/serviceService';
import { Category } from '../types';
import { useAppContext } from '../context/AppContext';
import { useNotifications } from '../hooks/useNotifications';

export default function PostService() {
  const { state } = useAppContext();
  const { currentUser } = state;
  const { success, error } = useNotifications();
  const [serviceType, setServiceType] = useState<'offer' | 'request'>('offer');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    location: '',
    tags: [] as string[],
    images: [] as string[],
    type: serviceType,
  });
  const [newTag, setNewTag] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true);
    try {
      // Simulation d'upload d'images
      const newImageUrls = acceptedFiles.map((file, index) => 
        `https://images.unsplash.com/photo-${1500000 + index}/photo.jpg?w=400`
      );
      setFormData(prev => ({ ...prev, images: [...prev.images, ...newImageUrls] }));
      const newImagePreviews = acceptedFiles.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newImagePreviews]);
    } catch (err) {
      setFormError('Erreur lors de l\'upload des images');
      console.error(err);
    } finally {
      setUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png', '.jpg'] },
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categories = await serviceService.getCategories();
        const categoryObjects = categories.map((name, index) => ({
          id: (index + 1).toString(),
          name,
          icon: 'Code',
          color: 'bg-blue-500',
          isActive: true,
          serviceCount: 0
        }));
        setCategories(categoryObjects);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    setFormData(prev => ({ ...prev, type: serviceType }));
  }, [serviceType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      error('Vous devez être connecté pour publier un service');
      return;
    }
    
    setLoading(true);
    setFormError(null);
    try {
      const response = await serviceService.createService({
        ...formData,
        expert: {
          _id: currentUser.id,
          name: currentUser.name,
          avatar: currentUser.avatar,
          rating: currentUser.rating,
          reviewCount: currentUser.reviews
        }
      });
      
      if (response.success) {
        success('Service publié avec succès !');
        // Reset form
        setFormData({
          title: '',
          description: '',
          category: '',
          price: '',
          location: '',
          tags: [],
          images: [],
          type: serviceType,
        });
        setImagePreviews([]);
      } else {
        setFormError(response.message || 'Erreur lors de la publication');
      }
    } catch (err) {
      setFormError('Erreur lors de la publication du service');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Publier un service
        </h2>

        {/* Service Type Toggle */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type de service
          </label>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setServiceType('offer')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                serviceType === 'offer'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              J'offre un service
            </button>
            <button
              type="button"
              onClick={() => setServiceType('request')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                serviceType === 'request'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Je recherche un service
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre du service *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder={serviceType === 'offer' ? 'Ex: Développement site web' : 'Ex: Cherche développeur web'}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Décrivez votre service en détail..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Sélectionner une catégorie</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prix *
              </label>
              <input
                type="text"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="Ex: 50€/h ou 200-500€"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Localisation *
            </label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Ex: Paris, France"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mots-clés
            </label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Ajouter un mot-clé"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Images
            </label>
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer hover:border-blue-400 transition-colors ${isDragActive ? 'border-blue-500 bg-blue-50' : ''}`}
            >
              <input {...getInputProps()} />
              {uploading ? (
                <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-2" />
              ) : (
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              )}
              <p className="text-sm text-gray-600">
                {isDragActive ? 'Déposez les images ici...' : 'Cliquez pour ajouter des images ou glissez-déposez'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG jusqu'à 5MB
              </p>
            </div>
            {imagePreviews.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative">
                    <img src={preview} alt={`preview ${index}`} className="w-full h-24 object-cover rounded-md" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {formError}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Publier le service'}
          </button>
        </form>
      </div>
    </div>
  );
}
