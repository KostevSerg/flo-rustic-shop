import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface WorkHours {
  from: string;
  to: string;
}

interface WorkHoursEditorProps {
  workHours: WorkHours;
  onSave: (workHours: WorkHours) => void;
  onCancel: () => void;
}

const WorkHoursEditor = ({ workHours, onSave, onCancel }: WorkHoursEditorProps) => {
  const [editedHours, setEditedHours] = useState<WorkHours>(workHours);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedHours);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-xl font-bold mb-4 flex items-center">
        <Icon name="Clock" size={20} className="mr-2" />
        График работы
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Время начала работы</label>
            <input
              type="time"
              value={editedHours.from}
              onChange={(e) => setEditedHours({ ...editedHours, from: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Время окончания работы</label>
            <input
              type="time"
              value={editedHours.to}
              onChange={(e) => setEditedHours({ ...editedHours, to: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          График работы будет применен ко всем дням недели
        </p>
        <div className="flex gap-3">
          <Button type="submit">
            <Icon name="Save" size={18} className="mr-2" />
            Сохранить график
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Отмена
          </Button>
        </div>
      </form>
    </div>
  );
};

export default WorkHoursEditor;
