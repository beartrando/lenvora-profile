import * as grpc from '@grpc/grpc-js';
import * as authProto from '../../../contracts/proto/auth';
import * as profileProto from '../../../contracts/proto/profile';
// import * as profileService from '../../application/use-cases/profile/profile.service';
import logger from "@shared/logger";
// import {profileToProto} from "../../infrastructure/message/lib/grpc-prisma-converters/profile";
// import {getUserIdFromProtoRequest} from "../../infrastructure/message/lib/grpcRequestMetadata";
import GetMeUseCase from "../../../application/use-cases/profile/get-me";
import GetUseCase from "../../../application/use-cases/profile/get";
import callbackError from "./callback.error";
import AuthService from "../../auth/auth-service";
import AuthHelper from "../helpers/auth.helper";
import GetOrCreateUseCase from "../../../application/use-cases/profile/get-or-create";
import GetByUserUseCase from "../../../application/use-cases/profile/get-by-user";
import ProfileGrpcMapper from "../mappers/profile.mapper";


export class ProfileHandler {
    constructor(
        private readonly authService: AuthService,
        private readonly getOrCreateUseCase: GetOrCreateUseCase,
        private readonly getByUserUseCase: GetByUserUseCase,
        private readonly getMeUseCase: GetMeUseCase,
        private readonly getUseCase: GetUseCase
    ) {
    }

    async getOrCreate(
        call: grpc.ServerUnaryCall<authProto.UserIdRequest, profileProto.ProfileResponse>,
        callback: grpc.sendUnaryData<profileProto.ProfileResponse>
    ) {
        try {
            const accessToken = AuthHelper.getAccessToken(call);

            const profile = await this.getOrCreateUseCase.execute(accessToken);

            const result = profileProto.ProfileResponse.create({profile: ProfileGrpcMapper.toGrpc(profile)});

            callback(null, result);

        } catch (err: any) {
            logger.log(err);
            callbackError(callback, err);
        }
    }

    async get(
        call: grpc.ServerUnaryCall<profileProto.ProfileIdRequest, profileProto.ProfileResponse>,
        callback: grpc.sendUnaryData<profileProto.ProfileResponse>
    ) {
        try {
            const {profileId} = call.request;
            const accessToken = AuthHelper.getAccessToken(call);
            // logger.log('getProfileById ' + profileId);

            const profile = await this.getUseCase.execute(profileId, accessToken);

            const result = profileProto.ProfileResponse.create({profile: ProfileGrpcMapper.toGrpc(profile)});


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
    }

    async getMe(
        call: grpc.ServerUnaryCall<profileProto.ProfileIdRequest, profileProto.ProfileObject>,
        callback: grpc.sendUnaryData<profileProto.ProfileObject>
    ) {
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
    }


    async getByUser(
        call: grpc.ServerUnaryCall<authProto.UserIdRequest, profileProto.ProfileObject>,
        callback: grpc.sendUnaryData<profileProto.ProfileObject>
    ) {
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
    }
}

export default ProfileHandler;
