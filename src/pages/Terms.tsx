
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowRight } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Terms = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Terms of Service</h1>
          
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p className="text-muted-foreground mb-6">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
            
            <Alert className="mb-8 bg-muted/50">
              <AlertTitle>Important Notice</AlertTitle>
              <AlertDescription>
                By using AI Oopsies, you agree to these Terms of Service. Please read them carefully.
              </AlertDescription>
            </Alert>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Acceptance of Terms</h2>
              <p className="mb-4">
                By accessing or using our website, you agree to be bound by these Terms of Service and all 
                applicable laws and regulations. If you do not agree with any of these terms, you are prohibited 
                from using or accessing this site.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">User Submissions</h2>
              <p className="mb-4">
                When you submit content to AI Oopsies, you grant us a worldwide, non-exclusive, royalty-free license 
                to use, reproduce, modify, adapt, publish, translate, distribute, and display such content in any media.
              </p>
              <p className="mb-4">You represent and warrant that:</p>
              <ul className="list-disc list-inside mb-4 space-y-2">
                <li>You own or have the necessary rights to the content you submit</li>
                <li>The content does not violate the rights of any third party</li>
                <li>The content does not contain any material that is unlawful, harmful, threatening, abusive, harassing, 
                defamatory, vulgar, obscene, or otherwise objectionable</li>
                <li>The content does not include personal information of individuals without their consent</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">User Conduct</h2>
              <p className="mb-4">
                You agree not to use our service for any purpose that is unlawful or prohibited by these Terms, 
                or to solicit the performance of any illegal activity.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Intellectual Property</h2>
              <p className="mb-4">
                All content included on this site, such as text, graphics, logos, images, as well as the compilation thereof, 
                and any software used on the site, is the property of AI Oopsies or its suppliers and protected by copyright 
                and other laws. You agree not to reproduce, duplicate, copy, sell, resell, or exploit any portion of the 
                service without express written permission from us.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Disclaimer of Warranties</h2>
              <p className="mb-4">
                Our service is provided "as is" without any warranties, expressed or implied. We do not guarantee that 
                the service will be uninterrupted, secure, or error-free.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Limitation of Liability</h2>
              <p className="mb-4">
                AI Oopsies shall not be liable for any indirect, incidental, special, consequential, or punitive damages 
                resulting from your use of or inability to use the service.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Changes to Terms</h2>
              <p className="mb-4">
                We reserve the right to modify these Terms of Service at any time. Your continued use of the service 
                after such modifications constitutes your acceptance of the revised terms.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Governing Law</h2>
              <p className="mb-4">
                These Terms shall be governed by and construed in accordance with the laws of Australia, 
                without regard to its conflict of law provisions.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
              <p className="mb-4">
                If you have any questions about these Terms, please contact us at terms@aioopsies.com.
              </p>
            </section>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-12 pt-6 border-t">
            <Button variant="outline" onClick={() => navigate(-1)}>
              Go Back
            </Button>
            <Button onClick={() => navigate('/privacy')}>
              Privacy Policy
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Terms;
