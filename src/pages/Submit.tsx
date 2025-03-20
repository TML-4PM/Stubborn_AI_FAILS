
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
      
      <main className="flex-grow pt-24 pb-20 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 left-1/4 w-64 h-64 bg-fail/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-block p-2 rounded-full bg-fail/10 mb-4">
              <div className="bg-fail/20 rounded-full p-2">
                <svg className="w-8 h-8 text-fail" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14.9817 3.33701C15.3033 3.32605 15.6219 3.27469 15.9244 3.18477C16.2269 3.09486 16.5092 2.9678 16.7616 2.80803C17.014 2.64826 17.2332 2.45809 17.4101 2.24401C17.587 2.02993 17.7193 1.79507 17.8017 1.54701C18.0579 1.89571 18.2523 2.28876 18.3744 2.70807C18.4965 3.12738 18.5442 3.56713 18.5156 4.00379C18.487 4.44044 18.3827 4.86792 18.2075 5.26632C18.0323 5.66472 17.789 6.0278 17.4895 6.3422C17.1899 6.6566 16.839 6.91771 16.4536 7.11483C16.0681 7.31195 15.6546 7.4422 15.2317 7.49998C14.8088 7.55775 14.3829 7.54227 13.9666 7.45428C13.5503 7.36629 13.1511 7.20708 12.7866 6.98402C13.0426 6.8963 13.2857 6.77003 13.5087 6.60899C13.7317 6.44794 13.9322 6.25398 14.1038 6.03345C14.2754 5.81291 14.4163 5.5681 14.5211 5.30626C14.626 5.04441 14.6938 4.76867 14.7217 4.48701C14.7217 4.10401 14.8117 3.71801 14.9817 3.33701Z" fill="currentColor" />
                  <path d="M15.0008 21H9.00082C8.65186 21.0006 8.31076 20.9069 8.00636 20.7286C7.70196 20.5503 7.44399 20.2929 7.25605 19.9831C7.0681 19.6735 6.95675 19.3214 6.93184 18.9572C6.90694 18.5931 6.96933 18.2285 7.11382 17.897L10.1108 10.891C10.2743 10.5369 10.5334 10.2331 10.8582 10.0139C11.183 9.79471 11.5612 9.66959 11.9498 9.65H12.0518C12.4485 9.65711 12.8356 9.77586 13.1677 9.99395C13.4998 10.212 13.763 10.5203 13.9248 10.881L16.8958 17.888C17.0394 18.2173 17.1016 18.5794 17.0773 18.9412C17.053 19.303 16.9429 19.653 16.757 19.9611C16.571 20.2692 16.3154 20.5257 16.0136 20.7041C15.7118 20.8825 15.3732 20.9773 15.0268 20.979L15.0008 21Z" fill="currentColor" />
                  <path d="M12.0009 18C12.5532 18 13.0009 17.5523 13.0009 17C13.0009 16.4477 12.5532 16 12.0009 16C11.4486 16 11.0009 16.4477 11.0009 17C11.0009 17.5523 11.4486 18 12.0009 18Z" fill="currentColor" />
                  <path d="M12.0009 15C12.2661 15 12.5205 14.8946 12.7081 14.7071C12.8956 14.5196 13.0009 14.2652 13.0009 14L13.0009 13C13.0009 12.7348 12.8956 12.4804 12.7081 12.2929C12.5205 12.1054 12.2661 12 12.0009 12C11.7357 12 11.4813 12.1054 11.2938 12.2929C11.1062 12.4804 11.0009 12.7348 11.0009 13V14C11.0009 14.2652 11.1062 14.5196 11.2938 14.7071C11.4813 14.8946 11.7357 15 12.0009 15Z" fill="currentColor" />
                </svg>
              </div>
            </div>
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
