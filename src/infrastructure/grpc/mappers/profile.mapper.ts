import * as authProto from "../../../contracts/proto/auth";
import ProfileEntity from "../../../domain/entities/profile.entity";
import Id from "../../../domain/value-objects/id.vo";

export class ProfileGrpcMapper {
    static toGrpc(user: ProfileEntity): authProto.UserObject {

        return authProto.UserObject.create({
            id: user.id.value,
            email: user.email?.value ?? "",
            googleId: user.googleId ?? '',
            lastLoginAt: user.lastLoginAt ?? undefined,
            lastActiveAt: user.lastActiveAt ?? undefined,
            createdAt: user.createdAt ?? undefined,
            updatedAt: user.updatedAt ?? undefined,
        });
    }

    // static toEntity(user: authProto.UserObject): ProfileEntity {
    //
    //     return ProfileEntity.create({
    //         id: new Id(user.id),
    //         email: user.email ? new Email(user.email) : null,
    //         googleId: user.googleId,
    //         lastLoginAt: user.lastLoginAt,
    //         lastActiveAt: user.lastActiveAt,
    //         createdAt: user.createdAt,
    //         updatedAt: user.updatedAt,
    //     });
    // }

}

export default ProfileGrpcMapper;
