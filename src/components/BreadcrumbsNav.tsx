import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Icon from '@/components/ui/icon';

interface BreadcrumbItem {
  name: string;
  path?: string;
}

interface BreadcrumbsNavProps {
  items: BreadcrumbItem[];
}

const BreadcrumbsNav = ({ items }: BreadcrumbsNavProps) => {
  const breadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Главная",
        "item": "https://florustic.ru/"
      },
      ...items.map((item, index) => {
        const position = index + 2;
        const breadcrumbItem: any = {
          "@type": "ListItem",
          "position": position,
          "name": item.name
        };
        
        if (item.path) {
          breadcrumbItem.item = `https://florustic.ru${item.path}`;
        }
        
        return breadcrumbItem;
      })
    ]
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbList)}
        </script>
      </Helmet>
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-primary transition">
          Главная
        </Link>
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-1.5">
            <Icon name="ChevronRight" size={12} />
            {item.path ? (
              <Link to={item.path} className="hover:text-primary transition">
                {item.name}
              </Link>
            ) : (
              <span className="text-foreground font-medium">{item.name}</span>
            )}
          </div>
        ))}
      </nav>
    </>
  );
};

export default BreadcrumbsNav;