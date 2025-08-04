'use client';

import { Sun } from 'lucide-react';

import { Button } from '@/components/ui/button';

// Theme toggle disabled - forced to light theme only
export function ThemeToggle() {
  return (
    <Button variant="ghost" size="sm" className="gap-2" disabled>
      <Sun className="h-4 w-4" />
      <span className="sr-only">Light theme (forced)</span>
    </Button>
  );
}
