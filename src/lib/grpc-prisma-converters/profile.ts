import * as profileProto from "../../grpc/generated/profile";

import type {Profile} from "@prisma/client";

export function profileToProto(profile: Profile): profileProto.ProfileObject {

    return {
        id: profile.id,
        userId: profile.userId,
        nickname: profile.nickname,
        level: profile.level,
        rating: profile.rating,
        experience: profile.experience,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
    };
}

export function profileToPrisma(profile: profileProto.ProfileObject): Profile {
    return {
        id: profile.id,
        userId: profile.userId,
        nickname: profile.nickname,
        level: profile.level,
        rating: profile.rating,
        experience: profile.experience,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
    } as Profile;
}