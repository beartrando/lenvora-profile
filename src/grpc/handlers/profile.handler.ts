import * as grpc from '@grpc/grpc-js';
import * as AuthGrpc from '../generated/auth';
import * as ProfileGrpc from '../generated/profile';
import * as ProfileService from '../../services/profile.service';
import {callbackError} from './callback.error';
import logger from "@shared/logger";
import * as EmptyGrpc from "../generated/common/empty";

export const upsertProfile = async (
  call: grpc.ServerUnaryCall<AuthGrpc.UserIdRequest, ProfileGrpc.ProfileObject>,
  callback: grpc.sendUnaryData<ProfileGrpc.ProfileObject>
) => {
  const {userId} = call.request

  try {
    const result = await ProfileService.upsertProfile(userId);


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
  call: grpc.ServerUnaryCall<AuthGrpc.UserIdRequest, ProfileGrpc.ProfileObject>,
  callback: grpc.sendUnaryData<ProfileGrpc.ProfileObject>
) => {
  const {userId} = call.request;

  try {
    logger.log('getProfileByUser ' + userId);
    const result = await ProfileService.getProfile(userId);

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
