module.exports = {

"[project]/frontend/src/config/i18n.config.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "i18nConfig": ()=>i18nConfig
});
const i18nConfig = {
    // Supported languages
    locales: [
        'en',
        'zh'
    ],
    // Default language
    defaultLocale: 'en',
    // Fallback language
    fallbackLocale: 'en',
    // Language configurations
    languages: {
        en: {
            name: 'English',
            nativeName: 'English',
            flag: '🇺🇸',
            dir: 'ltr',
            enabled: true
        },
        zh: {
            name: 'Chinese',
            nativeName: '中文',
            flag: '🇨🇳',
            dir: 'ltr',
            enabled: true
        }
    },
    // Routing configuration
    routing: {
        localePrefix: 'as-needed',
        localeDetection: false
    },
    // Translation namespaces
    namespaces: [
        'common',
        'auth',
        'dashboard',
        'toast',
        'sidebar',
        'navbar',
        'userMenu',
        'settings',
        'profile',
        'security',
        'faq',
        'blog',
        'blocks',
        'legal'
    ],
    // Date and time formats for each locale
    dateTimeFormats: {
        en: {
            short: {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            },
            medium: {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric'
            },
            long: {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                timeZoneName: 'short'
            }
        },
        zh: {
            short: {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            },
            medium: {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric'
            },
            long: {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                timeZoneName: 'short'
            }
        }
    },
    // Number formats for each locale
    numberFormats: {
        en: {
            currency: {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2
            },
            decimal: {
                style: 'decimal',
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            },
            percent: {
                style: 'percent',
                minimumFractionDigits: 0,
                maximumFractionDigits: 1
            }
        },
        zh: {
            currency: {
                style: 'currency',
                currency: 'CNY',
                minimumFractionDigits: 2
            },
            decimal: {
                style: 'decimal',
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            },
            percent: {
                style: 'percent',
                minimumFractionDigits: 0,
                maximumFractionDigits: 1
            }
        }
    }
};
}),
"[project]/frontend/src/i18n/routing.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "locales": ()=>locales,
    "routing": ()=>routing
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$intl$40$4$2e$3$2e$4_next$40$15$2e$4$2e$5_$40$babel$2b$core$40$7$2e$28$2e$0_$40$playwright$2b$test$40$1$2e$54$2e$1_react$2d$dom$40$19$2e$1$2e$1_686bcddb4f7a3d363c85f8ed58030556$2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$routing$2f$defineRouting$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__defineRouting$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next-intl@4.3.4_next@15.4.5_@babel+core@7.28.0_@playwright+test@1.54.1_react-dom@19.1.1_686bcddb4f7a3d363c85f8ed58030556/node_modules/next-intl/dist/esm/development/routing/defineRouting.js [app-rsc] (ecmascript) <export default as defineRouting>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$config$2f$i18n$2e$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/config/i18n.config.ts [app-rsc] (ecmascript)");
;
;
const routing = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$intl$40$4$2e$3$2e$4_next$40$15$2e$4$2e$5_$40$babel$2b$core$40$7$2e$28$2e$0_$40$playwright$2b$test$40$1$2e$54$2e$1_react$2d$dom$40$19$2e$1$2e$1_686bcddb4f7a3d363c85f8ed58030556$2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$routing$2f$defineRouting$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__defineRouting$3e$__["defineRouting"])({
    locales: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$config$2f$i18n$2e$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["i18nConfig"].locales,
    defaultLocale: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$config$2f$i18n$2e$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["i18nConfig"].defaultLocale,
    localePrefix: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$config$2f$i18n$2e$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["i18nConfig"].routing.localePrefix,
    localeDetection: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$config$2f$i18n$2e$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["i18nConfig"].routing.localeDetection
});
const locales = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$config$2f$i18n$2e$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["i18nConfig"].locales.map((locale)=>({
        name: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$config$2f$i18n$2e$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["i18nConfig"].languages[locale]?.name || locale,
        locale
    }));
}),
"[next]/internal/font/google/geist_c7c8da30.module.css [app-rsc] (css module)": ((__turbopack_context__) => {

__turbopack_context__.v({
  "className": "geist_c7c8da30-module__5SU7mq__className",
  "variable": "geist_c7c8da30-module__5SU7mq__variable",
});
}),
"[next]/internal/font/google/geist_c7c8da30.js [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "default": ()=>__TURBOPACK__default__export__
});
var __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$geist_c7c8da30$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__ = __turbopack_context__.i("[next]/internal/font/google/geist_c7c8da30.module.css [app-rsc] (css module)");
;
const fontData = {
    className: __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$geist_c7c8da30$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].className,
    style: {
        fontFamily: "'Geist', system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
        fontStyle: "normal"
    }
};
if (__TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$geist_c7c8da30$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].variable != null) {
    fontData.variable = __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$geist_c7c8da30$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].variable;
}
const __TURBOPACK__default__export__ = fontData;
}),
"[next]/internal/font/google/geist_mono_e5f6f0fa.module.css [app-rsc] (css module)": ((__turbopack_context__) => {

__turbopack_context__.v({
  "className": "geist_mono_e5f6f0fa-module__tiCLxa__className",
  "variable": "geist_mono_e5f6f0fa-module__tiCLxa__variable",
});
}),
"[next]/internal/font/google/geist_mono_e5f6f0fa.js [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "default": ()=>__TURBOPACK__default__export__
});
var __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$geist_mono_e5f6f0fa$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__ = __turbopack_context__.i("[next]/internal/font/google/geist_mono_e5f6f0fa.module.css [app-rsc] (css module)");
;
const fontData = {
    className: __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$geist_mono_e5f6f0fa$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].className,
    style: {
        fontFamily: "'Geist Mono', ui-monospace, SFMono-Regular, SF Mono, Menlo, Monaco, Consolas, monospace",
        fontStyle: "normal"
    }
};
if (__TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$geist_mono_e5f6f0fa$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].variable != null) {
    fontData.variable = __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$geist_mono_e5f6f0fa$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].variable;
}
const __TURBOPACK__default__export__ = fontData;
}),
"[project]/frontend/src/config/app.config.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "appConfig": ()=>appConfig
});
const appConfig = {
    // Application basic information
    app: {
        name: 'Better-SaaS',
        version: '0.1.0',
        description: 'A better SaaS application template',
        url: ("TURBOPACK compile-time value", "http://localhost:3000") || 'http://localhost:3000',
        domain: 'better-saas.com'
    },
    // SEO and metadata
    metadata: {
        title: {
            default: 'Better-SaaS',
            template: '%s | Better-SaaS'
        },
        description: 'A modern, full-stack SaaS application built with Next.js 15, featuring authentication, payments, file management, and internationalization.',
        keywords: [
            'SaaS',
            'Next.js',
            'React',
            'TypeScript',
            'Authentication',
            'Payments',
            'Stripe'
        ],
        authors: [
            {
                name: 'Better-SaaS Team'
            }
        ],
        creator: 'Better-SaaS Team',
        robots: {
            index: true,
            follow: true
        },
        openGraph: {
            type: 'website',
            locale: 'en_US',
            url: ("TURBOPACK compile-time value", "http://localhost:3000") || 'http://localhost:3000',
            siteName: 'Better-SaaS'
        },
        twitter: {
            card: 'summary_large_image',
            creator: '@better_saas'
        }
    },
    // Administrator configuration
    admin: {
        emails: process.env.ADMIN_EMAILS?.split(',').map((email)=>email.trim()).filter(Boolean) || []
    },
    // File upload configuration
    upload: {
        maxFileSize: 10 * 1024 * 1024,
        allowedTypes: [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
            'image/svg+xml'
        ],
        maxFiles: 10
    },
    // Pagination configuration
    pagination: {
        defaultPageSize: 10,
        maxPageSize: 100
    }
};
}),
"[project]/frontend/src/app/layout.tsx [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "default": ()=>RootLayout,
    "metadata": ()=>metadata
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$5_$40$babel$2b$core$40$7$2e$28$2e$0_$40$playwright$2b$test$40$1$2e$54$2e$1_react$2d$dom$40$19$2e$1$2e$1_react$40$19$2e$1$2e$1_$5f$react$40$19$2e$1$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.4.5_@babel+core@7.28.0_@playwright+test@1.54.1_react-dom@19.1.1_react@19.1.1__react@19.1.1/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$i18n$2f$routing$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/i18n/routing.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$geist_c7c8da30$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[next]/internal/font/google/geist_c7c8da30.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$geist_mono_e5f6f0fa$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[next]/internal/font/google/geist_mono_e5f6f0fa.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$config$2f$app$2e$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/config/app.config.ts [app-rsc] (ecmascript)");
;
;
;
;
;
;
const metadata = {
    title: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$config$2f$app$2e$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["appConfig"].metadata.title.default,
    description: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$config$2f$app$2e$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["appConfig"].metadata.description,
    keywords: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$config$2f$app$2e$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["appConfig"].metadata.keywords,
    authors: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$config$2f$app$2e$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["appConfig"].metadata.authors,
    creator: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$config$2f$app$2e$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["appConfig"].metadata.creator,
    robots: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$config$2f$app$2e$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["appConfig"].metadata.robots,
    openGraph: {
        type: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$config$2f$app$2e$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["appConfig"].metadata.openGraph.type,
        locale: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$config$2f$app$2e$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["appConfig"].metadata.openGraph.locale,
        url: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$config$2f$app$2e$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["appConfig"].metadata.openGraph.url,
        siteName: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$config$2f$app$2e$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["appConfig"].metadata.openGraph.siteName,
        title: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$config$2f$app$2e$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["appConfig"].metadata.title.default,
        description: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$config$2f$app$2e$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["appConfig"].metadata.description
    },
    twitter: {
        card: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$config$2f$app$2e$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["appConfig"].metadata.twitter.card,
        creator: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$config$2f$app$2e$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["appConfig"].metadata.twitter.creator,
        title: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$config$2f$app$2e$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["appConfig"].metadata.title.default,
        description: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$config$2f$app$2e$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["appConfig"].metadata.description
    },
    icons: {
        icon: [
            {
                url: '/icons/favicon-16x16.png',
                sizes: '16x16',
                type: 'image/png'
            },
            {
                url: '/icons/favicon-32x32.png',
                sizes: '32x32',
                type: 'image/png'
            },
            {
                url: '/favicon.ico',
                sizes: 'any'
            }
        ],
        apple: [
            {
                url: '/icons/apple-touch-icon.png',
                sizes: '180x180',
                type: 'image/png'
            }
        ],
        other: [
            {
                url: '/icons/android-chrome-192x192.png',
                sizes: '192x192',
                type: 'image/png'
            },
            {
                url: '/icons/android-chrome-512x512.png',
                sizes: '512x512',
                type: 'image/png'
            }
        ]
    },
    manifest: '/site.webmanifest'
};
async function RootLayout({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$5_$40$babel$2b$core$40$7$2e$28$2e$0_$40$playwright$2b$test$40$1$2e$54$2e$1_react$2d$dom$40$19$2e$1$2e$1_react$40$19$2e$1$2e$1_$5f$react$40$19$2e$1$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("html", {
        lang: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$i18n$2f$routing$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["routing"].defaultLocale,
        className: `${__TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$geist_c7c8da30$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].variable} ${__TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$geist_mono_e5f6f0fa$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].variable} antialiased`,
        suppressHydrationWarning: true,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$5_$40$babel$2b$core$40$7$2e$28$2e$0_$40$playwright$2b$test$40$1$2e$54$2e$1_react$2d$dom$40$19$2e$1$2e$1_react$40$19$2e$1$2e$1_$5f$react$40$19$2e$1$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("body", {
            children: children
        }, void 0, false, {
            fileName: "[project]/frontend/src/app/layout.tsx",
            lineNumber: 70,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/frontend/src/app/layout.tsx",
        lineNumber: 65,
        columnNumber: 5
    }, this);
}
}),
"[project]/node_modules/.pnpm/next@15.4.5_@babel+core@7.28.0_@playwright+test@1.54.1_react-dom@19.1.1_react@19.1.1__react@19.1.1/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { m: module, e: exports } = __turbopack_context__;
{
module.exports = __turbopack_context__.r("[project]/node_modules/.pnpm/next@15.4.5_@babel+core@7.28.0_@playwright+test@1.54.1_react-dom@19.1.1_react@19.1.1__react@19.1.1/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-rsc] (ecmascript)").vendored['react-rsc'].ReactJsxDevRuntime; //# sourceMappingURL=react-jsx-dev-runtime.js.map
}}),
"[project]/node_modules/.pnpm/next-intl@4.3.4_next@15.4.5_@babel+core@7.28.0_@playwright+test@1.54.1_react-dom@19.1.1_686bcddb4f7a3d363c85f8ed58030556/node_modules/next-intl/dist/esm/development/routing/defineRouting.js [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "default": ()=>defineRouting
});
function defineRouting(config) {
    if (config.domains) {
        validateUniqueLocalesPerDomain(config.domains);
    }
    return config;
}
function validateUniqueLocalesPerDomain(domains) {
    const domainsByLocale = new Map();
    for (const { domain, locales } of domains){
        for (const locale of locales){
            const localeDomains = domainsByLocale.get(locale) || new Set();
            localeDomains.add(domain);
            domainsByLocale.set(locale, localeDomains);
        }
    }
    const duplicateLocaleMessages = Array.from(domainsByLocale.entries()).filter(([, localeDomains])=>localeDomains.size > 1).map(([locale, localeDomains])=>`- "${locale}" is used by: ${Array.from(localeDomains).join(', ')}`);
    if (duplicateLocaleMessages.length > 0) {
        console.warn('Locales are expected to be unique per domain, but found overlap:\n' + duplicateLocaleMessages.join('\n') + '\nPlease see https://next-intl.dev/docs/routing#domains');
    }
}
;
}),
"[project]/node_modules/.pnpm/next-intl@4.3.4_next@15.4.5_@babel+core@7.28.0_@playwright+test@1.54.1_react-dom@19.1.1_686bcddb4f7a3d363c85f8ed58030556/node_modules/next-intl/dist/esm/development/routing/defineRouting.js [app-rsc] (ecmascript) <export default as defineRouting>": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "defineRouting": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$intl$40$4$2e$3$2e$4_next$40$15$2e$4$2e$5_$40$babel$2b$core$40$7$2e$28$2e$0_$40$playwright$2b$test$40$1$2e$54$2e$1_react$2d$dom$40$19$2e$1$2e$1_686bcddb4f7a3d363c85f8ed58030556$2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$routing$2f$defineRouting$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$intl$40$4$2e$3$2e$4_next$40$15$2e$4$2e$5_$40$babel$2b$core$40$7$2e$28$2e$0_$40$playwright$2b$test$40$1$2e$54$2e$1_react$2d$dom$40$19$2e$1$2e$1_686bcddb4f7a3d363c85f8ed58030556$2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$routing$2f$defineRouting$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next-intl@4.3.4_next@15.4.5_@babel+core@7.28.0_@playwright+test@1.54.1_react-dom@19.1.1_686bcddb4f7a3d363c85f8ed58030556/node_modules/next-intl/dist/esm/development/routing/defineRouting.js [app-rsc] (ecmascript)");
}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__52af2a61._.js.map