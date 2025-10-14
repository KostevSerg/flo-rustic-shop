import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';

interface CheckoutPaymentFormProps {
  paymentMethod: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CheckoutPaymentForm = ({ paymentMethod, onChange }: CheckoutPaymentFormProps) => {
  const [paymentInfoText, setPaymentInfoText] = useState('');

  useEffect(() => {
    const fetchPaymentInfo = async () => {
      try {
        const response = await fetch('https://functions.poehali.dev/27d94d36-d1b7-4d70-b481-1c9d30e56c2c');
        const data = await response.json();
        const paymentInfo = data.texts?.find((t: any) => t.page === 'checkout' && t.key === 'payment_info');
        if (paymentInfo) {
          setPaymentInfoText(paymentInfo.value);
        }
      } catch (error) {
        console.error('Failed to fetch payment info:', error);
      }
    };
    fetchPaymentInfo();
  }, []);

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
      {paymentInfoText && (
        <div className="mt-4 p-4 bg-accent/10 rounded-lg border border-accent/30">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {paymentInfoText}
          </p>
        </div>
      )}
    </div>
  );
};

export default CheckoutPaymentForm;