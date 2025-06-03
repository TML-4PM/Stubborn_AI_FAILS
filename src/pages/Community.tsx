
import CommunityDashboard from '@/components/community/CommunityDashboard';
import Breadcrumbs from '@/components/navigation/Breadcrumbs';
import PWAInstallPrompt from '@/components/pwa/PWAInstallPrompt';

const Community = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs />
      <CommunityDashboard />
      <PWAInstallPrompt />
    </div>
  );
};

export default Community;
