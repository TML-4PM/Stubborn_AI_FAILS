
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useModerationPanel } from './moderation/useModerationPanel';
import ModerationFilters from './moderation/ModerationFilters';
import ModerationGridView from './moderation/ModerationGridView';
import ModerationListView from './moderation/ModerationListView';

const ContentModerationPanel = () => {
  const {
    pendingSubmissions,
    isLoading,
    selectedSubmission,
    setSelectedSubmission,
    moderationNotes,
    setModerationNotes,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    moderateSubmission
  } = useModerationPanel();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Content Moderation</CardTitle>
        </CardHeader>
        <CardContent>
          <ModerationFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />

          <Tabs defaultValue="grid" className="w-full">
            <TabsList>
              <TabsTrigger value="grid">Grid View</TabsTrigger>
              <TabsTrigger value="list">List View</TabsTrigger>
            </TabsList>
            
            <TabsContent value="grid">
              <ModerationGridView
                submissions={pendingSubmissions}
                selectedSubmission={selectedSubmission}
                setSelectedSubmission={setSelectedSubmission}
                moderationNotes={moderationNotes}
                setModerationNotes={setModerationNotes}
                onModerate={moderateSubmission}
              />
            </TabsContent>
            
            <TabsContent value="list">
              <ModerationListView
                submissions={pendingSubmissions}
                onModerate={moderateSubmission}
              />
            </TabsContent>
          </Tabs>

          {isLoading && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}

          {!isLoading && pendingSubmissions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No submissions found.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentModerationPanel;
