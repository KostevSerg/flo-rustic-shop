import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface City {
  id: number;
  name: string;
  region_id: number;
  timezone: string;
  work_hours?: any;
  is_active?: boolean;
}

interface Region {
  id: number;
  name: string;
  is_active: boolean;
  cities?: City[];
}

interface RegionCardProps {
  region: Region;
  isExpanded: boolean;
  onToggle: () => void;
  onAddCity: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onEditCity: (city: City) => void;
  onDeleteCity: (cityId: number, cityName: string) => void;
  onManageSettlements: (cityId: number, cityName: string) => void;
  onToggleRegionVisibility: (regionId: number, isActive: boolean) => void;
  onToggleCityVisibility: (cityId: number, isActive: boolean) => void;
}

const RegionCard = ({
  region,
  isExpanded,
  onToggle,
  onAddCity,
  onEdit,
  onDelete,
  onEditCity,
  onDeleteCity,
  onManageSettlements,
  onToggleRegionVisibility,
  onToggleCityVisibility
}: RegionCardProps) => {
  return (
    <div className={`bg-card rounded-lg border overflow-hidden ${!region.is_active ? 'opacity-60' : ''}`}>
      <div className="p-4 flex items-center justify-between bg-accent/20">
        <div className="flex items-center space-x-3 flex-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="p-1"
          >
            <Icon
              name={isExpanded ? 'ChevronDown' : 'ChevronRight'}
              size={20}
            />
          </Button>
          <Icon name="Map" size={24} className="text-primary" />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg">{region.name}</h3>
              {!region.is_active && (
                <span className="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded">
                  Скрыт
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {region.cities?.length || 0} {region.cities?.length === 1 ? 'город' : 'городов'}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onAddCity}
          >
            <Icon name="Plus" size={16} className="mr-1" />
            Город
          </Button>
          <Button
            variant={region.is_active ? "outline" : "default"}
            size="sm"
            onClick={() => onToggleRegionVisibility(region.id, !region.is_active)}
            title={region.is_active ? 'Скрыть регион' : 'Показать регион'}
          >
            <Icon name={region.is_active ? "EyeOff" : "Eye"} size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
          >
            <Icon name="Pencil" size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
          >
            <Icon name="Trash2" size={16} />
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 border-t">
          {region.cities && region.cities.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {region.cities.map(city => (
                <div
                  key={city.id}
                  className={`bg-background rounded-lg p-3 border flex items-center justify-between ${city.is_active === false ? 'opacity-50' : ''}`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{city.name}</p>
                      {city.is_active === false && (
                        <span className="text-xs px-1.5 py-0.5 bg-muted text-muted-foreground rounded">
                          Скрыт
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{city.timezone}</p>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onManageSettlements(city.id, city.name)}
                      title="Населённые пункты"
                    >
                      <Icon name="MapPin" size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onToggleCityVisibility(city.id, city.is_active === false)}
                      title={city.is_active === false ? 'Показать город' : 'Скрыть город'}
                    >
                      <Icon name={city.is_active === false ? "Eye" : "EyeOff"} size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditCity(city)}
                    >
                      <Icon name="Pencil" size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteCity(city.id, city.name)}
                    >
                      <Icon name="Trash2" size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p className="mb-3">В этом регионе пока нет городов</p>
              <Button
                variant="outline"
                size="sm"
                onClick={onAddCity}
              >
                <Icon name="Plus" size={16} className="mr-1" />
                Добавить город
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RegionCard;