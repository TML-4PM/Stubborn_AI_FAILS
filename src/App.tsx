
import { Suspense, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/ThemeProvider';
import { UserProvider } from '@/contexts/UserContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ErrorBoundary from '@/components/ErrorBoundary';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import PerformanceMonitor from '@/components/ui/PerformanceMonitor';
import TestLauncher from '@/components/TestLauncher';
import { initializePerformanceOptimizations, preloadCriticalContent } from '@/utils/performanceOptimizer';

// Lazy load pages for better performance
import { lazy } from 'react';

const Index = lazy(() => import('@/pages/Index'));
const Gallery = lazy(() => import('@/pages/Gallery'));
const Search = lazy(() => import('@/pages/Search'));
const Community = lazy(() => import('@/pages/Community'));
const Submit = lazy(() => import('@/pages/Submit'));
const Shop = lazy(() => import('@/pages/Shop'));
const Donate = lazy(() => import('@/pages/Donate'));
const Admin = lazy(() => import('@/pages/Admin'));
const Profile = lazy(() => import('@/pages/Profile'));
const UserProfile = lazy(() => import('@/pages/UserProfile'));
const FailDetail = lazy(() => import('@/pages/FailDetail'));
const About = lazy(() => import('@/pages/About'));
const Terms = lazy(() => import('@/pages/Terms'));
const Privacy = lazy(() => import('@/pages/Privacy'));
const YouTubePage = lazy(() => import('@/pages/YouTubePage'));
const Feed = lazy(() => import('@/pages/Feed'));
const NotFound = lazy(() => import('@/pages/NotFound'));

// Create query client with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        if (failureCount < 2) return true;
        return false;
      }
    },
    mutations: {
      retry: 1
    }
  }
});

function App() {
  useEffect(() => {
    // Initialize performance optimizations
    const networkOptimizations = initializePerformanceOptimizations();
    
    // Preload critical content
    preloadCriticalContent();
    
    // Log performance optimizations
    console.log('Performance optimizations initialized:', networkOptimizations);
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="system" storageKey="app-theme">
          <UserProvider>
            <div className="min-h-screen bg-background flex flex-col">
              <Navbar />
              <main className="flex-1 pt-16">
                <Suspense 
                  fallback={
                    <div className="flex items-center justify-center min-h-[400px]">
                      <LoadingSpinner size="lg" />
                    </div>
                  }
                >
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/gallery" element={<Gallery />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/community" element={<Community />} />
                    <Route path="/submit" element={<Submit />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/donate" element={<Donate />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/user/:userId" element={<UserProfile />} />
                    <Route path="/fail/:id" element={<FailDetail />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/youtube" element={<YouTubePage />} />
                    <Route path="/feed" element={<Feed />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </main>
              <Footer />
              </div>
              <TestLauncher />
              <Toaster />
              <PerformanceMonitor />
            </UserProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
