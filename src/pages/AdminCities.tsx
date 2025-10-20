import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import AdminAuth from '@/components/AdminAuth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import RegionCard from '@/components/admin/RegionCard';
import RegionModal from '@/components/admin/RegionModal';
import CityModal from '@/components/admin/CityModal';
import { useRegionsAndCities } from '@/hooks/useRegionsAndCities';
import { useRegionModal } from '@/hooks/useRegionModal';
import { useCityModal } from '@/hooks/useCityModal';

type FilterType = 'all' | 'active' | 'hidden';

const AdminCities = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAdminAuth();
  const { totalItems } = useCart();

  const {
    regions,
    loading,
    expandedRegions,
    toggleRegion,
    deleteRegion,
    deleteCity,
    toggleRegionVisibility,
    toggleCityVisibility,
    refetchData
  } = useRegionsAndCities(isAuthenticated);

  const regionModal = useRegionModal(refetchData);
  const cityModal = useCityModal(refetchData);
  const [filter, setFilter] = useState<FilterType>('all');

  const handleManageSettlements = (cityId: number, cityName: string) => {
    navigate(`/admin/city-settlements?city_id=${cityId}&city_name=${encodeURIComponent(cityName)}`);
  };

  const filteredRegions = regions.filter(region => {
    if (filter === 'active') return region.is_active;
    if (filter === 'hidden') return !region.is_active;
    return true;
  });

  const stats = {
    total: regions.length,
    active: regions.filter(r => r.is_active).length,
    hidden: regions.filter(r => !r.is_active).length
  };

  return (
    <AdminAuth>
      <div className="min-h-screen flex flex-col bg-background">
        <Header cartCount={totalItems} />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/admin')}
                  className="flex items-center"
                >
                  <Icon name="ArrowLeft" size={20} className="mr-2" />
                  Назад
                </Button>
                <h1 className="text-3xl font-bold">Регионы и города</h1>
              </div>
              <Button onClick={regionModal.openAddModal}>
                <Icon name="Plus" size={20} className="mr-2" />
                Добавить регион
              </Button>
            </div>
            
            <div className="flex items-center gap-2 bg-card p-3 rounded-lg border">
              <span className="text-sm text-muted-foreground font-medium">Показать:</span>
              <Button
                variant={filter === 'all' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                Все ({stats.total})
              </Button>
              <Button
                variant={filter === 'active' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setFilter('active')}
              >
                <Icon name="Eye" size={16} className="mr-1" />
                Активные ({stats.active})
              </Button>
              <Button
                variant={filter === 'hidden' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setFilter('hidden')}
              >
                <Icon name="EyeOff" size={16} className="mr-1" />
                Скрытые ({stats.hidden})
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin mx-auto mb-3 w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
              <p className="text-muted-foreground">Загрузка...</p>
            </div>
          ) : regions.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-lg border">
              <Icon name="MapPin" size={48} className="mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg text-muted-foreground mb-4">Регионов пока нет</p>
              <Button onClick={regionModal.openAddModal}>
                <Icon name="Plus" size={20} className="mr-2" />
                Создать первый регион
              </Button>
            </div>
          ) : filteredRegions.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-lg border">
              <Icon name="Filter" size={48} className="mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg text-muted-foreground mb-2">Нет регионов в этой категории</p>
              <p className="text-sm text-muted-foreground mb-4">Попробуйте изменить фильтр</p>
              <Button variant="outline" onClick={() => setFilter('all')}>
                Показать все
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRegions.map(region => (
                <RegionCard
                  key={region.id}
                  region={region}
                  isExpanded={expandedRegions.includes(region.id)}
                  onToggle={() => toggleRegion(region.id)}
                  onAddCity={() => cityModal.openAddModal(region.id)}
                  onEdit={() => regionModal.openEditModal(region)}
                  onDelete={() => deleteRegion(region.id, region.name)}
                  onEditCity={cityModal.openEditModal}
                  onDeleteCity={deleteCity}
                  onManageSettlements={handleManageSettlements}
                  onToggleRegionVisibility={toggleRegionVisibility}
                  onToggleCityVisibility={toggleCityVisibility}
                />
              ))}
            </div>
          )}
        </main>
        <Footer />
      </div>

      <RegionModal
        isOpen={regionModal.showModal}
        editingRegion={regionModal.editingRegion}
        formData={regionModal.formData}
        saving={regionModal.saving}
        onClose={regionModal.closeModal}
        onSubmit={regionModal.handleSubmit}
        onChange={(name) => regionModal.setFormData({ name })}
      />

      <CityModal
        isOpen={cityModal.showModal}
        editingCity={cityModal.editingCity}
        formData={cityModal.formData}
        saving={cityModal.saving}
        onClose={cityModal.closeModal}
        onSubmit={cityModal.handleSubmit}
        onChange={(field, value) => cityModal.setFormData({ ...cityModal.formData, [field]: value })}
      />
    </AdminAuth>
  );
};

export default AdminCities;