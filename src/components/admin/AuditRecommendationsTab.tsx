
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TrendingUp, CheckCircle, FileImage, Zap, Search, Shield } from 'lucide-react';

interface AuditRecommendationsTabProps {
  audit: any;
  summary: any;
}

const AuditRecommendationsTab = ({ audit, summary }: AuditRecommendationsTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Optimization Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <TrendingUp className="h-4 w-4" />
          <AlertDescription>
            Here are personalized recommendations based on your audit results to improve your site's performance, SEO, and accessibility.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          {/* Image Recommendations */}
          {summary.imageAnalysis && summary.imageAnalysis.unoptimizedImages > 0 && (
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <FileImage className="h-4 w-4" />
                Image Optimization
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                {summary.imageAnalysis.unoptimizedImages} images need optimization
              </p>
              <ul className="space-y-1 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  Convert images to modern formats (WebP, AVIF)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  Implement lazy loading for below-the-fold images
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  Add proper alt text for accessibility
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  Use responsive images with srcset
                </li>
              </ul>
            </div>
          )}

          {/* Performance Recommendations */}
          {summary.averageLoadTime > 3000 && (
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Performance Optimization
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Average load time is {summary.averageLoadTime}ms (target: &lt;3000ms)
              </p>
              <ul className="space-y-1 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  Optimize and compress images
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  Enable browser caching
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  Minify CSS and JavaScript
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  Use a Content Delivery Network (CDN)
                </li>
              </ul>
            </div>
          )}

          {/* SEO Recommendations */}
          {audit.seo_score < 80 && (
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Search className="h-4 w-4" />
                SEO Improvements
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                SEO score: {audit.seo_score}% (target: 90%+)
              </p>
              <ul className="space-y-1 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  Optimize page titles (30-60 characters)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  Write compelling meta descriptions (120-160 characters)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  Ensure proper heading structure (H1-H6)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  Add alt text to all images
                </li>
              </ul>
            </div>
          )}

          {/* Accessibility Recommendations */}
          {audit.accessibility_score < 80 && (
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Accessibility Improvements
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Accessibility score: {audit.accessibility_score}% (target: 90%+)
              </p>
              <ul className="space-y-1 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  Add alt text to all images
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  Ensure proper color contrast ratios
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  Use semantic HTML elements
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  Add keyboard navigation support
                </li>
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AuditRecommendationsTab;
