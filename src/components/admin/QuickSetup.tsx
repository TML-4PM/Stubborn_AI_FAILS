
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Key, 
  Database, 
  Users, 
  ShoppingCart, 
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';
import DataInitializer from './DataInitializer';

const QuickSetup = () => {
  const setupSteps = [
    {
      title: "Initialize Sample Data",
      description: "Load initial AI fails and product data",
      icon: Database,
      status: "pending", // This will be dynamic based on data check
      component: <DataInitializer />
    },
    {
      title: "Configure API Keys",
      description: "Set up Printify and Stripe integration",
      icon: Key,
      status: "pending",
      actions: [
        { label: "Printify API Key", href: "https://printify.com/app/account/api" },
        { label: "Stripe Secret Key", href: "https://dashboard.stripe.com/apikeys" }
      ]
    },
    {
      title: "Enable Authentication",
      description: "Set up user registration and login",
      icon: Users,
      status: "completed", // Auth is already implemented
      note: "Authentication system is already configured"
    },
    {
      title: "Test Shop Integration",
      description: "Verify Stripe payments and product sync",
      icon: ShoppingCart,
      status: "pending",
      note: "Requires API keys to be configured first"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default">Complete</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="outline">Not Started</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Quick Setup</h2>
        <p className="text-muted-foreground">
          Get your AI Oopsies platform ready for launch with these essential steps.
        </p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Complete these steps to activate all platform features. Each step builds on the previous ones.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6">
        {setupSteps.map((step, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(step.status)}
                  <step.icon className="h-5 w-5" />
                  <span>{step.title}</span>
                </div>
                {getStatusBadge(step.status)}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {step.description}
              </p>
            </CardHeader>
            <CardContent>
              {step.component && step.component}
              
              {step.actions && (
                <div className="space-y-2">
                  {step.actions.map((action, actionIndex) => (
                    <Button
                      key={actionIndex}
                      variant="outline"
                      className="w-full justify-between"
                      onClick={() => window.open(action.href, '_blank')}
                    >
                      {action.label}
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  ))}
                </div>
              )}
              
              {step.note && (
                <p className="text-sm text-muted-foreground mt-2 p-2 bg-muted rounded">
                  {step.note}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p>After completing the setup above:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
              <li>Test the submission flow by creating a new AI fail</li>
              <li>Verify shop integration by testing a product purchase</li>
              <li>Configure content moderation settings</li>
              <li>Set up social media discovery sources</li>
              <li>Customize branding and domain settings</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickSetup;
