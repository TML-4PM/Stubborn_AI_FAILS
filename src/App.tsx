import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { ErrorBoundary } from './components/ErrorBoundary';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './components/ThemeProvider';
import PageTransition from './components/PageTransition';

// Page imports
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import Gallery from './pages/Gallery';
import FailDetail from './pages/FailDetail';
import Submit from './pages/Submit';
import About from './pages/About';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import YouTubePage from './pages/YouTubePage';
import Profile from './pages/Profile';
import Donate from './pages/Donate';
import Admin from './pages/Admin';
import Shop from './pages/Shop';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <ErrorBoundary>
          <Routes>
            <Route
              path="/"
              element={
                <PageTransition>
                  <Index />
                </PageTransition>
              }
            />
            <Route
              path="/gallery"
              element={
                <PageTransition>
                  <Gallery />
                </PageTransition>
              }
            />
            <Route
              path="/fail/:id"
              element={
                <PageTransition>
                  <FailDetail />
                </PageTransition>
              }
            />
            <Route
              path="/submit"
              element={
                <PageTransition>
                  <Submit />
                </PageTransition>
              }
            />
            <Route
              path="/about"
              element={
                <PageTransition>
                  <About />
                </PageTransition>
              }
            />
            <Route
              path="/terms"
              element={
                <PageTransition>
                  <Terms />
                </PageTransition>
              }
            />
            <Route
              path="/privacy"
              element={
                <PageTransition>
                  <Privacy />
                </PageTransition>
              }
            />
            <Route
              path="/youtube"
              element={
                <PageTransition>
                  <YouTubePage />
                </PageTransition>
              }
            />
            <Route
              path="/profile"
              element={
                <PageTransition>
                  <Profile />
                </PageTransition>
              }
            />
            <Route
              path="/donate"
              element={
                <PageTransition>
                  <Donate />
                </PageTransition>
              }
            />
            <Route
              path="/admin"
              element={
                <PageTransition>
                  <Admin />
                </PageTransition>
              }
            />
            <Route
              path="/shop"
              element={
                <PageTransition>
                  <Shop />
                </PageTransition>
              }
            />
            <Route
              path="*"
              element={
                <PageTransition>
                  <NotFound />
                </PageTransition>
              }
            />
          </Routes>
        </ErrorBoundary>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
