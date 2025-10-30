import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import API_ENDPOINTS from '@/config/api';

interface SettlementBulkImportProps {
  cityId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const SettlementBulkImport = ({ cityId, onSuccess, onCancel }: SettlementBulkImportProps) => {
  const { toast } = useToast();
  const [bulkData, setBulkData] = useState('');

  const handleBulkImport = async () => {
    if (!bulkData.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Введите данные для импорта',
        variant: 'destructive'
      });
      return;
    }

    const lines = bulkData.trim().split('\n');
    const settlements = [];
    let hasErrors = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const parts = line.split(/[,;\t]/).map(p => p.trim());
      
      if (parts.length < 1) {
        toast({
          title: 'Ошибка',
          description: `Строка ${i + 1}: неверный формат`,
          variant: 'destructive'
        });
        hasErrors = true;
        break;
      }

      const name = parts[0];
      const delivery_price = parts.length > 1 ? parseFloat(parts[1]) || 0 : 0;

      if (!name) {
        toast({
          title: 'Ошибка',
          description: `Строка ${i + 1}: не указано название`,
          variant: 'destructive'
        });
        hasErrors = true;
        break;
      }

      settlements.push({ name, delivery_price });
    }

    if (hasErrors || settlements.length === 0) {
      return;
    }

    try {
      const response = await fetch(`${API_ENDPOINTS.cities}?action=settlements_bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          city_id: parseInt(cityId),
          settlements
        })
      });

      if (response.ok) {
        toast({
          title: 'Успешно',
          description: `Добавлено ${settlements.length} населенных пунктов`
        });
        setBulkData('');
        onSuccess();
      } else {
        throw new Error('Failed to bulk import');
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось импортировать данные',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="bg-card rounded-lg p-6 mb-6 border-2 border-primary">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Массовая загрузка населённых пунктов</h2>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <Icon name="X" size={18} />
        </Button>
      </div>
      <div className="space-y-4">
        <div className="bg-muted/50 p-4 rounded-lg text-sm">
          <p className="font-semibold mb-2">Формат данных:</p>
          <p className="text-muted-foreground mb-2">
            Вставьте список населённых пунктов — по одному на строку.
          </p>
          <p className="text-muted-foreground mb-2">
            Формат: <code className="bg-background px-2 py-1 rounded">Название, Цена</code>
          </p>
          <p className="text-muted-foreground mb-3">
            Разделители: запятая, точка с запятой или табуляция
          </p>
          <div className="bg-background p-3 rounded font-mono text-xs">
            <div>Центральный район, 500</div>
            <div>Северный район; 600</div>
            <div>Южный район&nbsp;&nbsp;&nbsp;&nbsp;700</div>
            <div>Западный (без цены)</div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            Данные для импорта
          </label>
          <textarea
            className="w-full min-h-[300px] p-4 border rounded-lg font-mono text-sm resize-y"
            value={bulkData}
            onChange={(e) => setBulkData(e.target.value)}
            placeholder="Вставьте список населённых пунктов..."
          />
        </div>
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={() => {
            setBulkData('');
            onCancel();
          }}>
            Отмена
          </Button>
          <Button onClick={handleBulkImport}>
            <Icon name="Upload" size={18} className="mr-2" />
            Импортировать
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettlementBulkImport;
