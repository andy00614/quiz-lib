module.exports = {

"[project]/frontend/.next-internal/server/app/api/auth/[...all]/route/actions.js [app-rsc] (server actions loader, ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({});
}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}}),
"[project]/frontend/src/env.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "env": ()=>env
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$t3$2d$oss$2b$env$2d$nextjs$40$0$2e$12$2e$0_typescript$40$5$2e$8$2e$3_zod$40$3$2e$25$2e$76$2f$node_modules$2f40$t3$2d$oss$2f$env$2d$nextjs$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@t3-oss+env-nextjs@0.12.0_typescript@5.8.3_zod@3.25.76/node_modules/@t3-oss/env-nextjs/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/external.js [app-route] (ecmascript) <export * as z>");
;
;
const env = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$t3$2d$oss$2b$env$2d$nextjs$40$0$2e$12$2e$0_typescript$40$5$2e$8$2e$3_zod$40$3$2e$25$2e$76$2f$node_modules$2f40$t3$2d$oss$2f$env$2d$nextjs$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createEnv"])({
    /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */ server: {
        DATABASE_URL: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().url(),
        NODE_ENV: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
            'development',
            'test',
            'production'
        ]).default('development'),
        BETTER_AUTH_SECRET: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
        GITHUB_CLIENT_ID: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
        GITHUB_CLIENT_SECRET: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
        GOOGLE_CLIENT_ID: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
        GOOGLE_CLIENT_SECRET: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
        R2_BUCKET_NAME: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
        R2_ACCESS_KEY_ID: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
        R2_SECRET_ACCESS_KEY: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
        R2_ENDPOINT: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
        R2_PUBLIC_URL: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
        // Stripe
        STRIPE_SECRET_KEY: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
        STRIPE_WEBHOOK_SECRET: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
        // Admin Configuration
        ADMIN_EMAILS: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().default('')
    },
    /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */ client: {
        // NEXT_PUBLIC_CLIENTVAR: z.string(),
        NEXT_PUBLIC_APP_URL: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().url(),
        NEXT_PUBLIC_API_URL: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().url()
    },
    /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */ runtimeEnv: {
        DATABASE_URL: process.env.DATABASE_URL,
        NODE_ENV: ("TURBOPACK compile-time value", "development"),
        BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
        GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
        GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
        R2_BUCKET_NAME: process.env.R2_BUCKET_NAME,
        R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
        R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
        R2_ENDPOINT: process.env.R2_ENDPOINT,
        R2_PUBLIC_URL: process.env.R2_PUBLIC_URL,
        // Stripe
        STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
        STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
        NEXT_PUBLIC_APP_URL: ("TURBOPACK compile-time value", "http://localhost:3000"),
        NEXT_PUBLIC_API_URL: ("TURBOPACK compile-time value", "http://localhost:8000"),
        // Admin Configuration
        ADMIN_EMAILS: process.env.ADMIN_EMAILS
    },
    /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */ skipValidation: !!process.env.SKIP_ENV_VALIDATION,
    /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */ emptyStringAsUndefined: true
});
}),
"[project]/frontend/src/server/db/schema.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "account": ()=>account,
    "file": ()=>file,
    "payment": ()=>payment,
    "paymentEvent": ()=>paymentEvent,
    "session": ()=>session,
    "user": ()=>user,
    "verification": ()=>verification
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$boolean$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/drizzle-orm@0.41.0_@neondatabase+serverless@1.0.1_@types+pg@8.15.5_gel@2.1.1_kysely@0.28.3_postgres@3.4.7/node_modules/drizzle-orm/pg-core/columns/boolean.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/drizzle-orm@0.41.0_@neondatabase+serverless@1.0.1_@types+pg@8.15.5_gel@2.1.1_kysely@0.28.3_postgres@3.4.7/node_modules/drizzle-orm/pg-core/columns/integer.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/drizzle-orm@0.41.0_@neondatabase+serverless@1.0.1_@types+pg@8.15.5_gel@2.1.1_kysely@0.28.3_postgres@3.4.7/node_modules/drizzle-orm/pg-core/table.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/drizzle-orm@0.41.0_@neondatabase+serverless@1.0.1_@types+pg@8.15.5_gel@2.1.1_kysely@0.28.3_postgres@3.4.7/node_modules/drizzle-orm/pg-core/columns/text.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/drizzle-orm@0.41.0_@neondatabase+serverless@1.0.1_@types+pg@8.15.5_gel@2.1.1_kysely@0.28.3_postgres@3.4.7/node_modules/drizzle-orm/pg-core/columns/timestamp.js [app-route] (ecmascript)");
;
const user = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pgTable"])('user', {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('id').primaryKey(),
    name: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('name').notNull(),
    email: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('email').notNull().unique(),
    emailVerified: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$boolean$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["boolean"])('email_verified').$defaultFn(()=>false).notNull(),
    image: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('image'),
    createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])('created_at').$defaultFn(()=>/* @__PURE__ */ new Date()).notNull(),
    updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])('updated_at').$defaultFn(()=>/* @__PURE__ */ new Date()).notNull(),
    role: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('role'),
    banned: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$boolean$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["boolean"])('banned'),
    banReason: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('ban_reason'),
    banExpires: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])('ban_expires')
});
const session = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pgTable"])('session', {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('id').primaryKey(),
    expiresAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])('expires_at').notNull(),
    token: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('token').notNull().unique(),
    createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])('created_at').notNull(),
    updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])('updated_at').notNull(),
    ipAddress: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('ip_address'),
    userAgent: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('user_agent'),
    userId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('user_id').notNull().references(()=>user.id, {
        onDelete: 'cascade'
    }),
    impersonatedBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('impersonated_by')
});
const account = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pgTable"])('account', {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('id').primaryKey(),
    accountId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('account_id').notNull(),
    providerId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('provider_id').notNull(),
    userId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('user_id').notNull().references(()=>user.id, {
        onDelete: 'cascade'
    }),
    accessToken: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('access_token'),
    refreshToken: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('refresh_token'),
    idToken: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('id_token'),
    accessTokenExpiresAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])('access_token_expires_at'),
    refreshTokenExpiresAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])('refresh_token_expires_at'),
    scope: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('scope'),
    password: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('password'),
    createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])('created_at').notNull(),
    updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])('updated_at').notNull()
});
const verification = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pgTable"])('verification', {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('id').primaryKey(),
    identifier: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('identifier').notNull(),
    value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('value').notNull(),
    expiresAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])('expires_at').notNull(),
    createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])('created_at').$defaultFn(()=>/* @__PURE__ */ new Date()),
    updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])('updated_at').$defaultFn(()=>/* @__PURE__ */ new Date())
});
const file = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pgTable"])('file', {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('id').primaryKey(),
    filename: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('filename').notNull(),
    originalName: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('original_name').notNull(),
    mimeType: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('mime_type').notNull(),
    size: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])('size').notNull(),
    width: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])('width'),
    height: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])('height'),
    r2Key: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('r2_key').notNull(),
    thumbnailKey: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('thumbnail_key'),
    uploadUserId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('upload_user_id').notNull().references(()=>user.id, {
        onDelete: 'cascade'
    }),
    createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])('created_at').$defaultFn(()=>/* @__PURE__ */ new Date()).notNull(),
    updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])('updated_at').$defaultFn(()=>/* @__PURE__ */ new Date()).notNull()
});
const payment = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pgTable"])('payment', {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('id').primaryKey(),
    priceId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('price_id').notNull(),
    type: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('type').notNull(),
    interval: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('interval'),
    userId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('user_id').notNull().references(()=>user.id, {
        onDelete: 'cascade'
    }),
    customerId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('customer_id').notNull(),
    subscriptionId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('subscription_id'),
    status: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('status').notNull(),
    periodStart: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])('period_start'),
    periodEnd: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])('period_end'),
    cancelAtPeriodEnd: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$boolean$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["boolean"])('cancel_at_period_end'),
    trialStart: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])('trial_start'),
    trialEnd: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])('trial_end'),
    createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])('created_at').$defaultFn(()=>/* @__PURE__ */ new Date()).notNull(),
    updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])('updated_at').$defaultFn(()=>/* @__PURE__ */ new Date()).notNull()
});
const paymentEvent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pgTable"])('payment_event', {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('id').primaryKey(),
    paymentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('payment_id').notNull().references(()=>payment.id, {
        onDelete: 'cascade'
    }),
    eventType: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('event_type').notNull(),
    stripeEventId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('stripe_event_id').unique(),
    eventData: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('event_data'),
    createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])('created_at').$defaultFn(()=>/* @__PURE__ */ new Date()).notNull()
});
}),
"[project]/frontend/src/server/db/types.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "DatabaseError": ()=>DatabaseError
});
class DatabaseError extends Error {
    code;
    constructor(message, code){
        super(message), this.code = code;
        this.name = 'DatabaseError';
    }
}
}),
"[project]/frontend/src/server/db/repositories/base-repository.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "BaseRepository": ()=>BaseRepository
});
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$server$2f$db$2f$types$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/server/db/types.ts [app-route] (ecmascript)");
;
class BaseRepository {
    handleError(error, operation, code) {
        const message = error instanceof Error ? error.message : '未知错误';
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$server$2f$db$2f$types$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DatabaseError"](`${operation}失败: ${message}`, code);
    }
}
}),
"[project]/frontend/src/server/db/index.ts [app-route] (ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "default": ()=>__TURBOPACK__default__export__
});
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/env.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$neon$2d$http$2f$driver$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/drizzle-orm@0.41.0_@neondatabase+serverless@1.0.1_@types+pg@8.15.5_gel@2.1.1_kysely@0.28.3_postgres@3.4.7/node_modules/drizzle-orm/neon-http/driver.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$server$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/server/db/schema.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$server$2f$db$2f$repositories$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/frontend/src/server/db/repositories/index.ts [app-route] (ecmascript) <module evaluation>");
;
;
;
const db = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$neon$2d$http$2f$driver$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["drizzle"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["env"].DATABASE_URL, {
    schema: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$server$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
});
const __TURBOPACK__default__export__ = db;
;
}),
"[project]/frontend/src/server/db/repositories/file-repository.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "FileRepository": ()=>FileRepository,
    "fileRepository": ()=>fileRepository
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/drizzle-orm@0.41.0_@neondatabase+serverless@1.0.1_@types+pg@8.15.5_gel@2.1.1_kysely@0.28.3_postgres@3.4.7/node_modules/drizzle-orm/sql/expressions/conditions.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$select$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/drizzle-orm@0.41.0_@neondatabase+serverless@1.0.1_@types+pg@8.15.5_gel@2.1.1_kysely@0.28.3_postgres@3.4.7/node_modules/drizzle-orm/sql/expressions/select.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/drizzle-orm@0.41.0_@neondatabase+serverless@1.0.1_@types+pg@8.15.5_gel@2.1.1_kysely@0.28.3_postgres@3.4.7/node_modules/drizzle-orm/sql/sql.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$server$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/frontend/src/server/db/index.ts [app-route] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$server$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/frontend/src/server/db/index.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$server$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/server/db/schema.ts [app-route] (ecmascript)");
;
;
;
class FileRepository {
    async create(data) {
        const [created] = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$server$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].insert(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$server$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["file"]).values({
            ...data,
            createdAt: new Date(),
            updatedAt: new Date()
        }).returning();
        if (!created) {
            throw new Error('Failed to create file record');
        }
        return this.toFileInfo(created);
    }
    async findById(id) {
        const [found] = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$server$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].select().from(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$server$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["file"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$server$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["file"].id, id));
        return found ? this.toFileInfo(found) : null;
    }
    async findByUserId(userId, options = {}) {
        const { page = 1, limit = 20, search = '' } = options;
        const offset = (page - 1) * limit;
        const conditions = [
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$server$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["file"].uploadUserId, userId)
        ];
        if (search) {
            conditions.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ilike"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$server$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["file"].originalName, `%${search}%`));
        }
        const whereClause = conditions.length > 1 ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["and"])(...conditions) : conditions[0];
        // 获取总数
        const countResult = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$server$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].select({
            count: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`count(*)`.mapWith(Number)
        }).from(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$server$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["file"]).where(whereClause);
        const total = countResult[0]?.count || 0;
        // 获取文件列表
        const files = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$server$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].select().from(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$server$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["file"]).where(whereClause).orderBy((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$select$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["desc"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$server$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["file"].createdAt)).limit(limit).offset(offset);
        return {
            files: files.map((f)=>this.toFileInfo(f)),
            total
        };
    }
    async findAll(options = {}) {
        const { page = 1, limit = 20, search = '' } = options;
        const offset = (page - 1) * limit;
        let whereClause = undefined;
        if (search) {
            whereClause = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ilike"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$server$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["file"].originalName, `%${search}%`);
        }
        // 获取总数
        const countResult = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$server$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].select({
            count: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`count(*)`.mapWith(Number)
        }).from(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$server$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["file"]).where(whereClause);
        const total = countResult[0]?.count || 0;
        // 获取文件列表 (关联用户表)
        const files = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$server$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].select({
            file: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$server$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["file"],
            user: {
                email: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$server$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["user"].email
            }
        }).from(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$server$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["file"]).leftJoin(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$server$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["user"], (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$server$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["file"].uploadUserId, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$server$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["user"].id)).where(whereClause).orderBy((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$select$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["desc"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$server$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["file"].createdAt)).limit(limit).offset(offset);
        return {
            files: files.map((result)=>this.toFileInfoWithUser(result.file, result.user?.email)),
            total
        };
    }
    async delete(id) {
        const [deleted] = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$server$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].delete(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$server$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["file"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$server$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["file"].id, id)).returning();
        return !!deleted;
    }
    async deleteByUserId(userId, fileId) {
        const [deleted] = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$server$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].delete(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$server$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["file"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["and"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$server$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["file"].id, fileId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$41$2e$0_$40$neondatabase$2b$serverless$40$1$2e$0$2e$1_$40$types$2b$pg$40$8$2e$15$2e$5_gel$40$2$2e$1$2e$1_kysely$40$0$2e$28$2e$3_postgres$40$3$2e$4$2e$7$2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$server$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["file"].uploadUserId, userId))).returning();
        return !!deleted;
    }
    toFileInfo(fileRecord) {
        return {
            id: fileRecord.id,
            filename: fileRecord.filename,
            originalName: fileRecord.originalName,
            mimeType: fileRecord.mimeType,
            size: fileRecord.size,
            width: fileRecord.width || undefined,
            height: fileRecord.height || undefined,
            r2Key: fileRecord.r2Key,
            thumbnailKey: fileRecord.thumbnailKey || undefined,
            uploadUserId: fileRecord.uploadUserId,
            createdAt: fileRecord.createdAt.toISOString(),
            updatedAt: fileRecord.updatedAt.toISOString(),
            url: '',
            thumbnailUrl: undefined
        };
    }
    toFileInfoWithUser(fileRecord, userEmail) {
        return {
            id: fileRecord.id,
            filename: fileRecord.filename,
            originalName: fileRecord.originalName,
            mimeType: fileRecord.mimeType,
            size: fileRecord.size,
            width: fileRecord.width || undefined,
            height: fileRecord.height || undefined,
            r2Key: fileRecord.r2Key,
            thumbnailKey: fileRecord.thumbnailKey || undefined,
            uploadUserId: fileRecord.uploadUserId,
            uploadUserEmail: userEmail,
            createdAt: fileRecord.createdAt.toISOString(),
            updatedAt: fileRecord.updatedAt.toISOString(),
            url: '',
            thumbnailUrl: undefined
        };
    }
}
const fileRepository = new FileRepository();
}),
"[project]/frontend/src/server/db/repositories/index.ts [app-route] (ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$server$2f$db$2f$repositories$2f$base$2d$repository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/server/db/repositories/base-repository.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$server$2f$db$2f$repositories$2f$file$2d$repository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/server/db/repositories/file-repository.ts [app-route] (ecmascript)");
;
;
}),
"[project]/frontend/src/server/db/repositories/index.ts [app-route] (ecmascript) <module evaluation>": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$server$2f$db$2f$repositories$2f$base$2d$repository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/server/db/repositories/base-repository.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$server$2f$db$2f$repositories$2f$file$2d$repository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/server/db/repositories/file-repository.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$server$2f$db$2f$repositories$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/frontend/src/server/db/repositories/index.ts [app-route] (ecmascript) <locals>");
}),
"[project]/frontend/src/server/db/index.ts [app-route] (ecmascript) <module evaluation>": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/env.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$server$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/server/db/schema.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$server$2f$db$2f$repositories$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/frontend/src/server/db/repositories/index.ts [app-route] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$server$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/frontend/src/server/db/index.ts [app-route] (ecmascript) <locals>");
}),
"[externals]/node:crypto [external] (node:crypto, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}}),
"[externals]/node:buffer [external] (node:buffer, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}}),
"[externals]/node:util [external] (node:util, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:util", () => require("node:util"));

module.exports = mod;
}}),
"[externals]/node:http [external] (node:http, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:http", () => require("node:http"));

module.exports = mod;
}}),
"[externals]/node:https [external] (node:https, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:https", () => require("node:https"));

module.exports = mod;
}}),
"[externals]/node:events [external] (node:events, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:events", () => require("node:events"));

module.exports = mod;
}}),
"[externals]/node:crypto [external] (node:crypto, cjs) <export randomFillSync as default>": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "default": ()=>__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["randomFillSync"]
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
}),
"[project]/frontend/src/lib/auth/auth.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "auth": ()=>auth
});
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/env.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$server$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/frontend/src/server/db/index.ts [app-route] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$server$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/frontend/src/server/db/index.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$1_react$40$19$2e$1$2e$1_$5f$react$40$19$2e$1$2e$1$2f$node_modules$2f$better$2d$auth$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.4_react-dom@19.1.1_react@19.1.1__react@19.1.1/node_modules/better-auth/dist/index.mjs [app-route] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$1_react$40$19$2e$1$2e$1_$5f$react$40$19$2e$1$2e$1$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$Cbhy6WDJ$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__b__as__betterAuth$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.4_react-dom@19.1.1_react@19.1.1__react@19.1.1/node_modules/better-auth/dist/shared/better-auth.Cbhy6WDJ.mjs [app-route] (ecmascript) <export b as betterAuth>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$1_react$40$19$2e$1$2e$1_$5f$react$40$19$2e$1$2e$1$2f$node_modules$2f$better$2d$auth$2f$dist$2f$adapters$2f$drizzle$2d$adapter$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.4_react-dom@19.1.1_react@19.1.1__react@19.1.1/node_modules/better-auth/dist/adapters/drizzle-adapter/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$1_react$40$19$2e$1$2e$1_$5f$react$40$19$2e$1$2e$1$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.4_react-dom@19.1.1_react@19.1.1__react@19.1.1/node_modules/better-auth/dist/plugins/index.mjs [app-route] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$1_react$40$19$2e$1$2e$1_$5f$react$40$19$2e$1$2e$1$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$CeHRmQ1_$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__a__as__admin$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.4_react-dom@19.1.1_react@19.1.1__react@19.1.1/node_modules/better-auth/dist/shared/better-auth.CeHRmQ1_.mjs [app-route] (ecmascript) <export a as admin>");
;
;
;
;
;
const auth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$1_react$40$19$2e$1$2e$1_$5f$react$40$19$2e$1$2e$1$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$Cbhy6WDJ$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__b__as__betterAuth$3e$__["betterAuth"])({
    database: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$1_react$40$19$2e$1$2e$1_$5f$react$40$19$2e$1$2e$1$2f$node_modules$2f$better$2d$auth$2f$dist$2f$adapters$2f$drizzle$2d$adapter$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["drizzleAdapter"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$server$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"], {
        provider: 'pg'
    }),
    baseURL: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["env"].NEXT_PUBLIC_APP_URL,
    emailAndPassword: {
        enabled: true
    },
    socialProviders: {
        github: {
            clientId: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["env"].GITHUB_CLIENT_ID,
            clientSecret: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["env"].GITHUB_CLIENT_SECRET
        },
        google: {
            clientId: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["env"].GOOGLE_CLIENT_ID,
            clientSecret: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["env"].GOOGLE_CLIENT_SECRET
        }
    },
    session: {
        expiresIn: 60 * 60 * 24 * 30,
        updateAge: 60 * 60 * 24 * 3,
        cookieCache: {
            enabled: true,
            maxAge: 60 * 60
        }
    },
    plugins: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$1_react$40$19$2e$1$2e$1_$5f$react$40$19$2e$1$2e$1$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$CeHRmQ1_$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__a__as__admin$3e$__["admin"])()
    ]
});
}),
"[project]/frontend/src/app/api/auth/[...all]/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "GET": ()=>GET,
    "POST": ()=>POST
});
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$auth$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/lib/auth/auth.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$1_react$40$19$2e$1$2e$1_$5f$react$40$19$2e$1$2e$1$2f$node_modules$2f$better$2d$auth$2f$dist$2f$integrations$2f$next$2d$js$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.4_react-dom@19.1.1_react@19.1.1__react@19.1.1/node_modules/better-auth/dist/integrations/next-js.mjs [app-route] (ecmascript)");
;
;
const { POST, GET } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$1_react$40$19$2e$1$2e$1_$5f$react$40$19$2e$1$2e$1$2f$node_modules$2f$better$2d$auth$2f$dist$2f$integrations$2f$next$2d$js$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["toNextJsHandler"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$auth$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["auth"]);
}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__fe15de77._.js.map