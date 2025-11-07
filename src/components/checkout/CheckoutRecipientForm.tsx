import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface CheckoutRecipientFormProps {
  recipientName: string;
  recipientPhone: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CheckoutRecipientForm = ({ recipientName, recipientPhone, onChange }: CheckoutRecipientFormProps) => {
  return (
    <div className="bg-card rounded-lg p-3 md:p-4 space-y-2 md:space-y-3">
      <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2">
        <Icon name="User" size={18} className="text-primary" />
        Получатель
      </h2>
      <div className="grid md:grid-cols-2 gap-3 md:gap-4">
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
            placeholder="+7 995 215-10-96"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default CheckoutRecipientForm;