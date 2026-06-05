import {ProfileService} from './generated/profile';
import * as grpc from '@grpc/grpc-js';
import * as profileHandler from "./handlers/profile.handler";
import * as healthHandler from "./handlers/health.handler";

const server = new grpc.Server();

server.addService(ProfileService, {
  upsert: profileHandler.upsertProfile,
  getProfileByUser: profileHandler.upsertProfile,
  // getProfileByUser: profileHandler.getProfileByUser,

  health: healthHandler.health,
  status: healthHandler.status,
  livez: healthHandler.livez,
  readyz: healthHandler.readyz,
});

export default server;

