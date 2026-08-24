import {Profile} from "@prisma/client";
import ProfileEntity from "../../../domain/profile/profile.entity";
import ProfileId from "../../../domain/profile/value-objects/profile-id.vo";
import ProfileNickname from "../../../domain/profile/value-objects/profile-nickname.vo";
import ProfileLevel from "../../../domain/profile/value-objects/profile-level.vo";
import ProfileRating from "../../../domain/profile/value-objects/profile-rating.vo";
import ProfileExperience from "../../../domain/profile/value-objects/profile-experience.vo";
import UserId from "../../../domain/user/value-objects/user-id.vo";

type ProfileSaveData = Omit<
    Profile,
    "createdAt" | "updatedAt"
>;

export class ProfileDbMapper {
    static toPersistence(profile: ProfileEntity): ProfileSaveData {
        return {
            id: profile.id.value,
            userId: profile.userId.value,
            nickname: profile.nickname.value,
            level: profile.level.value,
            rating: profile.rating.value,
            experience: profile.experience.value,
        };
    }

    static toDomain(profile: Profile): ProfileEntity {
        return new ProfileEntity(
            new ProfileId(profile.id),
            new UserId(profile.userId),
            new ProfileNickname(profile.nickname),
            new ProfileLevel(profile.level),
            new ProfileRating(profile.rating),
            new ProfileExperience(profile.experience),
            profile.createdAt,
            profile.updatedAt,
        );
    }
}

export default ProfileDbMapper;
