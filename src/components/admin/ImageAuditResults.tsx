
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Image, 
  AlertTriangle, 
  CheckCircle, 
  Zap, 
  Eye, 
  Download,
  FileImage,
  Maximize,
  Shield
} from 'lucide-react';

interface ImageAnalysis {
  url: string;
  alt: string;
  hasAlt: boolean;
  loading?: string;
  width?: string;
  height?: string;
  status?: number;
  error?: string;
  fileSize?: number;
  format?: string;
  dimensions?: { width: number; height: number };
  isOptimized?: boolean;
  hasLazyLoading?: boolean;
  isResponsive?: boolean;
  accessibilityScore?: number;
  performanceScore?: number;
  recommendations?: string[];
  srcset?: string;
  sizes?: string;
}

interface ImageAuditResultsProps {
  auditResults: {
    pages: Array<{
      url: string;
      images: ImageAnalysis[];
    }>;
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
  const { imageAnalysis } = auditResults.summary;
  const allImages = auditResults.pages.flatMap(page => 
    page.images.map(img => ({ ...img, pageUrl: page.url }))
  );

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 75) return "text-blue-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 90) return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (score >= 60) return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    return <AlertTriangle className="h-4 w-4 text-red-600" />;
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getSeverityColor = (score: number) => {
    if (score >= 90) return "bg-green-100 text-green-800";
    if (score >= 75) return "bg-blue-100 text-blue-800";
    if (score >= 60) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div className="space-y-6">
      {/* Image Analysis Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileImage className="h-5 w-5" />
            Image Analysis Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{imageAnalysis.totalImages}</div>
              <div className="text-sm text-muted-foreground">Total Images</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{imageAnalysis.unoptimizedImages}</div>
              <div className="text-sm text-muted-foreground">Unoptimized</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{imageAnalysis.imagesWithoutAlt}</div>
              <div className="text-sm text-muted-foreground">Missing Alt Text</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{formatFileSize(imageAnalysis.averageImageSize)}</div>
              <div className="text-sm text-muted-foreground">Avg Size</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Image Optimization</span>
              <div className="flex items-center gap-2">
                {getScoreIcon(imageAnalysis.optimizationScore)}
                <span className={`font-medium ${getScoreColor(imageAnalysis.optimizationScore)}`}>
                  {imageAnalysis.optimizationScore}%
                </span>
              </div>
            </div>
            <Progress value={imageAnalysis.optimizationScore} className="h-2" />
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Format Distribution</h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(imageAnalysis.formatDistribution).map(([format, count]) => (
                <Badge key={format} variant="outline">
                  {format}: {count}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="issues" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="issues">🚨 Issues ({imageAnalysis.unoptimizedImages + imageAnalysis.imagesWithoutAlt})</TabsTrigger>
          <TabsTrigger value="gallery">🖼️ Image Gallery</TabsTrigger>
          <TabsTrigger value="performance">⚡ Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="issues" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Image Issues Detected
              </CardTitle>
            </CardHeader>
            <CardContent>
              {allImages.filter(img => 
                !img.hasAlt || img.isOptimized === false || (img.recommendations && img.recommendations.length > 0)
              ).length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-8 w-8 mx-auto mb-4 text-green-500" />
                  <p className="text-muted-foreground">No image issues detected! All images are optimized.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {allImages
                    .filter(img => 
                      !img.hasAlt || img.isOptimized === false || (img.recommendations && img.recommendations.length > 0)
                    )
                    .map((image, index) => (
                      <div key={index} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-16 h-16 bg-muted rounded flex items-center justify-center flex-shrink-0">
                            {image.status === 200 ? (
                              <img 
                                src={image.url} 
                                alt={image.alt || 'Image'} 
                                className="w-full h-full object-cover rounded"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            ) : (
                              <Image className="h-6 w-6 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium truncate">{image.url.split('/').pop()}</h4>
                              <div className="flex gap-1">
                                {!image.hasAlt && (
                                  <Badge variant="destructive" className="text-xs">No Alt</Badge>
                                )}
                                {image.isOptimized === false && (
                                  <Badge variant="destructive" className="text-xs">Unoptimized</Badge>
                                )}
                                {image.fileSize && image.fileSize > 500000 && (
                                  <Badge variant="destructive" className="text-xs">Large</Badge>
                                )}
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground space-y-1">
                              <div>📄 Page: {image.pageUrl}</div>
                              <div>📏 Size: {formatFileSize(image.fileSize)} • Format: {image.format}</div>
                              {image.dimensions && (
                                <div>📐 Dimensions: {image.dimensions.width}×{image.dimensions.height}</div>
                              )}
                            </div>
                            {image.recommendations && image.recommendations.length > 0 && (
                              <div className="mt-3">
                                <h5 className="text-sm font-medium mb-2">Recommendations:</h5>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                  {image.recommendations.map((rec, idx) => (
                                    <li key={idx} className="flex items-start gap-2">
                                      <span className="text-orange-500 mt-0.5">•</span>
                                      <span>{rec}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gallery" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Complete Image Gallery
              </CardTitle>
            </CardHeader>
            <CardContent>
              {allImages.length === 0 ? (
                <div className="text-center py-8">
                  <Image className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No images found on audited pages.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {allImages.map((image, index) => (
                    <div key={index} className="border rounded-lg p-3 space-y-3">
                      <div className="aspect-video bg-muted rounded flex items-center justify-center">
                        {image.status === 200 ? (
                          <img 
                            src={image.url} 
                            alt={image.alt || 'Image'} 
                            className="max-w-full max-h-full object-contain rounded"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="text-center">
                            <Image className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-xs text-muted-foreground">Failed to load</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium truncate">{image.url.split('/').pop()}</span>
                          <div className="flex gap-1">
                            {image.accessibilityScore !== undefined && (
                              <Badge variant="outline" className={`text-xs ${getSeverityColor(image.accessibilityScore)}`}>
                                A11y: {image.accessibilityScore}%
                              </Badge>
                            )}
                            {image.performanceScore !== undefined && (
                              <Badge variant="outline" className={`text-xs ${getSeverityColor(image.performanceScore)}`}>
                                Perf: {image.performanceScore}%
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-xs text-muted-foreground space-y-1">
                          <div>📏 {formatFileSize(image.fileSize)} • {image.format}</div>
                          <div>📄 {image.pageUrl}</div>
                          {image.alt && <div>🏷️ Alt: "{image.alt}"</div>}
                          {image.hasLazyLoading && <div>🚀 Lazy loading enabled</div>}
                          {image.isResponsive && <div>📱 Responsive image</div>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Image Performance Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Zap className="h-4 w-4" />
                <AlertDescription>
                  Large unoptimized images can significantly impact page load times and user experience.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-medium">Performance Issues</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Large Images (&gt;500KB):</span>
                      <span className="text-sm font-medium text-red-600">{imageAnalysis.largeImages}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Missing Lazy Loading:</span>
                      <span className="text-sm font-medium text-orange-600">{imageAnalysis.imagesWithoutLazyLoading}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Unoptimized Images:</span>
                      <span className="text-sm font-medium text-red-600">{imageAnalysis.unoptimizedImages}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Optimization Opportunities</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Use WebP/AVIF formats</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Implement lazy loading</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Add responsive images</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Compress large images</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Performance Issues */}
              <div className="space-y-3">
                <h4 className="font-medium">Top Performance Issues</h4>
                {allImages
                  .filter(img => img.performanceScore !== undefined && img.performanceScore < 70)
                  .sort((a, b) => (a.performanceScore || 100) - (b.performanceScore || 100))
                  .slice(0, 5)
                  .map((image, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{image.url.split('/').pop()}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatFileSize(image.fileSize)} • {image.format}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getScoreIcon(image.performanceScore || 0)}
                        <span className={`font-medium ${getScoreColor(image.performanceScore || 0)}`}>
                          {image.performanceScore}%
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ImageAuditResults;
