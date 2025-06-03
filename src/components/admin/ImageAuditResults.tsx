
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FileImage, AlertTriangle, CheckCircle } from 'lucide-react';

interface ImageAnalysis {
  url: string;
  alt: string;
  size: number;
  format: string;
  loading: string;
  issues: string[];
}

interface ImageAuditResultsProps {
  auditResults: {
    pages: {
      url: string;
      images: ImageAnalysis[];
    }[];
    summary: {
      imageAnalysis: {
        totalImages: number;
        unoptimizedImages: number;
        imagesWithoutAlt: number;
        imagesWithoutLazyLoading: number;
        largeImages: number;
        averageImageSize: number;
        formatDistribution: Record<string, number>;
        optimizationScore: number;
      };
    };
  };
}

const ImageAuditResults = ({ auditResults }: ImageAuditResultsProps) => {
  const { pages, summary } = auditResults;
  const { imageAnalysis } = summary;

  const allImages = pages.flatMap(page => 
    page.images.map(img => ({ ...img, pageUrl: page.url }))
  );

  const getImageIssueColor = (issues: string[]) => {
    if (issues.length === 0) return "text-green-600";
    if (issues.length <= 2) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{imageAnalysis.totalImages}</div>
            <p className="text-xs text-muted-foreground">Total Images</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">{imageAnalysis.unoptimizedImages}</div>
            <p className="text-xs text-muted-foreground">Unoptimized</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-orange-600">{imageAnalysis.imagesWithoutAlt}</div>
            <p className="text-xs text-muted-foreground">Missing Alt Text</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{Math.round(imageAnalysis.averageImageSize / 1024)}KB</div>
            <p className="text-xs text-muted-foreground">Avg Size</p>
          </CardContent>
        </Card>
      </div>

      {/* Optimization Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileImage className="h-5 w-5" />
            Image Optimization Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Score</span>
              <span className={`font-bold ${
                imageAnalysis.optimizationScore >= 80 ? 'text-green-600' : 
                imageAnalysis.optimizationScore >= 60 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {imageAnalysis.optimizationScore}%
              </span>
            </div>
            <Progress value={imageAnalysis.optimizationScore} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Format Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Image Format Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(imageAnalysis.formatDistribution).map(([format, count]) => (
              <div key={format} className="text-center">
                <div className="text-2xl font-bold">{count}</div>
                <div className="text-sm text-muted-foreground uppercase">{format}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Images List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileImage className="h-5 w-5" />
            All Images ({allImages.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {allImages.map((image, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-muted rounded flex-shrink-0 flex items-center justify-center">
                    <FileImage className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{image.url}</p>
                        <p className="text-xs text-muted-foreground">From: {image.pageUrl}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge variant="outline" className="text-xs">
                          {image.format?.toUpperCase() || 'Unknown'}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {Math.round((image.size || 0) / 1024)}KB
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                      <span>Alt: {image.alt || 'Missing'}</span>
                      <span>Loading: {image.loading || 'eager'}</span>
                    </div>

                    {image.issues && image.issues.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {image.issues.map((issue, issueIndex) => (
                          <Badge key={issueIndex} variant="destructive" className="text-xs">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            {issue}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-600">No issues found</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImageAuditResults;
