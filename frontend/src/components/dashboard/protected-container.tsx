'use client';

import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { cn } from '@/lib/utils';
import type { ProtectedContainerProps } from '@/types';
import { useState } from 'react';
import { ProtectedSidebar } from './protected-sidebar';

export function ProtectedContainer({ children, sidebarGroups }: ProtectedContainerProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <ProtectedSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        sidebarGroups={sidebarGroups}
      />

      {/* Main Content */}
      <div
        className={cn(
          'flex flex-1 flex-col transition-all duration-300',
          sidebarCollapsed ? 'ml-16' : 'ml-64'
        )}
      >
        {/* Header */}
        <DashboardHeader />
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
