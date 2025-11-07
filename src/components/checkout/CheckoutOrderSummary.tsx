interface CheckoutOrderSummaryProps {
  totalPrice: number;
  deliveryPrice: number;
  subtotal: number;
  finalPrice: number;
  discountAmount?: number;
  appliedPromo?: { code: string; discount_percent: number } | null;
}

const CheckoutOrderSummary = ({
  totalPrice,
  deliveryPrice,
  subtotal,
  finalPrice,
  discountAmount,
  appliedPromo
}: CheckoutOrderSummaryProps) => {
  return (
    <div className="bg-card rounded-lg p-4 md:p-6 border border-border">
      <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Итого</h2>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Товары:</span>
          <span className="font-medium">{totalPrice} ₽</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Доставка:</span>
          <span className="font-medium">
            {deliveryPrice > 0 ? `${deliveryPrice} ₽` : 'Бесплатно'}
          </span>
        </div>
        {appliedPromo && discountAmount && discountAmount > 0 && (
          <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
            <span>Скидка ({appliedPromo.code} -{appliedPromo.discount_percent}%):</span>
            <span className="font-medium">-{discountAmount} ₽</span>
          </div>
        )}
        <div className="flex justify-between text-lg font-bold pt-2 border-t">
          <span>Итого:</span>
          <span>{finalPrice} ₽</span>
        </div>
      </div>
    </div>
  );
};

export default CheckoutOrderSummary;