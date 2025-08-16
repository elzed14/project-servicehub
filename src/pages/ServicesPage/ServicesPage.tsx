import React, { useState, useEffect } from 'react';
import { Filter, Grid, List } from 'lucide-react';
import { 
  SearchInput, 
  Dropdown, 
  Tabs, 
  TabPanel, 
  Pagination, 
  Button,
  AnimatedCard
} from '../../shared/components/ui';
import Breadcrumbs from '../../shared/components/navigation/Breadcrumbs';
import ServiceGrid from '../../features/services/components/ServiceGrid';
import { serviceService } from '../../services/serviceService';
import { Service } from '../../types';

const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [serviceType, setServiceType] = useState('all');

  const itemsPerPage = 9;
  const totalPages = Math.ceil(services.length / itemsPerPage);
  const currentServices = services.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const breadcrumbItems = [
    { label: 'Services', current: true }
  ];

  const categoryOptions = [
    { value: '', label: 'Toutes les catégories' },
    { value: 'dev', label: 'Développement' },
    { value: 'design', label: 'Design' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'writing', label: 'Rédaction' }
  ];

  const searchSuggestions = [
    { id: '1', text: 'Développement web', type: 'suggestion' as const },
    { id: '2', text: 'Design logo', type: 'recent' as const },
    { id: '3', text: 'Marketing digital', type: 'suggestion' as const }
  ];

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await serviceService.getServices({});
      setServices(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    // Ici vous pourriez filtrer les services selon la requête
  };

  const handleContactService = (service: Service) => {
    console.log('Contacter le service:', service.id);
  };

  const handleViewService = (service: Service) => {
    console.log('Voir le service:', service.id);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Services disponibles</h1>
          <p className="text-gray-600 mt-1">
            Découvrez {services.length} services proposés par notre communauté
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
            icon={<Grid className="w-4 h-4" />}
          />
          <Button
            variant={viewMode === 'list' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
            icon={<List className="w-4 h-4" />}
          />
        </div>
      </div>

      {/* Search and Filters */}
      <AnimatedCard>
        <div className="space-y-4">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={handleSearch}
            placeholder="Rechercher un service..."
            suggestions={searchSuggestions}
            loading={loading}
          />
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Dropdown
                options={categoryOptions}
                value={selectedCategory}
                onChange={setSelectedCategory}
                placeholder="Catégorie"
              />
            </div>
            
            <div className="flex-1">
              <Dropdown
                options={[
                  { value: 'all', label: 'Tous les types' },
                  { value: 'offer', label: 'Offres' },
                  { value: 'request', label: 'Demandes' }
                ]}
                value={serviceType}
                onChange={setServiceType}
                placeholder="Type de service"
              />
            </div>
            
            <Button
              variant="secondary"
              icon={<Filter className="w-4 h-4" />}
            >
              Plus de filtres
            </Button>
          </div>
        </div>
      </AnimatedCard>

      {/* Services Tabs */}
      <Tabs
        tabs={[
          { id: 'all', label: 'Tous', icon: <Grid className="w-4 h-4" /> },
          { id: 'offers', label: 'Offres', icon: <Grid className="w-4 h-4" /> },
          { id: 'requests', label: 'Demandes', icon: <List className="w-4 h-4" /> }
        ]}
        defaultTab="all"
        onChange={(tabId) => console.log('Tab changed:', tabId)}
      >
        <TabPanel tabId="all">
          <ServiceGrid
            services={currentServices}
            loading={loading}
            onContact={handleContactService}
            onView={handleViewService}
            emptyMessage="Aucun service trouvé pour vos critères"
          />
        </TabPanel>
        
        <TabPanel tabId="offers">
          <ServiceGrid
            services={currentServices.filter(s => s.type === 'offer')}
            loading={loading}
            onContact={handleContactService}
            onView={handleViewService}
            emptyMessage="Aucune offre de service trouvée"
          />
        </TabPanel>
        
        <TabPanel tabId="requests">
          <ServiceGrid
            services={currentServices.filter(s => s.type === 'request')}
            loading={loading}
            onContact={handleContactService}
            onView={handleViewService}
            emptyMessage="Aucune demande de service trouvée"
          />
        </TabPanel>
      </Tabs>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

export default ServicesPage;