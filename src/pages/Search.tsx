
import AdvancedSearchPanel from '@/components/search/AdvancedSearchPanel';
import Breadcrumbs from '@/components/navigation/Breadcrumbs';
import PWAInstallPrompt from '@/components/pwa/PWAInstallPrompt';

const Search = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs />
      <AdvancedSearchPanel />
      <PWAInstallPrompt />
    </div>
  );
};

export default Search;
