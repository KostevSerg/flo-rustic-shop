import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface Subcategory {
  id: number;
  name: string;
  category: string;
}

type Category = 'Цветы' | 'Шары' | 'Подарки';

interface CityHeaderProps {
  cityName: string;
  activeCategory: Category;
  activeSubcategory: number | null;
  subcategories: Subcategory[];
  onCategoryChange: (category: Category) => void;
  onSubcategoryChange: (subcategoryId: number | null) => void;
}

const createSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/ё/g, 'e')
    .replace(/ /g, '-')
    .replace(/а/g, 'a').replace(/б/g, 'b').replace(/в/g, 'v').replace(/г/g, 'g')
    .replace(/д/g, 'd').replace(/е/g, 'e').replace(/ж/g, 'zh').replace(/з/g, 'z')
    .replace(/и/g, 'i').replace(/й/g, 'j').replace(/к/g, 'k').replace(/л/g, 'l')
    .replace(/м/g, 'm').replace(/н/g, 'n').replace(/о/g, 'o').replace(/п/g, 'p')
    .replace(/р/g, 'r').replace(/с/g, 's').replace(/т/g, 't').replace(/у/g, 'u')
    .replace(/ф/g, 'f').replace(/х/g, 'h').replace(/ц/g, 'c').replace(/ч/g, 'ch')
    .replace(/ш/g, 'sh').replace(/щ/g, 'sch').replace(/ъ/g, '').replace(/ы/g, 'y')
    .replace(/ь/g, '').replace(/э/g, 'e').replace(/ю/g, 'yu').replace(/я/g, 'ya');
};

const CityHeader = ({
  cityName,
  activeCategory,
  activeSubcategory,
  subcategories,
  onCategoryChange,
  onSubcategoryChange
}: CityHeaderProps) => {
  const navigate = useNavigate();
  const citySlug = createSlug(cityName);

  return (
    <div className="text-center mb-12">
      <div className="flex justify-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
        >
          <Icon name="ArrowLeft" size={18} className="mr-2" />
          Назад
        </Button>
        <Button 
          variant="outline" 
          onClick={() => navigate(`/city/${citySlug}/delivery`)}
        >
          <Icon name="Truck" size={18} className="mr-2" />
          Доставка и цены
        </Button>
      </div>
      <h1 className="text-5xl font-bold mb-4">
        Купить цветы в {cityName} с доставкой
      </h1>
      <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-4">
        <strong>FloRustic</strong> — профессиональная доставка свежих букетов по городу {cityName}. 
        Работаем ежедневно с 9:00 до 21:00, доставка за 2 часа.
      </p>
      <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
        Розы, пионы, тюльпаны, орхидеи и другие сезонные цветы. 
        Выберите готовый букет из каталога или закажите индивидуальную композицию.
      </p>
      
      <div className="space-y-4">
        <div className="flex justify-center gap-4 flex-wrap">
          <Button
            variant={activeCategory === 'Цветы' ? 'default' : 'outline'}
            onClick={() => {
              onCategoryChange('Цветы');
              onSubcategoryChange(null);
            }}
            className="px-6"
          >
            Цветы
          </Button>
          <Button
            variant={activeCategory === 'Шары' ? 'default' : 'outline'}
            onClick={() => {
              onCategoryChange('Шары');
              onSubcategoryChange(null);
            }}
            className="px-6"
          >
            Шары
          </Button>
          <Button
            variant={activeCategory === 'Подарки' ? 'default' : 'outline'}
            onClick={() => {
              onCategoryChange('Подарки');
              onSubcategoryChange(null);
            }}
            className="px-6"
          >
            Подарки
          </Button>
        </div>
        
        {activeCategory === 'Цветы' && subcategories.length > 0 && (
          <div className="flex justify-center gap-2 flex-wrap">
            <Button
              variant={activeSubcategory === null ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => onSubcategoryChange(null)}
            >
              Все цветы
            </Button>
            {subcategories.map(sub => (
              <Button
                key={sub.id}
                variant={activeSubcategory === sub.id ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => onSubcategoryChange(sub.id)}
              >
                {sub.name}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CityHeader;