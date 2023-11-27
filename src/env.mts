export const getEnv = () => {
    return {
        release: process.env.NEXT_PUBLIC_VERSION ?? process.env.npm_package_version,
        environment: process.env.NEXT_PUBLIC_ENVIRONMENT ?? process.env.ENVIRONMENT,
        sentry_dsn: process.env.NEXT_PUBLIC_SENTRY_DSN ?? process.env.SENTRY_DSN,
    }
}