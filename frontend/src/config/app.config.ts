import type { AppConfig } from "@/types";

export const appConfig: AppConfig = {
  // Application basic information
  app: {
    name: 'WD-Quiz-Lib',
    version: '0.1.0',
    description: 'A better SaaS application template',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    domain: 'wd-quiz-lib.com',
  },

  // SEO and metadata
  metadata: {
    title: {
      default: 'WD-Quiz-Lib',
      template: '%s | WD-Quiz-Lib',
    },
    description: 'A modern, full-stack SaaS application built with Next.js 15, featuring authentication, payments, file management, and internationalization.',
    keywords: ['SaaS', 'Next.js', 'React', 'TypeScript', 'Authentication', 'Payments', 'Stripe'],
    authors: [{ name: 'WD-Quiz-Lib Team' }],
    creator: 'WD-Quiz-Lib Team',
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      siteName: 'WD-Quiz-Lib',
    },
    twitter: {
      card: 'summary_large_image',
      creator: '@wd_quiz_lib',
    },
  },

  // Administrator configuration
  admin: {
    emails: process.env.ADMIN_EMAILS?.split(',').map(email => email.trim()).filter(Boolean) || [],
  },

  // File upload configuration
  upload: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
    maxFiles: 10,
  },

  // Pagination configuration
  pagination: {
    defaultPageSize: 10,
    maxPageSize: 100,
  },
}; 