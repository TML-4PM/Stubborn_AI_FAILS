
// Basic localization utility

type SupportedLocale = 'en' | 'es' | 'fr' | 'de' | 'ja';

interface Translations {
  [key: string]: {
    [locale in SupportedLocale]?: string;
  };
}

// Default translations
const translations: Translations = {
  // Common
  'app.name': {
    en: 'AI Oopsies',
    es: 'Errores de IA',
    fr: 'Erreurs d\'IA',
    de: 'KI-Fehler',
    ja: 'AI失敗集'
  },
  'app.tagline': {
    en: 'Where AI goes hilariously wrong',
    es: 'Donde la IA se equivoca de forma hilarante',
    fr: 'Quand l\'IA se trompe de façon hilarante',
    de: 'Wo KI auf urkomische Weise versagt',
    ja: 'AIがおかしな間違いをする場所'
  },
  
  // Navigation
  'nav.home': {
    en: 'Home',
    es: 'Inicio',
    fr: 'Accueil',
    de: 'Startseite',
    ja: 'ホーム'
  },
  'nav.gallery': {
    en: 'Gallery',
    es: 'Galería',
    fr: 'Galerie',
    de: 'Galerie',
    ja: 'ギャラリー'
  },
  'nav.submit': {
    en: 'Submit',
    es: 'Enviar',
    fr: 'Soumettre',
    de: 'Einreichen',
    ja: '投稿'
  },
  'nav.about': {
    en: 'About',
    es: 'Acerca de',
    fr: 'À propos',
    de: 'Über uns',
    ja: '当サイトについて'
  },
  
  // User actions
  'user.login': {
    en: 'Sign In',
    es: 'Iniciar sesión',
    fr: 'Se connecter',
    de: 'Anmelden',
    ja: 'ログイン'
  },
  'user.signup': {
    en: 'Sign Up',
    es: 'Registrarse',
    fr: 'S\'inscrire',
    de: 'Registrieren',
    ja: '登録'
  },
  'user.logout': {
    en: 'Sign Out',
    es: 'Cerrar sesión',
    fr: 'Se déconnecter',
    de: 'Abmelden',
    ja: 'ログアウト'
  },
  
  // Submission form
  'submit.title': {
    en: 'Submit Your AI Fail',
    es: 'Envía tu error de IA',
    fr: 'Soumettez votre erreur d\'IA',
    de: 'Reichen Sie Ihren KI-Fehler ein',
    ja: 'AIの失敗を投稿する'
  },
  'submit.button': {
    en: 'Submit AI Fail',
    es: 'Enviar error de IA',
    fr: 'Soumettre l\'erreur d\'IA',
    de: 'KI-Fehler einreichen',
    ja: 'AI失敗を投稿'
  },
  
  // Engagement
  'social.like': {
    en: 'Like',
    es: 'Me gusta',
    fr: 'J\'aime',
    de: 'Gefällt mir',
    ja: 'いいね'
  },
  'social.share': {
    en: 'Share',
    es: 'Compartir',
    fr: 'Partager',
    de: 'Teilen',
    ja: 'シェア'
  },
  'social.comment': {
    en: 'Comment',
    es: 'Comentar',
    fr: 'Commenter',
    de: 'Kommentieren',
    ja: 'コメント'
  }
};

// Current locale
let currentLocale: SupportedLocale = 'en';

// Get user's preferred locale from browser if available
const detectUserLocale = (): SupportedLocale => {
  const browserLang = navigator.language.split('-')[0];
  if (browserLang === 'en' || browserLang === 'es' || 
      browserLang === 'fr' || browserLang === 'de' || 
      browserLang === 'ja') {
    return browserLang as SupportedLocale;
  }
  return 'en'; // Default to English
};

// Initialize locale
export const initLocalization = () => {
  const savedLocale = localStorage.getItem('locale') as SupportedLocale;
  if (savedLocale) {
    currentLocale = savedLocale;
  } else {
    currentLocale = detectUserLocale();
    localStorage.setItem('locale', currentLocale);
  }
  
  // Set html lang attribute
  document.documentElement.setAttribute('lang', currentLocale);
  
  return currentLocale;
};

// Get translation
export const t = (key: string, fallback?: string): string => {
  if (!translations[key]) {
    console.warn(`Translation key not found: ${key}`);
    return fallback || key;
  }
  
  return translations[key][currentLocale] || translations[key]['en'] || fallback || key;
};

// Set locale
export const setLocale = (locale: SupportedLocale): void => {
  currentLocale = locale;
  localStorage.setItem('locale', locale);
  document.documentElement.setAttribute('lang', locale);
  
  // Dispatch event for components to re-render
  window.dispatchEvent(new CustomEvent('localeChange', { detail: { locale } }));
};

// Get current locale
export const getLocale = (): SupportedLocale => currentLocale;

// Get available locales
export const getAvailableLocales = (): SupportedLocale[] => ['en', 'es', 'fr', 'de', 'ja'];

// Export localization hook
export const useLocalization = () => {
  return {
    t,
    setLocale,
    getLocale,
    getAvailableLocales,
    initLocalization
  };
};
