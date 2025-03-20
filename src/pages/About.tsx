
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
      
      <main className="flex-grow pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Header section with illustration */}
          <div className="max-w-4xl mx-auto mb-24 text-center">
            <h1 className="text-5xl font-bold mb-8 text-center">About AI Oopsies</h1>
            
            <div className="relative my-16">
              <img 
                src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=1500&q=80" 
                alt="Technology illustration" 
                className="rounded-xl w-full h-64 object-cover shadow-lg mb-8" 
              />
              <div className="absolute -bottom-8 right-8 bg-white dark:bg-background p-4 rounded-xl shadow-lg">
                <span className="text-lg font-medium">When AI gets creative... in unexpected ways</span>
              </div>
            </div>
          </div>
          
          {/* Mission section */}
          <div className="max-w-3xl mx-auto mb-32">
            <div className="prose prose-lg mx-auto">
              <p className="text-xl leading-relaxed mb-8">
                AI Oopsies was created to celebrate the humorous side of artificial intelligence. 
                In a world where AI is rapidly advancing and becoming part of our daily lives, 
                we find joy in those moments when it gets things spectacularly wrong.
              </p>
              
              <div className="flex flex-col md:flex-row items-center gap-12 my-20">
                <div className="w-full md:w-1/2">
                  <img 
                    src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80" 
                    alt="People working with computers" 
                    className="rounded-lg shadow-md w-full h-auto object-cover" 
                  />
                </div>
                <div className="w-full md:w-1/2 space-y-4">
                  <p className="text-lg">
                    From bizarre image generations to completely misunderstood prompts, 
                    our gallery showcases those moments that remind us that AI, for all its 
                    capabilities, still has a long way to go.
                  </p>
                  
                  <p className="text-lg">
                    We love AI and believe in its potential to transform our world for the better. 
                    This site is not meant to criticize or diminish the incredible work being done 
                    in the field of artificial intelligence, but rather to share a laugh and remember 
                    that even our most sophisticated technologies can surprise us in unexpected ways.
                  </p>
                </div>
              </div>
              
              <h2 className="text-3xl font-bold mt-20 mb-8">Our Mission</h2>
              <p className="text-xl leading-relaxed mb-8">
                Our mission is simple: to create a fun, lighthearted space where people can share 
                and enjoy the amusing side of AI technology. We believe that humor brings people 
                together, and what better way to connect than over those universal "wait, what?" 
                moments we've all experienced with AI.
              </p>
              
              <div className="my-20 relative">
                <img 
                  src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1500&q=80" 
                  alt="Programming code on a screen" 
                  className="rounded-lg shadow-md w-full h-64 object-cover" 
                />
              </div>
              
              <h2 className="text-3xl font-bold mt-20 mb-8">Community Guidelines</h2>
              <p className="text-lg mb-8">
                We want AI Oopsies to be a positive space for everyone. When submitting content, 
                please keep the following guidelines in mind:
              </p>
              
              <ul className="space-y-4 my-10">
                <li className="flex items-center gap-3 p-4 bg-secondary rounded-lg shadow-sm">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-primary">1</span>
                  </div>
                  <span>All content should be appropriate and work-safe.</span>
                </li>
                <li className="flex items-center gap-3 p-4 bg-secondary rounded-lg shadow-sm">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-primary">2</span>
                  </div>
                  <span>No personal information should be visible in screenshots.</span>
                </li>
                <li className="flex items-center gap-3 p-4 bg-secondary rounded-lg shadow-sm">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-primary">3</span>
                  </div>
                  <span>Be respectful in your descriptions and comments.</span>
                </li>
                <li className="flex items-center gap-3 p-4 bg-secondary rounded-lg shadow-sm">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-primary">4</span>
                  </div>
                  <span>Make sure you have the right to share the content you're submitting.</span>
                </li>
                <li className="flex items-center gap-3 p-4 bg-secondary rounded-lg shadow-sm">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-primary">5</span>
                  </div>
                  <span>All submissions are moderated before appearing on the site.</span>
                </li>
              </ul>
              
              <h2 className="text-3xl font-bold mt-20 mb-8">Contact Us</h2>
              <p className="text-xl leading-relaxed mb-8">
                Have questions, suggestions, or just want to say hello? We'd love to hear from you! 
                Fill out the form below or reach out to us on social media.
              </p>
            </div>
          </div>
          
          {/* Contact form section */}
          <div className="max-w-2xl mx-auto mb-32">
            <div className="glass rounded-2xl p-10 shadow-md">
              <h2 className="text-3xl font-bold mb-8">Get in Touch</h2>
              
              <form className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label htmlFor="name" className="text-sm font-medium">
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Your name"
                      className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="Your email"
                      className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label htmlFor="subject" className="text-sm font-medium">
                    Subject
                  </label>
                  <input
                    id="subject"
                    type="text"
                    placeholder="Subject of your message"
                    className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                  />
                </div>
                
                <div className="space-y-3">
                  <label htmlFor="message" className="text-sm font-medium">
                    Message
                  </label>
                  <textarea
                    id="message"
                    placeholder="Your message"
                    className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                    rows={6}
                  />
                </div>
                
                <button 
                  type="submit"
                  className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-medium transition-colors hover:bg-primary/90 text-lg"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
          
          {/* Contact cards section */}
          <div className="max-w-5xl mx-auto pb-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="bg-secondary rounded-xl p-8 text-center shadow-sm hover:shadow-md transition-all">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mail className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-medium text-xl mb-3">Email Us</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  For general inquiries and support
                </p>
                <a 
                  href="mailto:contact@aioopsies.com" 
                  className="text-primary hover:underline text-sm font-medium"
                >
                  contact@aioopsies.com
                </a>
              </div>
              
              <div className="bg-secondary rounded-xl p-8 text-center shadow-sm hover:shadow-md transition-all">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Twitter className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-medium text-xl mb-3">Twitter</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Follow us for updates and more fails
                </p>
                <a 
                  href="#" 
                  className="text-primary hover:underline text-sm font-medium"
                >
                  @AIoopsies
                </a>
              </div>
              
              <div className="bg-secondary rounded-xl p-8 text-center shadow-sm hover:shadow-md transition-all">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Github className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-medium text-xl mb-3">GitHub</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Check out our open source projects
                </p>
                <a 
                  href="#" 
                  className="text-primary hover:underline text-sm font-medium"
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
