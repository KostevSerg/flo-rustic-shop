import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface CheckoutRecipientFormProps {
  recipientName: string;
  recipientPhone: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CheckoutRecipientForm = ({ recipientName, recipientPhone, onChange }: CheckoutRecipientFormProps) => {
  return (
    <div className="bg-card rounded-lg p-6 space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Icon name="User" size={20} className="text-primary" />
        Получатель
      </h2>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Имя получателя <span className="text-destructive">*</span>
          </label>
          <Input
            name="recipientName"
            value={recipientName}
            onChange={onChange}
            placeholder="Анна Петрова"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Телефон получателя <span className="text-destructive">*</span>
          </label>
          <Input
            type="tel"
            name="recipientPhone"
            value={recipientPhone}
            onChange={onChange}
            placeholder="+7 (999) 123-45-67"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default CheckoutRecipientForm;
