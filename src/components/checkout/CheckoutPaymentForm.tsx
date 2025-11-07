import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import API_ENDPOINTS from '@/config/api';

interface CheckoutPaymentFormProps {
  paymentMethod: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CheckoutPaymentForm = ({ paymentMethod, onChange }: CheckoutPaymentFormProps) => {
  const [paymentInfoText, setPaymentInfoText] = useState('');

  useEffect(() => {
    const fetchPaymentInfo = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.siteTexts);
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
    <div className="bg-card rounded-lg p-3 md:p-4 space-y-2 md:space-y-3">
      <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2">
        <Icon name="CreditCard" size={18} className="text-primary" />
        Оплата
      </h2>
      <div className="space-y-2">
        <label className="flex items-center gap-2 p-2 md:p-3 border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors">
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
        <div className="mt-2 p-3 bg-accent/10 rounded-lg border border-accent/30">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {paymentInfoText}
          </p>
        </div>
      )}
    </div>
  );
};

export default CheckoutPaymentForm;