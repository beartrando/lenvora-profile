import * as grpc from '@grpc/grpc-js';
import * as authProto from '../generated/auth';
import * as profileProto from '../generated/profile';
import * as profileService from '../../services/profile.service';
import logger from "@shared/logger";
import {profileToProto} from "../../lib/grpc-prisma-converters/profile";
import {getUserIdFromProtoRequest, getUserIdFromJwt} from "../../lib/grpcRequestMetadata";

export const upsert = async (
    call: grpc.ServerUnaryCall<authProto.UserIdRequest, profileProto.ProfileObject>,
    callback: grpc.sendUnaryData<profileProto.ProfileObject>
) => {
    const userId = getUserIdFromProtoRequest(call);

    try {
        const result = await profileService.upsert(userId);

        callback(null, profileToProto(result));

    } catch (err: any) {
        logger.error(err);
        callback({
            code: grpc.status.INTERNAL,
            message: err.message,
        }, null);
    }
};

export const get = async (
    call: grpc.ServerUnaryCall<profileProto.ProfileIdRequest, profileProto.ProfileObject>,
    callback: grpc.sendUnaryData<profileProto.ProfileObject>
) => {
    const {profileId} = call.request;

    try {
        // logger.log('getProfileById ' + profileId);
        const result = await profileService.get(profileId);

        if (!result) {
            throw new Error("Expected result, but got null");
        }

        callback(null, profileToProto(result));

    } catch (err: any) {
        logger.log(err);
        callback({
            code: grpc.status.INTERNAL,
            message: err.message,
        }, null);
    }
};

export const getMe = async (
    call: grpc.ServerUnaryCall<profileProto.ProfileIdRequest, profileProto.ProfileObject>,
    callback: grpc.sendUnaryData<profileProto.ProfileObject>
) => {
    // logger.log(call);
    const userId = getUserIdFromProtoRequest(call);

    try {

        logger.log(userId);
        const result = await profileService.getByUser(userId);

        if (!result) {
            throw new Error("Expected result, but got null");
        }

        callback(null, profileToProto(result));

    } catch (err: any) {
        logger.log(err);
        callback({
            code: grpc.status.INTERNAL,
            message: err.message,
        }, null);
    }
};


export const getByUser = async (
    call: grpc.ServerUnaryCall<authProto.UserIdRequest, profileProto.ProfileObject>,
    callback: grpc.sendUnaryData<profileProto.ProfileObject>
) => {
    const {userId} = call.request;

    try {
        // logger.log('getProfileByUser ' + userId);
        const result = await profileService.getByUser(userId);

        if (!result) {
            throw new Error("Expected result, but got null");
        }

        callback(null, profileToProto(result));

    } catch (err: any) {
        logger.log(err);
        callback({
            code: grpc.status.INTERNAL,
            message: err.message,
        }, null);
    }
};
