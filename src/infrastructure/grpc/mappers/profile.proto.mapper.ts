import * as profileProto from "../../../contracts/proto/profile";
import ProfileEntity from "../../../domain/entities/profile.entity";

export class ProfileProtoMapper {
    static toProto(profile: ProfileEntity): profileProto.ProfileObject {

        return profileProto.ProfileObject.create({
            id: profile.id.value,
            userId: profile.userId.value,
            nickname: profile.nickname.value,
            level: profile.level.value,
            rating: profile.rating.value,
            experience: profile.experience.value,
            createdAt: profile.createdAt ?? undefined,
            updatedAt: profile.updatedAt ?? undefined,
        });
    }

    // static toDomain(user: authProto.UserObject): BattleEntity {
    //
    //     return BattleEntity.create({
    //         id: new DeviceId(user.id),
    //         email: user.email ? new Email(user.email) : null,
    //         googleId: user.googleId,
    //         lastLoginAt: user.lastLoginAt,
    //         lastActiveAt: user.lastActiveAt,
    //         createdAt: user.createdAt,
    //         updatedAt: user.updatedAt,
    //     });
    // }

}

export default ProfileProtoMapper;
