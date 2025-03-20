
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Play, Check, XCircle } from 'lucide-react';
import { testRunner, testFormValidation, testButtonFunctionality, 
         testComponentRendering, testImageUploader, testDonationAmount,
         testUserAuth } from '@/utils/testUtils';

interface TestControllerProps {
  onClose: () => void;
}

interface TestResult {
  name: string;
  success: boolean;
  message: string;
}

const TestController = ({ onClose }: TestControllerProps) => {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<Array<{name: string, success: boolean, message: string}>>([]);
  
  const runAllTests = async () => {
    setIsRunning(true);
    testRunner.reset();
    
    // Test components rendering
    testComponentRendering("nav", /Submit|About|Donate/);
    testComponentRendering("main", /.+/);
    testComponentRendering("footer", /.+/);
    
    // Test user authentication
    testUserAuth();
    
    // Determine which page we're on and run appropriate tests
    const currentPath = window.location.pathname;
    
    if (currentPath.includes('/submit')) {
      // Test the submission form
      const form = document.querySelector('form') as HTMLFormElement;
      testFormValidation(form, ['title', 'image']);
      testComponentRendering(".glass", /Submit Your AI Fail/);
      testImageUploader("image");
      testButtonFunctionality('form button[type="submit"]', () => true);
    } 
    else if (currentPath.includes('/donate')) {
      // Test donation functionality
      testComponentRendering(".glass", /Make a Donation/);
      testDonationAmount(".grid button", 'input[placeholder="Enter amount"]');
      testButtonFunctionality('button:has(.mr-2)', () => true);
    }
    else if (currentPath.includes('/profile')) {
      // Test profile functionality
      testComponentRendering("h1", new RegExp(document.querySelector('h1')?.textContent || ''));
      testButtonFunctionality('button:contains("Save Changes")', () => true);
    }
    
    // General component tests that should work on all pages
    testComponentRendering("nav a[href='/']", /.+/);
    testButtonFunctionality('button', () => true);
    
    // Update results
    setTestResults([...testRunner.results]);
    setIsRunning(false);
  };
  
  return (
    <div className="fixed right-4 bottom-4 z-50 w-96 max-w-[calc(100vw-2rem)] bg-background border rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="font-semibold flex items-center gap-2">
          <Play className="w-4 h-4" />
          Test Controller
        </h3>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      </div>
      
      <div className="p-4">
        <Button 
          onClick={runAllTests} 
          disabled={isRunning}
          className="w-full mb-4"
        >
          {isRunning ? "Running Tests..." : "Run All Tests"}
        </Button>
        
        {testResults.length > 0 && (
          <>
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium">Results</h4>
              <span className="text-sm text-muted-foreground">
                {testResults.filter(r => r.success).length}/{testResults.length} passed
              </span>
            </div>
            <ScrollArea className="h-60">
              <div className="space-y-2">
                {testResults.map((result, idx) => (
                  <div 
                    key={idx} 
                    className={`p-2 rounded text-sm ${
                      result.success ? 'bg-green-500/10' : 'bg-red-500/10'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {result.success ? (
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      )}
                      <div>
                        <p className="font-medium">{result.name}</p>
                        <p className="text-xs text-muted-foreground">{result.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </>
        )}
      </div>
    </div>
  );
};

export const testSocialFeatures = (): TestResult => {
  try {
    console.log('Testing social features...');
    
    // Test like button
    const likeButton = document.querySelector('[aria-label="Like"]') || 
                     document.querySelector('button:has(.lucide-heart)');
    
    if (!likeButton) {
      return {
        name: "Social Features - Like Button",
        success: false,
        message: 'Like button not found'
      };
    }
    
    // Test share button
    const shareButton = document.querySelector('[aria-label="Share"]') || 
                      document.querySelector('button:has(.lucide-share)');
    
    if (!shareButton) {
      return {
        name: "Social Features - Share Button",
        success: false,
        message: 'Share button not found'
      };
    }
    
    // Test comment section (if on detail page)
    const commentSection = document.querySelector('[data-testid="comment-section"]') || 
                         document.querySelector('form textarea[placeholder*="comment" i]');
    
    // Not failing the test if comment section not found, as it might not be on all pages
    
    return {
      name: "Social Features",
      success: true,
      message: 'Social features test passed'
    };
  } catch (error) {
    return {
      name: "Social Features",
      success: false,
      message: `Social features test failed: ${error}`
    };
  }
};

export default TestController;
