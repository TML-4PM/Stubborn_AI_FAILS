
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, FileImage, AlertTriangle } from 'lucide-react';

interface AuditPagesTabProps {
  pages: any[];
}

const AuditPagesTab = ({ pages }: AuditPagesTabProps) => {
  const [selectedPage, setSelectedPage] = useState<string | null>(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Analyzed Pages
        </CardTitle>
      </CardHeader>
      <CardContent>
        {pages && pages.length > 0 ? (
          <div className="space-y-4">
            {pages.map((page: any, index: number) => (
              <div
                key={index}
                className="border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => setSelectedPage(selectedPage === page.url ? null : page.url)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{page.title || 'Untitled Page'}</h4>
                    <Badge variant={page.status === 200 ? "default" : "destructive"}>
                      {page.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {page.loadTime}ms
                  </div>
                </div>
                <div className="text-sm text-muted-foreground mb-2">
                  {page.url}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    {page.links?.length || 0} links
                  </span>
                  <span className="flex items-center gap-1">
                    <FileImage className="h-3 w-3" />
                    {page.images?.length || 0} images
                  </span>
                  <span className="flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    {page.errors?.length || 0} issues
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Globe className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No pages found in audit results</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AuditPagesTab;
