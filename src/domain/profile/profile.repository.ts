import ProfileEntity from "../entities/profile.entity";
import Id from "../value-objects/ProfileId.vo";

export interface ProfileRepository {
    findById(id: Id): Promise<ProfileEntity | null>;

    findByUserId(id: Id): Promise<ProfileEntity | null>;

    save(user: ProfileEntity): Promise<ProfileEntity>;

    findByUserId(userId: Id): Promise<ProfileEntity | null>;
}

export default ProfileRepository;
