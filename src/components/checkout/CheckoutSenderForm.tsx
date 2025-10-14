import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface CheckoutSenderFormProps {
  senderName: string;
  senderPhone: string;
  email: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CheckoutSenderForm = ({ senderName, senderPhone, email, onChange }: CheckoutSenderFormProps) => {
  return (
    <div className="bg-card rounded-lg p-6 space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Icon name="UserCheck" size={20} className="text-primary" />
        Отправитель (необязательно)
      </h2>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Ваше имя</label>
          <Input
            name="senderName"
            value={senderName}
            onChange={onChange}
            placeholder="Иван Иванов"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Ваш телефон</label>
          <Input
            type="tel"
            name="senderPhone"
            value={senderPhone}
            onChange={onChange}
            placeholder="+7 (999) 123-45-67"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Email для чека</label>
        <Input
          type="email"
          name="email"
          value={email}
          onChange={onChange}
          placeholder="email@example.com"
        />
      </div>
    </div>
  );
};

export default CheckoutSenderForm;
