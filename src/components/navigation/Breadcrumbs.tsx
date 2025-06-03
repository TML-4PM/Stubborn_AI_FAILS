
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  const getBreadcrumbLabel = (pathname: string, index: number) => {
    const routeLabels: Record<string, string> = {
      gallery: 'Gallery',
      search: 'Advanced Search',
      community: 'Community Hub',
      submit: 'Submit Fail',
      shop: 'Shop',
      profile: 'Profile',
      admin: 'Admin Panel',
      about: 'About',
      terms: 'Terms',
      privacy: 'Privacy',
      donate: 'Donate',
      youtube: 'YouTube',
      fail: 'Fail Details',
      user: 'User Profile'
    };

    // Handle dynamic routes
    if (pathname === 'fail' || pathname === 'user') {
      return routeLabels[pathname];
    }

    return routeLabels[pathname] || pathname.charAt(0).toUpperCase() + pathname.slice(1);
  };

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', href: '/', icon: Home }
  ];

  pathnames.forEach((pathname, index) => {
    const href = '/' + pathnames.slice(0, index + 1).join('/');
    const isLast = index === pathnames.length - 1;
    
    breadcrumbs.push({
      label: getBreadcrumbLabel(pathname, index),
      href: isLast ? undefined : href
    });
  });

  // Don't show breadcrumbs on home page
  if (pathnames.length === 0) return null;

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-4">
      {breadcrumbs.map((item, index) => {
        const isLast = index === breadcrumbs.length - 1;
        
        return (
          <div key={index} className="flex items-center">
            {index > 0 && <ChevronRight className="h-4 w-4 mx-1" />}
            
            {item.href ? (
              <Link
                to={item.href}
                className={cn(
                  "hover:text-foreground transition-colors flex items-center gap-1",
                  index === 0 && "text-primary"
                )}
              >
                {item.icon && <item.icon className="h-4 w-4" />}
                {item.label}
              </Link>
            ) : (
              <span className={cn(
                "text-foreground font-medium flex items-center gap-1",
                isLast && "text-foreground"
              )}>
                {item.icon && <item.icon className="h-4 w-4" />}
                {item.label}
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
