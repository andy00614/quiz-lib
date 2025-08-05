'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  BookOpen, 
  Settings, 
  BarChart3, 
  FileText, 
  Plus,
  TrendingUp
} from 'lucide-react';

const navItems = [
  {
    href: '/knowledge',
    label: '知识库',
    icon: BookOpen,
  },
  {
    href: '/knowledge/new',
    label: '创建知识',
    icon: Plus,
  },
  {
    href: '/prompt-config',
    label: 'Prompt 配置',
    icon: Settings,
  },
  {
    href: '/statistics',
    label: '统计数据',
    icon: BarChart3,
  },
  {
    href: '/logs',
    label: '请求日志',
    icon: FileText,
  },
];

export function QuizNav() {
  const pathname = usePathname();

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/knowledge" className="text-xl font-bold">
              WD Quiz Lib
            </Link>
            
            <div className="hidden md:flex space-x-6">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || 
                  (item.href === '/knowledge' && pathname.startsWith('/knowledge') && pathname !== '/knowledge/new');
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}