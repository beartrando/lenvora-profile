import {ProfileService} from './generated/profile';
import {HealthService} from './generated/common/health';
import * as grpc from '@grpc/grpc-js';
import * as profileHandler from "./handlers/profile.handler";
import * as healthHandler from "./handlers/health.handler";

const server = new grpc.Server();

server.addService(ProfileService, {
    getOrCreate: profileHandler.upsert,
    get: profileHandler.get,
    getByUser: profileHandler.upsert,
    getMe: profileHandler.getMe,
    // getByUser: profileHandler.getByUser,
});

server.addService(HealthService, {
    check: healthHandler.check,
    status: healthHandler.status,
    livez: healthHandler.livez,
    readyz: healthHandler.readyz,
});

export default server;

