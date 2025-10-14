import Icon from '@/components/ui/icon';

interface CheckoutPaymentFormProps {
  paymentMethod: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CheckoutPaymentForm = ({ paymentMethod, onChange }: CheckoutPaymentFormProps) => {
  return (
    <div className="bg-card rounded-lg p-6 space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Icon name="CreditCard" size={20} className="text-primary" />
        Оплата
      </h2>
      <div className="space-y-3">
        <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors">
          <input
            type="radio"
            name="paymentMethod"
            value="cash"
            checked={paymentMethod === 'cash'}
            onChange={onChange}
            className="w-4 h-4"
          />
          <div className="flex items-center gap-2">
            <Icon name="Banknote" size={18} />
            <span>Наличными при получении</span>
          </div>
        </label>
        <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors">
          <input
            type="radio"
            name="paymentMethod"
            value="card-courier"
            checked={paymentMethod === 'card-courier'}
            onChange={onChange}
            className="w-4 h-4"
          />
          <div className="flex items-center gap-2">
            <Icon name="CreditCard" size={18} />
            <span>Картой курьеру</span>
          </div>
        </label>
        <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors">
          <input
            type="radio"
            name="paymentMethod"
            value="online"
            checked={paymentMethod === 'online'}
            onChange={onChange}
            className="w-4 h-4"
          />
          <div className="flex items-center gap-2">
            <Icon name="Smartphone" size={18} />
            <span>Онлайн на сайте</span>
          </div>
        </label>
      </div>
    </div>
  );
};

export default CheckoutPaymentForm;
