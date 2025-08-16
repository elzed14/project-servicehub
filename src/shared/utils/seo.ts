// Utilitaires SEO pour ServiceHub
export const seoUtils = {
  // Générer les meta tags
  generateMetaTags: (page: {
    title: string;
    description: string;
    keywords?: string[];
    image?: string;
    url?: string;
  }) => {
    const baseUrl = 'https://sparkling-praline-ddd170.netlify.app';
    
    return {
      title: `${page.title} | ServiceHub - Experts locaux`,
      description: page.description,
      keywords: page.keywords?.join(', ') || 'experts, services, local, professionnel',
      openGraph: {
        title: page.title,
        description: page.description,
        image: page.image || `${baseUrl}/og-image.jpg`,
        url: page.url || baseUrl,
        type: 'website',
        siteName: 'ServiceHub'
      },
      twitter: {
        card: 'summary_large_image',
        title: page.title,
        description: page.description,
        image: page.image || `${baseUrl}/og-image.jpg`
      }
    };
  },

  // Générer les données structurées JSON-LD
  generateStructuredData: (type: 'LocalBusiness' | 'Service' | 'Person', data: any) => {
    const baseStructure = {
      '@context': 'https://schema.org',
      '@type': type
    };

    switch (type) {
      case 'LocalBusiness':
        return {
          ...baseStructure,
          name: 'ServiceHub',
          description: 'Plateforme de mise en relation entre clients et experts locaux',
          url: 'https://sparkling-praline-ddd170.netlify.app',
          telephone: '+33-1-23-45-67-89',
          address: {
            '@type': 'PostalAddress',
            addressCountry: 'FR',
            addressLocality: 'Paris'
          },
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.8',
            reviewCount: '1250'
          }
        };

      case 'Service':
        return {
          ...baseStructure,
          name: data.name,
          description: data.description,
          provider: {
            '@type': 'Person',
            name: data.providerName
          },
          areaServed: data.location,
          offers: {
            '@type': 'Offer',
            price: data.price,
            priceCurrency: 'EUR'
          }
        };

      case 'Person':
        return {
          ...baseStructure,
          name: data.name,
          jobTitle: data.profession,
          address: {
            '@type': 'PostalAddress',
            addressLocality: data.location
          },
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: data.rating,
            reviewCount: data.reviewCount
          }
        };

      default:
        return baseStructure;
    }
  },

  // Générer le sitemap XML
  generateSitemap: (pages: string[]) => {
    const baseUrl = 'https://sparkling-praline-ddd170.netlify.app';
    const currentDate = new Date().toISOString().split('T')[0];
    
    const urlEntries = pages.map(page => `
  <url>
    <loc>${baseUrl}${page}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page === '/' ? '1.0' : '0.8'}</priority>
  </url>`).join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
  },

  // Optimiser les images pour le SEO
  optimizeImageSEO: (src: string, alt: string, title?: string) => ({
    src,
    alt,
    title: title || alt,
    loading: 'lazy' as const,
    decoding: 'async' as const
  })
};