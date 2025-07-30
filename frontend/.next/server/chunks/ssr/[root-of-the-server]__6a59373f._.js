module.exports = {

"[project]/frontend/src/env.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "env": ()=>env
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$t3$2d$oss$2b$env$2d$nextjs$40$0$2e$12$2e$0_typescript$40$5$2e$8$2e$3_zod$40$3$2e$25$2e$76$2f$node_modules$2f40$t3$2d$oss$2f$env$2d$nextjs$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@t3-oss+env-nextjs@0.12.0_typescript@5.8.3_zod@3.25.76/node_modules/@t3-oss/env-nextjs/dist/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/external.js [app-ssr] (ecmascript) <export * as z>");
;
;
const env = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$t3$2d$oss$2b$env$2d$nextjs$40$0$2e$12$2e$0_typescript$40$5$2e$8$2e$3_zod$40$3$2e$25$2e$76$2f$node_modules$2f40$t3$2d$oss$2f$env$2d$nextjs$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createEnv"])({
    /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */ server: {
        DATABASE_URL: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().url(),
        NODE_ENV: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
            'development',
            'test',
            'production'
        ]).default('development'),
        BETTER_AUTH_SECRET: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
        GITHUB_CLIENT_ID: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
        GITHUB_CLIENT_SECRET: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
        GOOGLE_CLIENT_ID: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
        GOOGLE_CLIENT_SECRET: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
        R2_BUCKET_NAME: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
        R2_ACCESS_KEY_ID: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
        R2_SECRET_ACCESS_KEY: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
        R2_ENDPOINT: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
        R2_PUBLIC_URL: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
        // Stripe
        STRIPE_SECRET_KEY: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
        STRIPE_WEBHOOK_SECRET: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
        // Admin Configuration
        ADMIN_EMAILS: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().default('')
    },
    /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */ client: {
        // NEXT_PUBLIC_CLIENTVAR: z.string(),
        NEXT_PUBLIC_APP_URL: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().url(),
        NEXT_PUBLIC_API_URL: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().url()
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
"[project]/frontend/src/lib/auth/auth-client.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "authClient": ()=>authClient
});
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$env$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/env.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$1_react$40$19$2e$1$2e$1_$5f$react$40$19$2e$1$2e$1$2f$node_modules$2f$better$2d$auth$2f$dist$2f$client$2f$plugins$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.4_react-dom@19.1.1_react@19.1.1__react@19.1.1/node_modules/better-auth/dist/client/plugins/index.mjs [app-ssr] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$1_react$40$19$2e$1$2e$1_$5f$react$40$19$2e$1$2e$1$2f$node_modules$2f$better$2d$auth$2f$dist$2f$client$2f$plugins$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.4_react-dom@19.1.1_react@19.1.1__react@19.1.1/node_modules/better-auth/dist/client/plugins/index.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$1_react$40$19$2e$1$2e$1_$5f$react$40$19$2e$1$2e$1$2f$node_modules$2f$better$2d$auth$2f$dist$2f$client$2f$react$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.4_react-dom@19.1.1_react@19.1.1__react@19.1.1/node_modules/better-auth/dist/client/react/index.mjs [app-ssr] (ecmascript)");
;
;
;
const authClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$1_react$40$19$2e$1$2e$1_$5f$react$40$19$2e$1$2e$1$2f$node_modules$2f$better$2d$auth$2f$dist$2f$client$2f$react$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createAuthClient"])({
    baseURL: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$env$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["env"].NEXT_PUBLIC_APP_URL,
    plugins: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$1_react$40$19$2e$1$2e$1_$5f$react$40$19$2e$1$2e$1$2f$node_modules$2f$better$2d$auth$2f$dist$2f$client$2f$plugins$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["adminClient"])()
    ]
});
}),
"[externals]/module [external] (module, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("module", () => require("module"));

module.exports = mod;
}}),
"[externals]/node:path [external] (node:path, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:path", () => require("node:path"));

module.exports = mod;
}}),
"[externals]/events [external] (events, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}}),
"[externals]/worker_threads [external] (worker_threads, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("worker_threads", () => require("worker_threads"));

module.exports = mod;
}}),
"[externals]/path [external] (path, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}}),
"[externals]/url [external] (url, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}}),
"[externals]/buffer [external] (buffer, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}}),
"[externals]/assert [external] (assert, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("assert", () => require("assert"));

module.exports = mod;
}}),
"[externals]/node:os [external] (node:os, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:os", () => require("node:os"));

module.exports = mod;
}}),
"[externals]/node:events [external] (node:events, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:events", () => require("node:events"));

module.exports = mod;
}}),
"[externals]/fs [external] (fs, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}}),
"[externals]/util [external] (util, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}}),
"[project]/frontend/src/lib/logger/logger.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "createChildLogger": ()=>createChildLogger,
    "default": ()=>__TURBOPACK__default__export__
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$pino$40$9$2e$7$2e$0$2f$node_modules$2f$pino$2f$pino$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/pino@9.7.0/node_modules/pino/pino.js [app-ssr] (ecmascript)");
;
const logger = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$pino$40$9$2e$7$2e$0$2f$node_modules$2f$pino$2f$pino$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])({
    level: ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 'debug',
    // 暂时禁用 pino-pretty 以避免与 Next.js 15 的兼容性问题
    // transport: process.env.NODE_ENV !== 'production' ? {
    //   target: 'pino-pretty',
    //   options: {
    //     colorize: true,
    //     translateTime: 'SYS:standard',
    //     ignore: 'pid,hostname',
    //     singleLine: true,
    //   },
    // } : undefined,
    ...("TURBOPACK compile-time value", "development") === 'production' && {
        formatters: {
            level: (label)=>{
                return {
                    level: label
                };
            }
        },
        timestamp: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$pino$40$9$2e$7$2e$0$2f$node_modules$2f$pino$2f$pino$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].stdTimeFunctions.isoTime
    }
});
const createChildLogger = (name)=>{
    return logger.child({
        service: name
    });
};
const __TURBOPACK__default__export__ = logger;
}),
"[project]/frontend/src/lib/logger/logger-utils.ts [app-ssr] (ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "ErrorLogger": ()=>ErrorLogger,
    "LogLevel": ()=>LogLevel,
    "PerformanceLogger": ()=>PerformanceLogger,
    "logUtils": ()=>logUtils
});
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$logger$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/lib/logger/logger.ts [app-ssr] (ecmascript)");
;
var LogLevel = /*#__PURE__*/ function(LogLevel) {
    LogLevel["FATAL"] = "fatal";
    LogLevel["ERROR"] = "error";
    LogLevel["WARN"] = "warn";
    LogLevel["INFO"] = "info";
    LogLevel["DEBUG"] = "debug";
    LogLevel["TRACE"] = "trace";
    return LogLevel;
}({});
class PerformanceLogger {
    startTime;
    logger;
    constructor(operation, context){
        this.startTime = Date.now();
        this.logger = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$logger$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createChildLogger"])('performance');
        this.logger.info({
            operation,
            ...context,
            event: 'start'
        }, `start ${operation}`);
    }
    end(additionalContext) {
        const duration = Date.now() - this.startTime;
        this.logger.info({
            duration,
            ...additionalContext,
            event: 'end'
        }, `end,total time: ${duration}ms`);
        return duration;
    }
}
class ErrorLogger {
    logger;
    constructor(service){
        this.logger = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$logger$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createChildLogger"])(service);
    }
    logError(error, context) {
        this.logger.error({
            error: {
                name: error.name,
                message: error.message,
                stack: error.stack
            },
            ...context
        }, `error: ${error.message}`);
    }
    logApiError(error, request, context) {
        this.logger.error({
            error: {
                name: error.name,
                message: error.message,
                stack: error.stack
            },
            request,
            ...context
        }, `api error: ${error.message}`);
    }
}
const logUtils = {
    startPerformanceLog: (operation, context)=>{
        return new PerformanceLogger(operation, context);
    },
    createErrorLogger: (service)=>{
        return new ErrorLogger(service);
    },
    logApiCall: (method, url, duration, status, context)=>{
        const apiLogger = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$logger$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createChildLogger"])('api');
        apiLogger.info({
            method,
            url,
            duration,
            status,
            ...context,
            type: 'api_call'
        }, `api call: ${method} ${url} - ${status} (${duration}ms)`);
    },
    // 快速记录数据库操作
    logDbOperation: (operation, table, duration, context)=>{
        const dbLogger = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$logger$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createChildLogger"])('database');
        dbLogger.info({
            operation,
            table,
            duration,
            ...context,
            type: 'db_operation'
        }, `db operation: ${operation} on ${table} (${duration}ms)`);
    },
    // 记录安全事件
    logSecurityEvent: (event, severity, context)=>{
        const securityLogger = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$logger$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createChildLogger"])('security');
        const logMethod = severity === 'critical' ? 'fatal' : severity === 'high' ? 'error' : severity === 'medium' ? 'warn' : 'info';
        securityLogger[logMethod]({
            event,
            severity,
            ...context,
            type: 'security_event'
        }, `security event: ${event} [${severity.toUpperCase()}]`);
    }
};
;
}),
"[project]/frontend/src/lib/logger/logger-utils.ts [app-ssr] (ecmascript) <module evaluation>": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$logger$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/lib/logger/logger.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$logger$2f$logger$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/frontend/src/lib/logger/logger-utils.ts [app-ssr] (ecmascript) <locals>");
}),
"[project]/frontend/src/store/auth-store.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "useAuthError": ()=>useAuthError,
    "useAuthInitialized": ()=>useAuthInitialized,
    "useAuthLoading": ()=>useAuthLoading,
    "useAuthStore": ()=>useAuthStore,
    "useClearError": ()=>useClearError,
    "useEmailLogin": ()=>useEmailLogin,
    "useEmailSignup": ()=>useEmailSignup,
    "useInitialize": ()=>useInitialize,
    "useIsAuthenticated": ()=>useIsAuthenticated,
    "useRefreshSession": ()=>useRefreshSession,
    "useSetError": ()=>useSetError,
    "useSignInWithGithub": ()=>useSignInWithGithub,
    "useSignInWithGoogle": ()=>useSignInWithGoogle,
    "useSignOut": ()=>useSignOut,
    "useUpdateUser": ()=>useUpdateUser,
    "useUser": ()=>useUser
});
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$auth$2f$auth$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/lib/auth/auth-client.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$6_$40$types$2b$react$40$19$2e$1$2e$9_immer$40$10$2e$1$2e$1_react$40$19$2e$1$2e$1_use$2d$sync$2d$external$2d$store$40$1$2e$5$2e$0_react$40$19$2e$1$2e$1_$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zustand@5.0.6_@types+react@19.1.9_immer@10.1.1_react@19.1.1_use-sync-external-store@1.5.0_react@19.1.1_/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$6_$40$types$2b$react$40$19$2e$1$2e$9_immer$40$10$2e$1$2e$1_react$40$19$2e$1$2e$1_use$2d$sync$2d$external$2d$store$40$1$2e$5$2e$0_react$40$19$2e$1$2e$1_$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zustand@5.0.6_@types+react@19.1.9_immer@10.1.1_react@19.1.1_use-sync-external-store@1.5.0_react@19.1.1_/node_modules/zustand/esm/middleware.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$logger$2f$logger$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/frontend/src/lib/logger/logger-utils.ts [app-ssr] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$logger$2f$logger$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/frontend/src/lib/logger/logger-utils.ts [app-ssr] (ecmascript) <locals>");
;
;
;
;
const authErrorLogger = new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$logger$2f$logger$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ErrorLogger"]('auth-store');
const useAuthStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$6_$40$types$2b$react$40$19$2e$1$2e$9_immer$40$10$2e$1$2e$1_react$40$19$2e$1$2e$1_use$2d$sync$2d$external$2d$store$40$1$2e$5$2e$0_react$40$19$2e$1$2e$1_$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$6_$40$types$2b$react$40$19$2e$1$2e$9_immer$40$10$2e$1$2e$1_react$40$19$2e$1$2e$1_use$2d$sync$2d$external$2d$store$40$1$2e$5$2e$0_react$40$19$2e$1$2e$1_$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["subscribeWithSelector"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$6_$40$types$2b$react$40$19$2e$1$2e$9_immer$40$10$2e$1$2e$1_react$40$19$2e$1$2e$1_use$2d$sync$2d$external$2d$store$40$1$2e$5$2e$0_react$40$19$2e$1$2e$1_$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["persist"])((set, get)=>({
        // Persistent state - default values must match server-side
        user: null,
        isAuthenticated: false,
        lastUpdated: 0,
        // Temporary state
        isLoading: false,
        error: null,
        isInitialized: false,
        cacheExpiry: 10 * 60 * 1000,
        // Cache methods
        isCacheValid: ()=>{
            const { lastUpdated, cacheExpiry } = get();
            return lastUpdated > 0 && Date.now() - lastUpdated < cacheExpiry;
        },
        invalidateCache: ()=>set({
                lastUpdated: 0
            }),
        setCacheExpiry: (expiry)=>set({
                cacheExpiry: expiry
            }),
        // Actions
        setUser: (user)=>{
            set({
                user,
                isAuthenticated: !!user,
                lastUpdated: Date.now()
            });
        },
        setLoading: (loading)=>{
            set({
                isLoading: loading
            });
        },
        setInitialized: (initialized)=>{
            set({
                isInitialized: initialized
            });
        },
        setError: (error)=>{
            set({
                error
            });
        },
        clearError: ()=>{
            set({
                error: null
            });
        },
        signIn: async (email, password)=>{
            set({
                isLoading: true,
                error: null
            });
            try {
                const result = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$auth$2f$auth$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authClient"].signIn.email({
                    email,
                    password
                });
                if (result.data) {
                    const user = result.data.user;
                    set({
                        user,
                        isAuthenticated: true,
                        isLoading: false,
                        lastUpdated: Date.now()
                    });
                    return {
                        success: true
                    };
                }
                set({
                    isLoading: false
                });
                return {
                    success: false,
                    error: result.error?.message || 'signIn error'
                };
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'signIn error';
                set({
                    error: errorMessage,
                    isLoading: false
                });
                return {
                    success: false,
                    error: errorMessage
                };
            }
        },
        signUp: async (email, password, name)=>{
            set({
                isLoading: true,
                error: null
            });
            try {
                const result = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$auth$2f$auth$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authClient"].signUp.email({
                    email: email,
                    password,
                    name: name || ''
                });
                if (result.data) {
                    const user = result.data.user;
                    set({
                        user,
                        isAuthenticated: true,
                        isLoading: false,
                        lastUpdated: Date.now()
                    });
                    return {
                        success: true
                    };
                }
                set({
                    isLoading: false
                });
                return {
                    success: false,
                    error: result.error?.message || 'signUp error'
                };
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'signUp error';
                set({
                    error: errorMessage,
                    isLoading: false
                });
                return {
                    success: false,
                    error: errorMessage
                };
            }
        },
        signOut: async ()=>{
            set({
                isLoading: true
            });
            try {
                await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$auth$2f$auth$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authClient"].signOut();
                set({
                    user: null,
                    isAuthenticated: false,
                    isLoading: false,
                    lastUpdated: 0
                });
            } catch (error) {
                authErrorLogger.logError(error, {
                    operation: 'signOut'
                });
                set({
                    user: null,
                    isAuthenticated: false,
                    isLoading: false,
                    lastUpdated: 0
                });
            }
        },
        signInWithGithub: async ()=>{
            set({
                isLoading: true,
                error: null
            });
            try {
                await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$auth$2f$auth$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authClient"].signIn.social({
                    provider: 'github'
                });
                // Clear cache to force refresh
                set({
                    lastUpdated: 0
                });
            } catch (error) {
                authErrorLogger.logError(error, {
                    operation: 'signInWithGithub'
                });
                set({
                    isLoading: false
                });
            }
        },
        signInWithGoogle: async ()=>{
            set({
                isLoading: true,
                error: null
            });
            try {
                await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$auth$2f$auth$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authClient"].signIn.social({
                    provider: 'google'
                });
                // Clear cache to force refresh
                set({
                    lastUpdated: 0
                });
            } catch (error) {
                authErrorLogger.logError(error, {
                    operation: 'signInWithGoogle'
                });
                set({
                    isLoading: false
                });
            }
        },
        updateUser: async (data)=>{
            set({
                isLoading: true,
                error: null
            });
            try {
                const result = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$auth$2f$auth$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authClient"].updateUser(data);
                if (result.data?.status) {
                    await get().refreshSession();
                    set({
                        isLoading: false
                    });
                    return {
                        success: true
                    };
                }
                set({
                    isLoading: false
                });
                return {
                    success: false,
                    error: result.error?.message || 'updateUser error'
                };
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'updateUser error';
                set({
                    error: errorMessage,
                    isLoading: false
                });
                return {
                    success: false,
                    error: errorMessage
                };
            }
        },
        refreshSession: async ()=>{
            try {
                const session = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$auth$2f$auth$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authClient"].getSession();
                if (session.data) {
                    const user = session.data.user;
                    set({
                        user,
                        isAuthenticated: true,
                        lastUpdated: Date.now()
                    });
                } else {
                    set({
                        user: null,
                        isAuthenticated: false,
                        lastUpdated: Date.now()
                    });
                }
            } catch (error) {
                authErrorLogger.logError(error, {
                    operation: 'refreshSession'
                });
                set({
                    user: null,
                    isAuthenticated: false,
                    lastUpdated: Date.now()
                });
            }
        },
        initialize: async ()=>{
            if (get().isInitialized) return;
            set({
                isLoading: true
            });
            try {
                // Always check server session to ensure consistency
                const session = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$auth$2f$auth$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authClient"].getSession();
                if (session.data) {
                    const user = session.data.user;
                    set({
                        user,
                        isAuthenticated: true,
                        isLoading: false,
                        isInitialized: true,
                        lastUpdated: Date.now()
                    });
                } else {
                    // Only clear auth if cache is invalid or expired
                    if (!get().isCacheValid()) {
                        set({
                            user: null,
                            isAuthenticated: false,
                            isLoading: false,
                            isInitialized: true,
                            lastUpdated: Date.now()
                        });
                    } else {
                        // Keep existing state if cache is valid
                        set({
                            isLoading: false,
                            isInitialized: true
                        });
                    }
                }
            } catch (error) {
                authErrorLogger.logError(error, {
                    operation: 'initialize'
                });
                // On error, keep existing state if cache is valid
                if (!get().isCacheValid()) {
                    set({
                        user: null,
                        isAuthenticated: false,
                        isLoading: false,
                        isInitialized: true,
                        lastUpdated: Date.now()
                    });
                } else {
                    set({
                        isLoading: false,
                        isInitialized: true
                    });
                }
            }
        },
        clearAuth: ()=>{
            set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                lastUpdated: 0
            });
        }
    }), {
    name: 'better-saas-auth',
    storage: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$6_$40$types$2b$react$40$19$2e$1$2e$9_immer$40$10$2e$1$2e$1_react$40$19$2e$1$2e$1_use$2d$sync$2d$external$2d$store$40$1$2e$5$2e$0_react$40$19$2e$1$2e$1_$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createJSONStorage"])(()=>localStorage),
    // Only persist safe state fields
    partialize: (state)=>({
            user: state.user,
            isAuthenticated: state.isAuthenticated,
            lastUpdated: state.lastUpdated,
            cacheExpiry: state.cacheExpiry
        }),
    skipHydration: false,
    version: 1
})));
const useUser = ()=>useAuthStore((state)=>state.user);
const useIsAuthenticated = ()=>useAuthStore((state)=>state.isAuthenticated);
const useAuthLoading = ()=>useAuthStore((state)=>state.isLoading);
const useAuthInitialized = ()=>useAuthStore((state)=>state.isInitialized);
const useAuthError = ()=>useAuthStore((state)=>state.error);
const useInitialize = ()=>useAuthStore((state)=>state.initialize);
const useEmailLogin = ()=>useAuthStore((state)=>state.signIn);
const useClearError = ()=>useAuthStore((state)=>state.clearError);
const useSignInWithGithub = ()=>useAuthStore((state)=>state.signInWithGithub);
const useSignInWithGoogle = ()=>useAuthStore((state)=>state.signInWithGoogle);
const useSignOut = ()=>useAuthStore((state)=>state.signOut);
const useRefreshSession = ()=>useAuthStore((state)=>state.refreshSession);
const useEmailSignup = ()=>useAuthStore((state)=>state.signUp);
const useSetError = ()=>useAuthStore((state)=>state.setError);
const useUpdateUser = ()=>useAuthStore((state)=>state.updateUser);
}),
"[project]/frontend/src/components/providers/auth-provider.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "AuthProvider": ()=>AuthProvider
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$5_$40$babel$2b$core$40$7$2e$28$2e$0_$40$playwright$2b$test$40$1$2e$54$2e$1_react$2d$dom$40$19$2e$1$2e$1_react$40$19$2e$1$2e$1_$5f$react$40$19$2e$1$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.4.5_@babel+core@7.28.0_@playwright+test@1.54.1_react-dom@19.1.1_react@19.1.1__react@19.1.1/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$store$2f$auth$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/store/auth-store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$5_$40$babel$2b$core$40$7$2e$28$2e$0_$40$playwright$2b$test$40$1$2e$54$2e$1_react$2d$dom$40$19$2e$1$2e$1_react$40$19$2e$1$2e$1_$5f$react$40$19$2e$1$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.4.5_@babel+core@7.28.0_@playwright+test@1.54.1_react-dom@19.1.1_react@19.1.1__react@19.1.1/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
;
;
function AuthProvider({ children }) {
    const initialize = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$store$2f$auth$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useInitialize"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$5_$40$babel$2b$core$40$7$2e$28$2e$0_$40$playwright$2b$test$40$1$2e$54$2e$1_react$2d$dom$40$19$2e$1$2e$1_react$40$19$2e$1$2e$1_$5f$react$40$19$2e$1$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        initialize();
    }, [
        initialize
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$5_$40$babel$2b$core$40$7$2e$28$2e$0_$40$playwright$2b$test$40$1$2e$54$2e$1_react$2d$dom$40$19$2e$1$2e$1_react$40$19$2e$1$2e$1_$5f$react$40$19$2e$1$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$5_$40$babel$2b$core$40$7$2e$28$2e$0_$40$playwright$2b$test$40$1$2e$54$2e$1_react$2d$dom$40$19$2e$1$2e$1_react$40$19$2e$1$2e$1_$5f$react$40$19$2e$1$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: children
    }, void 0, false);
}
}),
"[project]/frontend/src/config/theme.config.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "themeConfig": ()=>themeConfig
});
const themeConfig = {
    // Default theme
    defaultTheme: 'system',
    // Available themes
    themes: [
        'light',
        'dark',
        'system'
    ],
    // Color palette
    colors: {
        primary: {
            50: '#eff6ff',
            100: '#dbeafe',
            200: '#bfdbfe',
            300: '#93c5fd',
            400: '#60a5fa',
            500: '#3b82f6',
            600: '#2563eb',
            700: '#1d4ed8',
            800: '#1e40af',
            900: '#1e3a8a',
            950: '#172554'
        },
        secondary: {
            50: '#f9fafb',
            100: '#f3f4f6',
            200: '#e5e7eb',
            300: '#d1d5db',
            400: '#9ca3af',
            500: '#6b7280',
            600: '#4b5563',
            700: '#374151',
            800: '#1f2937',
            900: '#111827',
            950: '#030712'
        },
        accent: {
            50: '#fdf4ff',
            100: '#fae8ff',
            200: '#f5d0fe',
            300: '#f0abfc',
            400: '#e879f9',
            500: '#d946ef',
            600: '#c026d3',
            700: '#a21caf',
            800: '#86198f',
            900: '#701a75',
            950: '#4a044e'
        },
        neutral: {
            50: '#fafafa',
            100: '#f5f5f5',
            200: '#e5e5e5',
            300: '#d4d4d4',
            400: '#a3a3a3',
            500: '#737373',
            600: '#525252',
            700: '#404040',
            800: '#262626',
            900: '#171717',
            950: '#0a0a0a'
        },
        success: {
            50: '#f0fdf4',
            100: '#dcfce7',
            200: '#bbf7d0',
            300: '#86efac',
            400: '#4ade80',
            500: '#22c55e',
            600: '#16a34a',
            700: '#15803d',
            800: '#166534',
            900: '#14532d',
            950: '#052e16'
        },
        warning: {
            50: '#fffbeb',
            100: '#fef3c7',
            200: '#fde68a',
            300: '#fcd34d',
            400: '#fbbf24',
            500: '#f59e0b',
            600: '#d97706',
            700: '#b45309',
            800: '#92400e',
            900: '#78350f',
            950: '#451a03'
        },
        error: {
            50: '#fef2f2',
            100: '#fee2e2',
            200: '#fecaca',
            300: '#fca5a5',
            400: '#f87171',
            500: '#ef4444',
            600: '#dc2626',
            700: '#b91c1c',
            800: '#991b1b',
            900: '#7f1d1d',
            950: '#450a0a'
        },
        info: {
            50: '#eff6ff',
            100: '#dbeafe',
            200: '#bfdbfe',
            300: '#93c5fd',
            400: '#60a5fa',
            500: '#3b82f6',
            600: '#2563eb',
            700: '#1d4ed8',
            800: '#1e40af',
            900: '#1e3a8a',
            950: '#172554'
        }
    },
    // Font families
    fonts: {
        sans: [
            'var(--font-geist-sans)',
            'system-ui',
            '-apple-system',
            'BlinkMacSystemFont',
            'Segoe UI',
            'Roboto',
            'sans-serif'
        ],
        mono: [
            'var(--font-geist-mono)',
            'ui-monospace',
            'SFMono-Regular',
            'Menlo',
            'Monaco',
            'Consolas',
            'monospace'
        ],
        serif: [
            'ui-serif',
            'Georgia',
            'Cambria',
            'Times New Roman',
            'Times',
            'serif'
        ]
    },
    // Border radius
    borderRadius: {
        none: '0',
        sm: '0.375rem',
        md: '0.5rem',
        lg: '0.625rem',
        xl: '0.75rem',
        full: '9999px'
    },
    // Spacing scale
    spacing: {
        xs: '0.5rem',
        sm: '0.75rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem',
        '3xl': '4rem'
    },
    // Animation configuration
    animations: {
        duration: {
            fast: '150ms',
            normal: '300ms',
            slow: '500ms'
        },
        easing: {
            ease: 'ease',
            easeIn: 'ease-in',
            easeOut: 'ease-out',
            easeInOut: 'ease-in-out'
        }
    },
    // Responsive breakpoints
    breakpoints: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px'
    },
    // Box shadows
    shadows: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)'
    },
    // Z-index scale
    zIndex: {
        dropdown: 1000,
        modal: 1050,
        popover: 1060,
        tooltip: 1070,
        toast: 1080
    }
};
}),
"[project]/frontend/src/components/providers/theme-provider.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "ThemeProvider": ()=>ThemeProvider
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$5_$40$babel$2b$core$40$7$2e$28$2e$0_$40$playwright$2b$test$40$1$2e$54$2e$1_react$2d$dom$40$19$2e$1$2e$1_react$40$19$2e$1$2e$1_$5f$react$40$19$2e$1$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.4.5_@babel+core@7.28.0_@playwright+test@1.54.1_react-dom@19.1.1_react@19.1.1__react@19.1.1/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$themes$40$0$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$1_react$40$19$2e$1$2e$1_$5f$react$40$19$2e$1$2e$1$2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next-themes@0.4.6_react-dom@19.1.1_react@19.1.1__react@19.1.1/node_modules/next-themes/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$config$2f$theme$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/config/theme.config.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
function ThemeProvider({ children, attribute = 'class', defaultTheme = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$config$2f$theme$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["themeConfig"].defaultTheme, enableSystem = true, disableTransitionOnChange = true, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$5_$40$babel$2b$core$40$7$2e$28$2e$0_$40$playwright$2b$test$40$1$2e$54$2e$1_react$2d$dom$40$19$2e$1$2e$1_react$40$19$2e$1$2e$1_$5f$react$40$19$2e$1$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$themes$40$0$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$1_react$40$19$2e$1$2e$1_$5f$react$40$19$2e$1$2e$1$2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ThemeProvider"], {
        attribute: attribute,
        defaultTheme: defaultTheme,
        enableSystem: enableSystem,
        disableTransitionOnChange: disableTransitionOnChange,
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/frontend/src/components/providers/theme-provider.tsx",
        lineNumber: 24,
        columnNumber: 5
    }, this);
}
}),
"[project]/frontend/src/components/ui/sonner.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "Toaster": ()=>Toaster
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$5_$40$babel$2b$core$40$7$2e$28$2e$0_$40$playwright$2b$test$40$1$2e$54$2e$1_react$2d$dom$40$19$2e$1$2e$1_react$40$19$2e$1$2e$1_$5f$react$40$19$2e$1$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.4.5_@babel+core@7.28.0_@playwright+test@1.54.1_react-dom@19.1.1_react@19.1.1__react@19.1.1/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$themes$40$0$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$1_react$40$19$2e$1$2e$1_$5f$react$40$19$2e$1$2e$1$2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next-themes@0.4.6_react-dom@19.1.1_react@19.1.1__react@19.1.1/node_modules/next-themes/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$2$2e$0$2e$6_react$2d$dom$40$19$2e$1$2e$1_react$40$19$2e$1$2e$1_$5f$react$40$19$2e$1$2e$1$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/sonner@2.0.6_react-dom@19.1.1_react@19.1.1__react@19.1.1/node_modules/sonner/dist/index.mjs [app-ssr] (ecmascript)");
'use client';
;
;
;
const Toaster = ({ ...props })=>{
    const { theme = 'system' } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$themes$40$0$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$1_react$40$19$2e$1$2e$1_$5f$react$40$19$2e$1$2e$1$2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTheme"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$5_$40$babel$2b$core$40$7$2e$28$2e$0_$40$playwright$2b$test$40$1$2e$54$2e$1_react$2d$dom$40$19$2e$1$2e$1_react$40$19$2e$1$2e$1_$5f$react$40$19$2e$1$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$2$2e$0$2e$6_react$2d$dom$40$19$2e$1$2e$1_react$40$19$2e$1$2e$1_$5f$react$40$19$2e$1$2e$1$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Toaster"], {
        theme: theme,
        className: "toaster group",
        style: {
            '--normal-bg': 'var(--popover)',
            '--normal-text': 'var(--popover-foreground)',
            '--normal-border': 'var(--border)'
        },
        ...props
    }, void 0, false, {
        fileName: "[project]/frontend/src/components/ui/sonner.tsx",
        lineNumber: 10,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
;
}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__6a59373f._.js.map