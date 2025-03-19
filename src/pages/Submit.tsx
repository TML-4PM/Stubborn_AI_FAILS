
import { useEffect } from 'react';
import SubmissionForm from '@/components/SubmissionForm';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Submit = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Submit Your AI Fail</h1>
            <p className="text-muted-foreground">
              Had a hilarious interaction with AI? Share it with our community! 
              Fill out the form below to submit your AI fail.
            </p>
          </div>
          
          <SubmissionForm />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Submit;
