export const config = {
    appName: process.env.APP_NAME ?? 'profile',
    appVersion: process.env.APP_VERSION ?? '0.0.0',
    appEnv: process.env.APP_ENV ?? 'prod',

    port: process.env.GRPC_PORT ?? 50051,
    jwtAccessSecret: process.env.JWT_ACCESS_SECRET ?? (() => {
        throw new Error("JWT_ACCESS_SECRET missing");
    })(),
};

export default config;