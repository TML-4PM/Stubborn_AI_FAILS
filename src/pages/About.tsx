import { useEffect, useState } from 'react';
import { Mail, Github, Twitter, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const DROID_LOGO = "https://lzfgigiyqpuuxslsygjt.supabase.co/storage/v1/object/public/images/AHC%20droid%20head.webp";

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast({ title: "Missing information", description: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const { error } = await supabase.functions.invoke('send-contact-email', { body: formData });
      if (error) throw error;
      setIsSubmitting(false);
      setIsSuccess(true);
      toast({ title: "Message sent!", description: "We'll get back to you soon." });
      setTimeout(() => {
        setFormData({ name: '', email: '', subject: '', message: '' });
        setIsSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Contact form error:", error);
      setIsSubmitting(false);
      toast({ title: "Failed to send", description: "Something went wrong. Try again.", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow pt-8 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="mb-16 text-center">
            <img src={DROID_LOGO} alt="AI Oopsies mascot" className="h-24 w-24 mx-auto mb-6 object-contain" />
            <h1 className="text-4xl font-bold mb-4">About AI Oopsies</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A place for the funny, weird, and genuinely confusing things AI does when nobody's looking (and sometimes when everyone is).
            </p>
          </div>
          
          {/* What we're about */}
          <div className="max-w-3xl mx-auto mb-16 space-y-6">
            <p className="text-lg leading-relaxed">
              We started this because we kept screenshot-ing the ridiculous stuff AI spits out — 
              extra fingers on hands, confidently wrong answers, translations that make zero sense — 
              and figured other people probably do too. So here we are.
            </p>
            <p className="text-lg leading-relaxed">
              This isn't about dunking on AI or the people building it. 
              It's about laughing at the gap between "this will change everything" and 
              "why does this dog have human teeth." Both things can be true.
            </p>
            
            <h2 className="text-2xl font-bold mt-12 mb-4">How it works</h2>
            <p className="text-lg leading-relaxed">
              You find something funny → you post it → people vote on it → the best stuff rises to the top. 
              That's basically it. No algorithms deciding what's funny. Just people.
            </p>
            
            <h2 className="text-2xl font-bold mt-12 mb-4">Community Guidelines</h2>
            <p className="text-lg mb-4">Keep it fun, keep it clean:</p>
            
            <ul className="space-y-3">
              {[
                "Keep it work-safe. Your boss might be scrolling too.",
                "Blur out personal info in screenshots.",
                "Be cool in the comments.",
                "Only share stuff you have the right to share.",
                "Everything gets reviewed before it goes live."
              ].map((rule, i) => (
                <li key={i} className="flex items-start gap-3 p-3 bg-secondary rounded-lg">
                  <span className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold text-primary">
                    {i + 1}
                  </span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>

            <h2 className="text-2xl font-bold mt-12 mb-4">Get in Touch</h2>
            <p className="text-lg mb-6">
              Got a question? Want to report something? Just want to say hi? Go for it.
            </p>
          </div>
          
          {/* Contact form */}
          <div className="max-w-2xl mx-auto mb-16">
            <div className="border rounded-xl p-8 bg-card">
              <form className="space-y-6" onSubmit={handleContactSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">Name</label>
                    <input id="name" type="text" placeholder="Your name" value={formData.name} onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">Email</label>
                    <input id="email" type="email" placeholder="Your email" value={formData.email} onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                  <input id="subject" type="text" placeholder="What's this about?" value={formData.subject} onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">Message</label>
                  <textarea id="message" placeholder="Your message" value={formData.message} onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all" rows={5} />
                </div>
                <button type="submit" disabled={isSubmitting || isSuccess}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center w-full ${
                    isSuccess ? 'bg-green-500 text-white' : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  }`}>
                  {isSubmitting ? (<><Loader2 className="animate-spin w-5 h-5 mr-2" />Sending...</>) 
                    : isSuccess ? (<><CheckCircle2 className="w-5 h-5 mr-2" />Sent!</>) 
                    : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
          
          {/* Contact cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto pb-12">
            <div className="bg-secondary rounded-xl p-6 text-center">
              <Mail className="w-6 h-6 text-primary mx-auto mb-3" />
              <h3 className="font-medium mb-1">Email</h3>
              <a href="mailto:contact@aioopsies.com" className="text-sm text-primary hover:underline">contact@aioopsies.com</a>
            </div>
            <div className="bg-secondary rounded-xl p-6 text-center">
              <Twitter className="w-6 h-6 text-primary mx-auto mb-3" />
              <h3 className="font-medium mb-1">Twitter</h3>
              <a href="#" className="text-sm text-primary hover:underline">@AIoopsies</a>
            </div>
            <div className="bg-secondary rounded-xl p-6 text-center">
              <Github className="w-6 h-6 text-primary mx-auto mb-3" />
              <h3 className="font-medium mb-1">GitHub</h3>
              <a href="#" className="text-sm text-primary hover:underline">github.com/aioopsies</a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;
