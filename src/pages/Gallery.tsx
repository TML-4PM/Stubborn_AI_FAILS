
import { useState, useEffect } from 'react';
import { getAllFails, AIFail } from '@/data/sampleFails';
import FailCard from '@/components/FailCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Search } from 'lucide-react';
import { useTransitionNavigation } from '@/hooks/useTransitionNavigation';

const Gallery = () => {
  const [allFails, setAllFails] = useState<AIFail[]>([]);
  const [filteredFails, setFilteredFails] = useState<AIFail[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { showNotification } = useTransitionNavigation();

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Simulate loading data
    const timer = setTimeout(() => {
      const fails = getAllFails();
      setAllFails(fails);
      setFilteredFails(fails);
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = allFails.filter(fail => 
        fail.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        fail.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fail.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFails(filtered);
      
      if (filtered.length === 0) {
        showNotification("No results match your search", "error");
      }
    } else {
      setFilteredFails(allFails);
    }
  }, [searchTerm, allFails, showNotification]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Already handled by the useEffect
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">AI Fails Gallery</h1>
            <p className="text-muted-foreground">
              Browse our collection of hilarious AI mishaps and unexpected responses. 
              Use the search bar to find specific fails.
            </p>
          </div>
          
          <div className="max-w-md mx-auto mb-12">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search by title, description or username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-10 rounded-full border focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            </form>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div
                  key={index}
                  className="rounded-xl bg-muted animate-pulse h-72"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in">
              {filteredFails.map((fail, index) => (
                <FailCard 
                  key={fail.id} 
                  fail={fail} 
                  delay={Math.min(index * 0.05, 0.5)}
                />
              ))}
            </div>
          )}
          
          {!isLoading && filteredFails.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-medium mb-2">No results found</h3>
              <p className="text-muted-foreground">
                We couldn't find any AI fails matching your search. Try different keywords.
              </p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Gallery;
