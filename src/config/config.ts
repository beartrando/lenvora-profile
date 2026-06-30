export const config = {
  port: process.env.GRPC_PORT || 50051,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET ?? (() => {
    throw new Error("JWT_ACCESS_SECRET missing");
  })(),
};

export default config;