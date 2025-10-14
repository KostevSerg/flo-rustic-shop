import Icon from '@/components/ui/icon';

interface Product {
  id: number;
  name: string;
  base_price: number;
}

interface City {
  id: number;
  name: string;
  region: string;
}

interface CityPriceModalProps {
  selectedProduct: Product;
  cities: Record<string, City[]>;
  onClose: () => void;
  onSetPrice: (cityId: number, cityName: string, price: string) => void;
}

const CityPriceModal = ({ selectedProduct, cities, onClose, onSetPrice }: CityPriceModalProps) => {
  return (
    <>
      <div
        className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-[90vw] max-w-3xl bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Цены для "{selectedProduct.name}"</h3>
            <button
              onClick={onClose}
              className="hover:bg-accent/50 rounded-lg p-2 transition-colors"
            >
              <Icon name="X" size={24} />
            </button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Базовая цена: {selectedProduct.base_price} ₽
          </p>
        </div>
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {Object.entries(cities).map(([region, regionCities]) => (
            <div key={region} className="mb-6 last:mb-0">
              <h4 className="font-semibold mb-3 flex items-center">
                <Icon name="MapPin" size={18} className="mr-2 text-primary" />
                {region}
              </h4>
              <div className="space-y-2">
                {regionCities.map((city) => (
                  <div key={city.id} className="flex items-center gap-3 p-3 bg-accent/20 rounded-lg">
                    <span className="flex-1">{city.name}</span>
                    <input
                      type="number"
                      placeholder={`${selectedProduct.base_price}`}
                      className="w-32 px-3 py-1 rounded border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                      onBlur={(e) => {
                        if (e.target.value) {
                          onSetPrice(city.id, city.name, e.target.value);
                        }
                      }}
                    />
                    <span className="text-muted-foreground">₽</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default CityPriceModal;
