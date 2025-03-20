
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';
import { getLocale, setLocale, getAvailableLocales } from '@/utils/localization';

const LANGUAGE_NAMES = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  ja: '日本語'
};

const LANGUAGE_FLAGS = {
  en: '🇺🇸',
  es: '🇪🇸',
  fr: '🇫🇷',
  de: '🇩🇪',
  ja: '🇯🇵'
};

const LanguageSelector = () => {
  const [currentLocale, setCurrentLocale] = useState(getLocale());
  
  useEffect(() => {
    const handleLocaleChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      setCurrentLocale(customEvent.detail.locale);
    };
    
    window.addEventListener('localeChange', handleLocaleChange);
    return () => {
      window.removeEventListener('localeChange', handleLocaleChange);
    };
  }, []);
  
  const handleSelectLanguage = (locale: string) => {
    setLocale(locale as any);
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-1">
          <Globe className="h-4 w-4" />
          <span className="hidden md:inline">{LANGUAGE_NAMES[currentLocale]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Select Language</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {getAvailableLocales().map((locale) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => handleSelectLanguage(locale)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <span>{LANGUAGE_FLAGS[locale]}</span>
            <span>{LANGUAGE_NAMES[locale]}</span>
            {locale === currentLocale && (
              <span className="ml-auto text-primary">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
