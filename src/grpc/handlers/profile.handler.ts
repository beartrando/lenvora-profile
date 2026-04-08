import * as grpc from '@grpc/grpc-js';
import * as ProfileGrpc from '../generated/profile';
import * as ProfileService from '../../services/profile.service';
import {callbackError} from './callback.error';
import logger from "@shared/logger";

export const upsert = async (
  call: grpc.ServerUnaryCall<ProfileGrpc.UpsertRequest, ProfileGrpc.ProfileObject>,
  callback: grpc.sendUnaryData<ProfileGrpc.ProfileObject>
) => {
  const {ownerId} = call.request;

  try {
    const result = await ProfileService.upsertProfile(ownerId);

    callback(null, {
      id: result.id,
      ownerId: result.ownerId,
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

export const getProfile = async (
  call: grpc.ServerUnaryCall<ProfileGrpc.ViewRequest, ProfileGrpc.ProfileObject>,
  callback: grpc.sendUnaryData<ProfileGrpc.ProfileObject>
) => {
  const {id} = call.request;

  try {
    const result = await ProfileService.getProfile(id);

    if (!result) {
      throw new Error("Expected result, but got null");
    }

    callback(null, {
      id: result.id,
      ownerId: result.ownerId,
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
