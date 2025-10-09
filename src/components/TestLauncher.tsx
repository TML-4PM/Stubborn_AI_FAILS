
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Beaker } from 'lucide-react';
import TestController from './TestController';

const TestLauncher = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="fixed right-4 bottom-4 z-50 rounded-full h-12 w-12 p-0 shadow-lg bg-primary text-primary-foreground hover:bg-primary/90"
        onClick={() => setIsOpen(true)}
      >
        <Beaker className="h-5 w-5" />
        <span className="sr-only">Open Test Controller</span>
      </Button>
      
      {isOpen && <TestController onClose={() => setIsOpen(false)} />}
    </>
  );
};

export default TestLauncher;
