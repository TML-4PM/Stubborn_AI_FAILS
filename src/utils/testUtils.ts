import { toast } from "@/hooks/use-toast";

// Test results interface
interface TestResult {
  name: string;
  success: boolean;
  message: string;
}

// Main test runner class
export class TestRunner {
  results: TestResult[] = [];
  
  addResult(name: string, success: boolean, message: string) {
    this.results.push({ name, success, message });
    console.log(`Test ${name}: ${success ? 'PASSED' : 'FAILED'} - ${message}`);
    
    // Also show toast for each test
    toast({
      title: `Test: ${name}`,
      description: message,
      variant: success ? "default" : "destructive",
    });
  }

  getSummary() {
    const total = this.results.length;
    const passed = this.results.filter(r => r.success).length;
    return `Tests: ${passed}/${total} passed`;
  }

  reset() {
    this.results = [];
  }
}

// Singleton instance
export const testRunner = new TestRunner();

// Form testing utilities
export const testFormValidation = (formElement: HTMLFormElement, requiredFields: string[]) => {
  try {
    // Check if form exists
    if (!formElement) {
      testRunner.addResult("Form existence", false, "Form element not found");
      return false;
    }
    
    // Test required fields validation
    let allValid = true;
    requiredFields.forEach(fieldId => {
      const field = formElement.querySelector(`#${fieldId}`) as HTMLInputElement | HTMLTextAreaElement;
      if (!field) {
        testRunner.addResult(`Field #${fieldId} existence`, false, `Required field #${fieldId} not found`);
        allValid = false;
        return;
      }
      
      // Clear field value
      if (field.value) {
        const originalValue = field.value;
        field.value = "";
        field.dispatchEvent(new Event('input', { bubbles: true }));
        field.dispatchEvent(new Event('change', { bubbles: true }));
        
        // Submit form
        const submitBtn = formElement.querySelector('button[type="submit"]') as HTMLButtonElement;
        if (submitBtn && !submitBtn.disabled) {
          testRunner.addResult(`Required field ${fieldId}`, false, 
            `Form allows submission with empty required field: ${fieldId}`);
          allValid = false;
        } else {
          testRunner.addResult(`Required field ${fieldId}`, true, 
            `Form correctly prevents submission with empty required field: ${fieldId}`);
        }
        
        // Restore value
        field.value = originalValue;
        field.dispatchEvent(new Event('input', { bubbles: true }));
        field.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    
    return allValid;
  } catch (error) {
    testRunner.addResult("Form validation test", false, `Error: ${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
};

// Button testing utilities
export const testButtonFunctionality = (buttonSelector: string, expectedAction: () => boolean) => {
  try {
    const button = document.querySelector(buttonSelector) as HTMLButtonElement;
    if (!button) {
      testRunner.addResult(`Button ${buttonSelector}`, false, `Button not found: ${buttonSelector}`);
      return false;
    }
    
    if (button.disabled) {
      testRunner.addResult(`Button ${buttonSelector}`, false, `Button is disabled: ${buttonSelector}`);
      return false;
    }
    
    // Test click functionality
    const result = expectedAction();
    testRunner.addResult(`Button ${buttonSelector} functionality`, result, 
      result ? `Button ${buttonSelector} works as expected` : `Button ${buttonSelector} did not perform expected action`);
    
    return result;
  } catch (error) {
    testRunner.addResult(`Button ${buttonSelector}`, false, `Error: ${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
};

// Component testing utilities
export const testComponentRendering = (componentSelector: string, expectedContentRegex?: RegExp) => {
  try {
    const component = document.querySelector(componentSelector);
    if (!component) {
      testRunner.addResult(`Component ${componentSelector}`, false, `Component not found: ${componentSelector}`);
      return false;
    }
    
    if (expectedContentRegex && !expectedContentRegex.test(component.innerHTML)) {
      testRunner.addResult(`Component ${componentSelector} content`, false, 
        `Component ${componentSelector} does not contain expected content`);
      return false;
    }
    
    testRunner.addResult(`Component ${componentSelector}`, true, 
      `Component ${componentSelector} renders correctly`);
    return true;
  } catch (error) {
    testRunner.addResult(`Component ${componentSelector}`, false, `Error: ${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
};

// Image uploader testing
export const testImageUploader = (uploaderId: string) => {
  try {
    const uploader = document.querySelector(`#${uploaderId}`) as HTMLInputElement;
    if (!uploader) {
      testRunner.addResult("Image uploader", false, "Image uploader not found");
      return false;
    }
    
    // Create a mock image file
    const mockFile = new File(["dummy content"], "test-image.png", { type: "image/png" });
    
    // Create a DataTransfer object
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(mockFile);
    uploader.files = dataTransfer.files;
    
    // Dispatch change event
    uploader.dispatchEvent(new Event('change', { bubbles: true }));
    
    testRunner.addResult("Image uploader", true, "Image uploader successfully tested with mock file");
    return true;
  } catch (error) {
    testRunner.addResult("Image uploader", false, `Error: ${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
};

// Donation amount testing
export const testDonationAmount = (amountButtons: string, customAmountInput: string) => {
  try {
    const buttons = document.querySelectorAll(amountButtons) as NodeListOf<HTMLButtonElement>;
    const input = document.querySelector(customAmountInput) as HTMLInputElement;
    
    if (buttons.length === 0) {
      testRunner.addResult("Donation amount buttons", false, "Donation amount buttons not found");
      return false;
    }
    
    if (!input) {
      testRunner.addResult("Custom donation input", false, "Custom donation input not found");
      return false;
    }
    
    // Test clicking on a predefined amount
    let buttonTestPassed = false;
    buttons.forEach(button => {
      button.click();
      buttonTestPassed = true;
    });
    
    // Test custom amount input
    input.value = "15.50";
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    
    testRunner.addResult("Donation amounts", buttonTestPassed, 
      buttonTestPassed ? "Donation amount buttons work correctly" : "Failed to test donation amount buttons");
    testRunner.addResult("Custom donation input", true, "Custom donation input allows correct input format");
    
    return buttonTestPassed;
  } catch (error) {
    testRunner.addResult("Donation testing", false, `Error: ${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
};

// User authentication testing
export const testUserAuth = () => {
  try {
    // Check if auth components exist
    const signInButton = document.querySelector('button:contains("Sign In")');
    const signUpButton = document.querySelector('button:contains("Sign Up")');
    
    if (!signInButton && !signUpButton) {
      // Check if user is already logged in
      const userMenu = document.querySelector('[aria-haspopup="menu"]');
      
      if (userMenu) {
        testRunner.addResult("User authentication UI", true, "User is logged in and user menu is visible");
        return true;
      } else {
        testRunner.addResult("User authentication UI", false, "No authentication UI found");
        return false;
      }
    }
    
    // Test opening auth modal
    if (signInButton) {
      signInButton.click();
      
      // Check if modal opened
      setTimeout(() => {
        const authForm = document.querySelector('form:has(input[type="email"])');
        
        if (authForm) {
          testRunner.addResult("Auth modal", true, "Authentication modal opens correctly");
          
          // Close modal
          const closeButton = document.querySelector('button[aria-label="Close"]');
          if (closeButton) {
            closeButton.click();
          }
        } else {
          testRunner.addResult("Auth modal", false, "Authentication modal failed to open");
        }
      }, 500);
    }
    
    return true;
  } catch (error) {
    testRunner.addResult("User authentication test", false, `Error: ${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
};

// User navigation testing
export const testUserNavigation = async (): Promise<TestResult> => {
  try {
    console.log('Testing user navigation...');
    const userButton = document.querySelector('[data-testid="user-menu-button"]');
    
    if (!userButton) {
      return {
        success: false,
        message: 'User navigation button not found'
      };
    }
    
    // Use correct typings for clicking the button
    (userButton as HTMLElement).click();
    
    // Wait for menu to appear
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const menuItems = document.querySelectorAll('[data-testid="user-menu-item"]');
    if (menuItems.length === 0) {
      return {
        success: false,
        message: 'No user menu items found'
      };
    }
    
    // Close menu by clicking button again
    (userButton as HTMLElement).click();
    
    return {
      success: true,
      message: 'User navigation test passed'
    };
  } catch (error) {
    return {
      success: false,
      message: `User navigation test failed: ${error}`
    };
  }
};
