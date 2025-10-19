import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import API_ENDPOINTS from '@/config/api';

interface City {
  id: number;
  name: string;
  region_id: number;
  timezone: string;
  work_hours?: any;
}

export const useCityModal = (refetchData: () => void) => {
  const { toast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [selectedRegionId, setSelectedRegionId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    timezone: 'Europe/Moscow',
    work_hours: ''
  });
  const [saving, setSaving] = useState(false);

  const openAddModal = (regionId: number) => {
    setEditingCity(null);
    setSelectedRegionId(regionId);
    setFormData({
      name: '',
      timezone: 'Europe/Moscow',
      work_hours: ''
    });
    setShowModal(true);
  };

  const openEditModal = (city: City) => {
    setEditingCity(city);
    setSelectedRegionId(city.region_id);
    setFormData({
      name: city.name,
      timezone: city.timezone || 'Europe/Moscow',
      work_hours: city.work_hours || ''
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCity(null);
    setSelectedRegionId(null);
    setFormData({
      name: '',
      timezone: 'Europe/Moscow',
      work_hours: ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !selectedRegionId) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все обязательные поля',
        variant: 'destructive'
      });
      return;
    }

    setSaving(true);
    try {
      const url = editingCity
        ? `${API_ENDPOINTS.cities}?action=update&id=${editingCity.id}`
        : `${API_ENDPOINTS.cities}?action=add`;

      const response = await fetch(url, {
        method: editingCity ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          region_id: selectedRegionId,
          timezone: formData.timezone,
          work_hours: formData.work_hours.trim()
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: 'Успешно',
          description: editingCity ? 'Город обновлен' : 'Город добавлен'
        });
        closeModal();
        refetchData();
      } else {
        throw new Error(data.error || 'Operation failed');
      }
    } catch (error) {
      console.error('Failed to save city:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить город',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  return {
    showModal,
    editingCity,
    formData,
    saving,
    openAddModal,
    openEditModal,
    closeModal,
    handleSubmit,
    setFormData
  };
};
