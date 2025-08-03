import React from 'react';
import { Heart, Search, Film } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  type: 'favorites' | 'search' | 'general';
  title: string;
  description: string;
  actionText?: string;
  actionLink?: string;
}

export default function EmptyState({ 
  type, 
  title, 
  description, 
  actionText, 
  actionLink 
}: EmptyStateProps) {
  const getIcon = () => {
    switch (type) {
      case 'favorites':
        return <Heart className="h-16 w-16 text-muted-foreground/50" />;
      case 'search':
        return <Search className="h-16 w-16 text-muted-foreground/50" />;
      default:
        return <Film className="h-16 w-16 text-muted-foreground/50" />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4">
        {getIcon()}
      </div>
      <h3 className="text-2xl font-semibold mb-2 text-foreground">
        {title}
      </h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        {description}
      </p>
      {actionText && actionLink && (
        <Button asChild className="bg-netflix-red hover:bg-netflix-red/90">
          <Link to={actionLink}>
            {actionText}
          </Link>
        </Button>
      )}
    </div>
  );
}