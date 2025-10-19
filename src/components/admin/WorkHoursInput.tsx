import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface DaySchedule {
  from: string;
  to: string;
}

interface WorkHours {
  monday?: DaySchedule;
  tuesday?: DaySchedule;
  wednesday?: DaySchedule;
  thursday?: DaySchedule;
  friday?: DaySchedule;
  saturday?: DaySchedule;
  sunday?: DaySchedule;
}

interface WorkHoursInputProps {
  value: WorkHours | null;
  onChange: (value: WorkHours | null) => void;
}

const DAYS = [
  { key: 'monday', label: 'Понедельник' },
  { key: 'tuesday', label: 'Вторник' },
  { key: 'wednesday', label: 'Среда' },
  { key: 'thursday', label: 'Четверг' },
  { key: 'friday', label: 'Пятница' },
  { key: 'saturday', label: 'Суббота' },
  { key: 'sunday', label: 'Воскресенье' }
];

const WorkHoursInput = ({ value, onChange }: WorkHoursInputProps) => {
  const [workHours, setWorkHours] = useState<WorkHours>(value || {});
  const [useSchedule, setUseSchedule] = useState(!!value && Object.keys(value).length > 0);

  useEffect(() => {
    if (value && Object.keys(value).length > 0) {
      setWorkHours(value);
      setUseSchedule(true);
    }
  }, [value]);

  const handleToggleSchedule = () => {
    const newState = !useSchedule;
    setUseSchedule(newState);
    
    if (newState) {
      const defaultSchedule: WorkHours = {
        monday: { from: '09:00', to: '21:00' },
        tuesday: { from: '09:00', to: '21:00' },
        wednesday: { from: '09:00', to: '21:00' },
        thursday: { from: '09:00', to: '21:00' },
        friday: { from: '09:00', to: '21:00' },
        saturday: { from: '10:00', to: '20:00' },
        sunday: { from: '10:00', to: '20:00' }
      };
      setWorkHours(defaultSchedule);
      onChange(defaultSchedule);
    } else {
      setWorkHours({});
      onChange(null);
    }
  };

  const handleTimeChange = (day: string, field: 'from' | 'to', value: string) => {
    const updated = {
      ...workHours,
      [day]: {
        ...(workHours[day as keyof WorkHours] || { from: '09:00', to: '21:00' }),
        [field]: value
      }
    };
    setWorkHours(updated);
    onChange(updated);
  };

  const copyToAll = (day: string) => {
    const schedule = workHours[day as keyof WorkHours];
    if (!schedule) return;

    const updated: WorkHours = {};
    DAYS.forEach(d => {
      updated[d.key as keyof WorkHours] = { ...schedule };
    });
    setWorkHours(updated);
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium">Часы работы</label>
        <Button
          type="button"
          variant={useSchedule ? 'default' : 'outline'}
          size="sm"
          onClick={handleToggleSchedule}
        >
          <Icon name={useSchedule ? 'Check' : 'Plus'} size={14} className="mr-1" />
          {useSchedule ? 'Расписание включено' : 'Добавить расписание'}
        </Button>
      </div>

      {useSchedule && (
        <div className="border rounded-lg p-4 space-y-3 bg-accent/5">
          {DAYS.map(({ key, label }) => (
            <div key={key} className="flex items-center gap-3">
              <div className="w-28 text-sm font-medium">{label}</div>
              <div className="flex items-center gap-2">
                <input
                  type="time"
                  value={workHours[key as keyof WorkHours]?.from || '09:00'}
                  onChange={(e) => handleTimeChange(key, 'from', e.target.value)}
                  className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
                <span className="text-muted-foreground">—</span>
                <input
                  type="time"
                  value={workHours[key as keyof WorkHours]?.to || '21:00'}
                  onChange={(e) => handleTimeChange(key, 'to', e.target.value)}
                  className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => copyToAll(key)}
                title="Скопировать на все дни"
              >
                <Icon name="Copy" size={14} />
              </Button>
            </div>
          ))}
        </div>
      )}

      {!useSchedule && (
        <p className="text-sm text-muted-foreground">
          Расписание не задано - город работает круглосуточно
        </p>
      )}
    </div>
  );
};

export default WorkHoursInput;
