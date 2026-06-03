import * as grpc from '@grpc/grpc-js';
import * as authGrpc from '../generated/auth';
import * as profileGrpc from '../generated/profile';
import * as profileService from '../../services/profile.service';
import logger from "@shared/logger";

export const upsertProfile = async (
  call: grpc.ServerUnaryCall<authGrpc.UserIdRequest, profileGrpc.ProfileObject>,
  callback: grpc.sendUnaryData<profileGrpc.ProfileObject>
) => {
  const {userId} = call.request

  try {
    const result = await profileService.upsertProfile(userId);


    callback(null, {
      id: result.id,
      userId: result.userId,
      nickname: result.nickname,
      level: result.level,
      rating: result.rating,
      experience: result.experience,
    });

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
    logger.log('getProfileByUser ' + userId);
    const result = await profileService.getProfile(userId);

    if (!result) {
      throw new Error("Expected result, but got null");
    }

    callback(null, {
      id: result.id,
      userId: result.userId,
      nickname: result.nickname,
      level: result.level,
      rating: result.rating,
      experience: result.experience,
    });

  } catch (err: any) {
    logger.log(err);
    callback({
      code: grpc.status.INTERNAL,
      message: err.message,
    }, null);
  }
};
