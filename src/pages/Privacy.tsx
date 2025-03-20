
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowRight } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Privacy = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Privacy Policy</h1>
          
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p className="text-muted-foreground mb-6">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
            
            <Alert className="mb-8 bg-muted/50">
              <AlertTitle>Our Commitment</AlertTitle>
              <AlertDescription>
                At AI Oopsies, we take your privacy seriously. This Privacy Policy outlines how we collect, 
                use, and protect your information when you visit our website.
              </AlertDescription>
            </Alert>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Information We Collect</h2>
              <p className="mb-4">We collect the following types of information when you use our service:</p>
              <ul className="list-disc list-inside mb-4 space-y-2">
                <li>
                  <span className="font-medium">Information you provide to us:</span> When you submit AI fails, 
                  leave comments, or create an account, we collect the information you provide, such as your username, 
                  email address, and the content you share.
                </li>
                <li>
                  <span className="font-medium">Usage information:</span> We collect data about how you interact with 
                  our service, including the pages you visit, the time you spend on our site, and the actions you take.
                </li>
                <li>
                  <span className="font-medium">Device information:</span> We collect information about the device 
                  you use to access our service, including device type, operating system, browser type, and IP address.
                </li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">How We Use Your Information</h2>
              <p className="mb-4">We use the information we collect to:</p>
              <ul className="list-disc list-inside mb-4 space-y-2">
                <li>Provide, maintain, and improve our service</li>
                <li>Process and display user submissions</li>
                <li>Respond to your comments, questions, and requests</li>
                <li>Monitor and analyze trends, usage, and activities in connection with our service</li>
                <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities</li>
                <li>Personalize and improve your experience with our service</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Cookies and Similar Technologies</h2>
              <p className="mb-4">
                We use cookies and similar technologies to collect information about your browsing activities and 
                to distinguish you from other users of our service. This helps us provide you with a good experience 
                when you browse our service and allows us to improve our site.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Data Sharing and Disclosure</h2>
              <p className="mb-4">We may share your information in the following circumstances:</p>
              <ul className="list-disc list-inside mb-4 space-y-2">
                <li>With service providers who perform services on our behalf</li>
                <li>In response to legal process or a request for information if we believe disclosure is required by law</li>
                <li>To protect the rights, property, and safety of our users or others</li>
                <li>In connection with a sale, merger, or change of control</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Your Rights</h2>
              <p className="mb-4">
                Depending on your location, you may have certain rights regarding your personal information, 
                such as the right to access, correct, delete, or restrict processing of your data. 
                To exercise these rights, please contact us at privacy@aioopsies.com.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Changes to This Privacy Policy</h2>
              <p className="mb-4">
                We may update this Privacy Policy from time to time. If we make significant changes, 
                we will notify you by email or by posting a notice on our website.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
              <p className="mb-4">
                If you have any questions about this Privacy Policy, please contact us at privacy@aioopsies.com.
              </p>
            </section>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-12 pt-6 border-t">
            <Button variant="outline" onClick={() => navigate(-1)}>
              Go Back
            </Button>
            <Button onClick={() => navigate('/terms')}>
              Terms of Service
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Privacy;
