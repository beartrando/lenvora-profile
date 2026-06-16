import * as grpc from '@grpc/grpc-js';
import * as authGrpc from '../generated/auth';
import * as profileGrpc from '../generated/profile';
import * as profileService from '../../services/profile.service';
import logger from "@shared/logger";
import {profileToGrpc} from "../../lib/grpc-prisma-converters/profile";

export const upsertProfile = async (
  call: grpc.ServerUnaryCall<authGrpc.UserIdRequest, profileGrpc.ProfileObject>,
  callback: grpc.sendUnaryData<profileGrpc.ProfileObject>
) => {
  const {userId} = call.request

  try {
    const result = await profileService.upsertProfile(userId);

    callback(null, profileToGrpc(result));

  } catch (err: any) {
    logger.error(err);
    callback({
      code: grpc.status.INTERNAL,
      message: err.message,
    }, null);
  }
};

export const getProfile = async (
  call: grpc.ServerUnaryCall<profileGrpc.ProfileIdRequest, profileGrpc.ProfileObject>,
  callback: grpc.sendUnaryData<profileGrpc.ProfileObject>
) => {
  const {profileId} = call.request;

  try {
    // logger.log('getProfileByUser ' + userId);
    const result = await profileService.getProfile(profileId);

    if (!result) {
      throw new Error("Expected result, but got null");
    }

    callback(null, profileToGrpc(result));

  } catch (err: any) {
    logger.log(err);
    callback({
      code: grpc.status.INTERNAL,
      message: err.message,
    }, null);
  }
};


export const getProfileByUser = async (
  call: grpc.ServerUnaryCall<authGrpc.UserIdRequest, profileGrpc.ProfileObject>,
  callback: grpc.sendUnaryData<profileGrpc.ProfileObject>
) => {
  const {userId} = call.request;

  try {
    // logger.log('getProfileByUser ' + userId);
    const result = await profileService.getProfileByUser(userId);

    if (!result) {
      throw new Error("Expected result, but got null");
    }

    callback(null, profileToGrpc(result));

  } catch (err: any) {
    logger.log(err);
    callback({
      code: grpc.status.INTERNAL,
      message: err.message,
    }, null);
  }
};
