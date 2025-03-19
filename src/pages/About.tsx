
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Mail, Github, Twitter } from 'lucide-react';

const About = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl font-bold mb-4 text-center">About AI Oopsies</h1>
            <div className="prose prose-lg mx-auto">
              <p>
                AI Oopsies was created to celebrate the humorous side of artificial intelligence. 
                In a world where AI is rapidly advancing and becoming part of our daily lives, 
                we find joy in those moments when it gets things spectacularly wrong.
              </p>
              
              <p>
                From bizarre image generations to completely misunderstood prompts, 
                our gallery showcases those moments that remind us that AI, for all its 
                capabilities, still has a long way to go.
              </p>
              
              <p>
                We love AI and believe in its potential to transform our world for the better. 
                This site is not meant to criticize or diminish the incredible work being done 
                in the field of artificial intelligence, but rather to share a laugh and remember 
                that even our most sophisticated technologies can surprise us in unexpected ways.
              </p>
              
              <h2>Our Mission</h2>
              <p>
                Our mission is simple: to create a fun, lighthearted space where people can share 
                and enjoy the amusing side of AI technology. We believe that humor brings people 
                together, and what better way to connect than over those universal "wait, what?" 
                moments we've all experienced with AI.
              </p>
              
              <h2>Community Guidelines</h2>
              <p>
                We want AI Oopsies to be a positive space for everyone. When submitting content, 
                please keep the following guidelines in mind:
              </p>
              
              <ul>
                <li>All content should be appropriate and work-safe.</li>
                <li>No personal information should be visible in screenshots.</li>
                <li>Be respectful in your descriptions and comments.</li>
                <li>Make sure you have the right to share the content you're submitting.</li>
                <li>All submissions are moderated before appearing on the site.</li>
              </ul>
              
              <h2>Contact Us</h2>
              <p>
                Have questions, suggestions, or just want to say hello? We'd love to hear from you! 
                Fill out the form below or reach out to us on social media.
              </p>
            </div>
          </div>
          
          <div className="max-w-2xl mx-auto mb-20">
            <div className="glass rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Your name"
                      className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="Your email"
                      className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">
                    Subject
                  </label>
                  <input
                    id="subject"
                    type="text"
                    placeholder="Subject of your message"
                    className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Message
                  </label>
                  <textarea
                    id="message"
                    placeholder="Your message"
                    className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                    rows={5}
                  />
                </div>
                
                <button 
                  type="submit"
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium transition-colors hover:bg-primary/90"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto pb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-secondary rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-medium mb-2">Email Us</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  For general inquiries and support
                </p>
                <a 
                  href="mailto:contact@aioopsies.com" 
                  className="text-primary hover:underline text-sm"
                >
                  contact@aioopsies.com
                </a>
              </div>
              
              <div className="bg-secondary rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Twitter className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-medium mb-2">Twitter</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Follow us for updates and more fails
                </p>
                <a 
                  href="#" 
                  className="text-primary hover:underline text-sm"
                >
                  @AIoopsies
                </a>
              </div>
              
              <div className="bg-secondary rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Github className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-medium mb-2">GitHub</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Check out our open source projects
                </p>
                <a 
                  href="#" 
                  className="text-primary hover:underline text-sm"
                >
                  github.com/aioopsies
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
