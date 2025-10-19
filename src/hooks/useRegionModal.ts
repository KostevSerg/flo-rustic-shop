import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import API_ENDPOINTS from '@/config/api';

interface Region {
  id: number;
  name: string;
  is_active: boolean;
}

export const useRegionModal = (refetchData: () => void) => {
  const { toast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [editingRegion, setEditingRegion] = useState<Region | null>(null);
  const [formData, setFormData] = useState({ name: '' });
  const [saving, setSaving] = useState(false);

  const openAddModal = () => {
    setEditingRegion(null);
    setFormData({ name: '' });
    setShowModal(true);
  };

  const openEditModal = (region: Region) => {
    setEditingRegion(region);
    setFormData({ name: region.name });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingRegion(null);
    setFormData({ name: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Введите название региона',
        variant: 'destructive'
      });
      return;
    }

    setSaving(true);
    try {
      const url = editingRegion
        ? `${API_ENDPOINTS.cities}?action=update-region&id=${editingRegion.id}`
        : `${API_ENDPOINTS.cities}?action=add-region`;

      const response = await fetch(url, {
        method: editingRegion ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name.trim() })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: 'Успешно',
          description: editingRegion ? 'Регион обновлен' : 'Регион создан'
        });
        closeModal();
        refetchData();
      } else {
        throw new Error(data.error || 'Operation failed');
      }
    } catch (error) {
      console.error('Failed to save region:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить регион',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  return {
    showModal,
    editingRegion,
    formData,
    saving,
    openAddModal,
    openEditModal,
    closeModal,
    handleSubmit,
    setFormData
  };
};
