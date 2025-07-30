(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["chunks/[root-of-the-server]__7beafaa4._.js", {

"[externals]/node:buffer [external] (node:buffer, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}}),
"[project]/frontend/src/config/i18n.config.ts [middleware-edge] (ecmascript)": ((__turbopack_context__) => {
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
"[project]/frontend/src/i18n/routing.ts [middleware-edge] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "locales": ()=>locales,
    "routing": ()=>routing
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$intl$40$4$2e$3$2e$4_next$40$15$2e$4$2e$5_$40$babel$2b$core$40$7$2e$28$2e$0_$40$playwright$2b$test$40$1$2e$54$2e$1_react$2d$dom$40$19$2e$1$2e$1_686bcddb4f7a3d363c85f8ed58030556$2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$routing$2f$defineRouting$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$export__default__as__defineRouting$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next-intl@4.3.4_next@15.4.5_@babel+core@7.28.0_@playwright+test@1.54.1_react-dom@19.1.1_686bcddb4f7a3d363c85f8ed58030556/node_modules/next-intl/dist/esm/development/routing/defineRouting.js [middleware-edge] (ecmascript) <export default as defineRouting>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$config$2f$i18n$2e$config$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/config/i18n.config.ts [middleware-edge] (ecmascript)");
;
;
const routing = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$intl$40$4$2e$3$2e$4_next$40$15$2e$4$2e$5_$40$babel$2b$core$40$7$2e$28$2e$0_$40$playwright$2b$test$40$1$2e$54$2e$1_react$2d$dom$40$19$2e$1$2e$1_686bcddb4f7a3d363c85f8ed58030556$2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$routing$2f$defineRouting$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$export__default__as__defineRouting$3e$__["defineRouting"])({
    locales: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$config$2f$i18n$2e$config$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["i18nConfig"].locales,
    defaultLocale: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$config$2f$i18n$2e$config$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["i18nConfig"].defaultLocale,
    localePrefix: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$config$2f$i18n$2e$config$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["i18nConfig"].routing.localePrefix,
    localeDetection: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$config$2f$i18n$2e$config$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["i18nConfig"].routing.localeDetection
});
const locales = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$config$2f$i18n$2e$config$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["i18nConfig"].locales.map((locale)=>({
        name: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$config$2f$i18n$2e$config$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["i18nConfig"].languages[locale]?.name || locale,
        locale
    }));
}),
"[project]/frontend/src/middleware.ts [middleware-edge] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "config": ()=>config,
    "default": ()=>__TURBOPACK__default__export__
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$intl$40$4$2e$3$2e$4_next$40$15$2e$4$2e$5_$40$babel$2b$core$40$7$2e$28$2e$0_$40$playwright$2b$test$40$1$2e$54$2e$1_react$2d$dom$40$19$2e$1$2e$1_686bcddb4f7a3d363c85f8ed58030556$2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$middleware$2f$middleware$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next-intl@4.3.4_next@15.4.5_@babel+core@7.28.0_@playwright+test@1.54.1_react-dom@19.1.1_686bcddb4f7a3d363c85f8ed58030556/node_modules/next-intl/dist/esm/development/middleware/middleware.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$i18n$2f$routing$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/i18n/routing.ts [middleware-edge] (ecmascript)");
;
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$intl$40$4$2e$3$2e$4_next$40$15$2e$4$2e$5_$40$babel$2b$core$40$7$2e$28$2e$0_$40$playwright$2b$test$40$1$2e$54$2e$1_react$2d$dom$40$19$2e$1$2e$1_686bcddb4f7a3d363c85f8ed58030556$2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$middleware$2f$middleware$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["default"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$i18n$2f$routing$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["routing"]);
const config = {
    matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};
}),
}]);

//# sourceMappingURL=%5Broot-of-the-server%5D__7beafaa4._.js.map