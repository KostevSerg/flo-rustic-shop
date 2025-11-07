import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface CheckoutPromoSectionProps {
  promoCode: string;
  setPromoCode: (code: string) => void;
  appliedPromo: { code: string; discount_percent: number } | null;
  checkingPromo: boolean;
  onApply: () => void;
  onRemove: () => void;
}

const CheckoutPromoSection = ({
  promoCode,
  setPromoCode,
  appliedPromo,
  checkingPromo,
  onApply,
  onRemove
}: CheckoutPromoSectionProps) => {
  return (
    <div className="bg-card rounded-lg p-6 border border-border">
      <h2 className="text-xl font-semibold mb-4">Промокод</h2>
      {!appliedPromo ? (
        <div className="flex gap-2">
          <input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
            placeholder="Введите промокод"
            className="flex-1 px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={checkingPromo}
          />
          <Button 
            onClick={onApply}
            disabled={checkingPromo || !promoCode.trim()}
          >
            {checkingPromo ? 'Проверка...' : 'Применить'}
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2">
            <Icon name="Check" size={20} className="text-green-600 dark:text-green-400" />
            <div>
              <p className="font-semibold text-green-700 dark:text-green-300">{appliedPromo.code}</p>
              <p className="text-sm text-green-600 dark:text-green-400">Скидка {appliedPromo.discount_percent}%</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onRemove}
          >
            <Icon name="X" size={18} />
          </Button>
        </div>
      )}
    </div>
  );
};

export default CheckoutPromoSection;
