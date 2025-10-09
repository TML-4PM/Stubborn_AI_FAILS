
import { useState } from 'react';
import { Beaker } from 'lucide-react';
import { FloatingActionButton } from '@/components/ui/floating-action-button';
import TestController from './TestController';

const TestLauncher = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <FloatingActionButton
        position="bottom-right"
        size="md"
        className="z-[60]"
        onClick={() => setIsOpen(true)}
        aria-label="Open Test Controller"
      >
        <Beaker className="h-6 w-6" />
      </FloatingActionButton>
      
      {isOpen && <TestController onClose={() => setIsOpen(false)} />}
    </>
  );
};

export default TestLauncher;
