import api from './api';

export const uploadService = {
  uploadImages: async (files: File[]): Promise<{ urls: string[] }> => {
    // Mode mock - générer des URLs d'images factices
    const mockUrls = files.map((file, index) => {
      return `https://images.pexels.com/photos/${1000000 + index}/pexels-photo-${1000000 + index}.jpeg?w=400&h=300`;
    });
    
    // Simuler un délai d'upload
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return { urls: mockUrls };
  },

  uploadFile: async (file: File): Promise<{ url: string }> => {
    // Mode mock - générer une URL de fichier factice
    const mockUrl = `https://example.com/files/${Date.now()}-${file.name}`;
    
    // Simuler un délai d'upload
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return { url: mockUrl };
  },
};