
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Play, Activity } from 'lucide-react';

interface AuditControlsProps {
  auditType: 'full' | 'seo' | 'accessibility' | 'performance';
  setAuditType: (type: 'full' | 'seo' | 'accessibility' | 'performance') => void;
  currentDomain: string;
  isRunning: boolean;
  onStartAudit: () => void;
}

const AuditControls = ({ 
  auditType, 
  setAuditType, 
  currentDomain, 
  isRunning, 
  onStartAudit 
}: AuditControlsProps) => {
  return (
    <div className="bg-muted/50 p-4 rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="font-medium">Auditing Website</h4>
          <p className="text-sm text-muted-foreground">{currentDomain}</p>
        </div>
        <div className="flex gap-2">
          <Select value={auditType} onValueChange={(value: any) => setAuditType(value)}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full">🔍 Full Site Audit</SelectItem>
              <SelectItem value="seo">🎯 SEO Analysis</SelectItem>
              <SelectItem value="accessibility">♿ Accessibility Check</SelectItem>
              <SelectItem value="performance">⚡ Performance Test</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            onClick={onStartAudit}
            disabled={isRunning}
            className="px-6"
          >
            {isRunning ? (
              <>
                <Activity className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Run Audit
              </>
            )}
          </Button>
        </div>
      </div>
      
      {isRunning && (
        <div className="space-y-2">
          <Progress value={65} className="w-full" />
          <p className="text-sm text-muted-foreground">
            Crawling pages and analyzing content...
          </p>
        </div>
      )}
    </div>
  );
};

export default AuditControls;
