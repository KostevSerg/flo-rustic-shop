import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';

interface BreadcrumbItem {
  name: string;
  path?: string;
}

interface BreadcrumbsNavProps {
  items: BreadcrumbItem[];
}

const BreadcrumbsNav = ({ items }: BreadcrumbsNavProps) => {
  const breadcrumbJson = useMemo(() => {
    const list = {
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
          const entry: Record<string, string | number> = {
            "@type": "ListItem",
            "position": index + 2,
            "name": item.name
          };
          if (item.path) {
            entry.item = `https://florustic.ru${item.path}`;
          }
          return entry;
        })
      ]
    };
    return JSON.stringify(list);
  }, [items]);

  useEffect(() => {
    const scriptId = 'breadcrumbs-jsonld';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = breadcrumbJson;

    return () => {
      script?.remove();
    };
  }, [breadcrumbJson]);

  return (
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
  );
};

export default BreadcrumbsNav;