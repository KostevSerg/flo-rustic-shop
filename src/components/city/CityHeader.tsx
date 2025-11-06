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
    <div className="text-center mb-6 md:mb-12">
      <div className="flex justify-center gap-2 md:gap-4 mb-4 md:mb-6">
        <Button 
          variant="ghost"
          size="sm"
          onClick={() => navigate('/')}
          className="text-xs md:text-sm"
        >
          <Icon name="ArrowLeft" size={16} className="md:mr-2" />
          <span className="hidden md:inline">Назад</span>
        </Button>
        <Button 
          variant="outline"
          size="sm"
          onClick={() => navigate(`/city/${citySlug}/delivery`)}
          className="text-xs md:text-sm"
        >
          <Icon name="Truck" size={16} className="md:mr-2" />
          <span className="hidden sm:inline">Доставка и цены</span>
          <span className="sm:hidden">Доставка</span>
        </Button>
      </div>
      <h1 className="text-2xl md:text-5xl font-bold mb-2 md:mb-4">
        Купить цветы в {cityName} с доставкой
      </h1>
      <p className="text-muted-foreground text-sm md:text-lg max-w-3xl mx-auto mb-2 md:mb-4 hidden md:block">
        <strong>FloRustic</strong> — профессиональная доставка свежих букетов по городу {cityName}. 
        Работаем ежедневно с 9:00 до 21:00, доставка за 2 часа.
      </p>
      <p className="text-muted-foreground text-xs md:text-base max-w-2xl mx-auto mb-4 md:mb-8 hidden md:block">
        Розы, пионы, тюльпаны, орхидеи и другие сезонные цветы. 
        Выберите готовый букет из каталога или закажите индивидуальную композицию.
      </p>
      
      <div className="space-y-3 md:space-y-4">
        <div className="flex justify-center gap-2 md:gap-4 flex-wrap">
          <Button
            variant={activeCategory === 'Цветы' ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              onCategoryChange('Цветы');
              onSubcategoryChange(null);
            }}
            className="px-3 md:px-6 text-xs md:text-sm"
          >
            Цветы
          </Button>
          <Button
            variant={activeCategory === 'Шары' ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              onCategoryChange('Шары');
              onSubcategoryChange(null);
            }}
            className="px-3 md:px-6 text-xs md:text-sm"
          >
            Шары
          </Button>
          <Button
            variant={activeCategory === 'Подарки' ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              onCategoryChange('Подарки');
              onSubcategoryChange(null);
            }}
            className="px-3 md:px-6 text-xs md:text-sm"
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