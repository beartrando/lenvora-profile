import * as profileGrpc from "../../grpc/generated/profile";

import type {Profile} from "@prisma/client";

export function profileToGrpc(profile: Profile): profileGrpc.ProfileObject {

  return {
    id: profile.id,
    userId: profile.userId,
    nickname: profile.nickname,
    level: profile.level,
    rating: profile.rating,
    experience: profile.experience,
    createdAt: profile.createdAt.getTime(),
    updatedAt: profile.updatedAt.getTime(),
  };
}

export function profileToPrisma(profile: profileGrpc.ProfileObject): Profile {
  return {
    id: profile.id,
    userId: profile.userId,
    nickname: profile.nickname,
    level: profile.level,
    rating: profile.rating,
    experience: profile.experience,
    createdAt: new Date(profile.createdAt),
    updatedAt: new Date(profile.updatedAt),
  } as Profile;
}