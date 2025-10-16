import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface DaySchedule {
  from: string;
  to: string;
}

interface WorkHours {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

interface WorkHoursEditorProps {
  workHours: WorkHours;
  onSave: (workHours: WorkHours) => void;
  onCancel: () => void;
}

const dayNames: Record<keyof WorkHours, string> = {
  monday: 'Понедельник',
  tuesday: 'Вторник',
  wednesday: 'Среда',
  thursday: 'Четверг',
  friday: 'Пятница',
  saturday: 'Суббота',
  sunday: 'Воскресенье'
};

const WorkHoursEditor = ({ workHours, onSave, onCancel }: WorkHoursEditorProps) => {
  const [editedHours, setEditedHours] = useState<WorkHours>(workHours);

  const handleDayChange = (day: keyof WorkHours, field: 'from' | 'to', value: string) => {
    setEditedHours({
      ...editedHours,
      [day]: {
        ...editedHours[day],
        [field]: value
      }
    });
  };

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
        <div className="space-y-3 mb-4">
          {Object.entries(dayNames).map(([day, label]) => (
            <div key={day} className="grid grid-cols-[140px_1fr_1fr] gap-3 items-center">
              <span className="font-medium">{label}</span>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">С</label>
                <input
                  type="time"
                  value={editedHours[day as keyof WorkHours].from}
                  onChange={(e) => handleDayChange(day as keyof WorkHours, 'from', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">До</label>
                <input
                  type="time"
                  value={editedHours[day as keyof WorkHours].to}
                  onChange={(e) => handleDayChange(day as keyof WorkHours, 'to', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
            </div>
          ))}
        </div>
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
