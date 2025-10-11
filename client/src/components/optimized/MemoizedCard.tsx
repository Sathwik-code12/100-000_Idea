import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface IdeaCardProps {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  createdAt: Date;
}

// Memoized card component to prevent unnecessary re-renders
export const MemoizedIdeaCard = memo(({ id, title, category, description, tags, createdAt }: IdeaCardProps) => {
  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg line-clamp-2">{title}</CardTitle>
          <Badge variant="secondary" className="shrink-0 ml-2">
            {category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 line-clamp-3 mb-4">{description}</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.slice(0, 3).map((tag, index) => (
            <Badge key={`${id}-${tag}-${index}`} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{tags.length - 3} more
            </Badge>
          )}
        </div>
        <div className="text-xs text-gray-500">
          {createdAt.toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
});

MemoizedIdeaCard.displayName = 'MemoizedIdeaCard';