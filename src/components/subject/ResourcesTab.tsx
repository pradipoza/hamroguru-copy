import { Subject } from '@/lib/types';
import { mockMathResources } from '@/lib/demoMockData';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Video, FileText, BookOpen, Target, ExternalLink, Bookmark, Loader2, Library } from 'lucide-react';

interface ResourcesTabProps {
  subject: Subject;
}

const typeConfig = {
  video: { icon: Video, label: 'Video', color: 'text-red-500' },
  pdf: { icon: FileText, label: 'PDF', color: 'text-blue-500' },
  notes: { icon: BookOpen, label: 'Notes', color: 'text-green-500' },
  practice: { icon: Target, label: 'Practice', color: 'text-purple-500' },
};

function ResourceCard({ resource }: { resource: any }) {
  const config = typeConfig[resource.type as keyof typeof typeConfig] || typeConfig.notes;
  const Icon = config.icon;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center ${config.color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium">{resource.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {config.label}
                </Badge>
                {resource.chapter && (
                  <span className="text-xs text-muted-foreground">{resource.chapter}</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {resource.isBookmarked && (
              <Bookmark className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            )}
            <Button size="sm" variant="outline" className="gap-1" asChild>
              <a href={resource.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-3 h-3" />
                Open
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ResourcesTab({ subject }: ResourcesTabProps) {
  // For the demo, we'll show math resources for any subject.
  const resources = mockMathResources;
  const isLoading = false;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!resources || resources.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Library className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
        <p className="text-muted-foreground">No resources available yet.</p>
      </Card>
    );
  }

  const recommended = resources.filter(r => r.recommended);
  const bookmarked = resources.filter(r => r.isBookmarked);
  const others = resources.filter(r => !r.recommended && !r.isBookmarked);

  return (
    <div className="space-y-6">
      {recommended.length > 0 && (
        <div>
          <h3 className="font-medium text-sm text-muted-foreground mb-3">
            Recommended ({recommended.length})
          </h3>
          <div className="space-y-2">
            {recommended.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </div>
      )}

      {bookmarked.length > 0 && (
        <div>
          <h3 className="font-medium text-sm text-muted-foreground mb-3">
            Bookmarked ({bookmarked.length})
          </h3>
          <div className="space-y-2">
            {bookmarked.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </div>
      )}

      {others.length > 0 && (
        <div>
          <h3 className="font-medium text-sm text-muted-foreground mb-3">
            All Resources ({others.length})
          </h3>
          <div className="space-y-2">
            {others.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
