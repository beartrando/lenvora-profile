import ProfileEntity from "../profile/profile.entity";
import Id from "../common/value-objects/id.vo";
import ProfileId from "../profile/value-objects/profile-id.vo";

export interface ProfileRepository {
    findById(id: ProfileId): Promise<ProfileEntity | null>;

    findByUserId(id: ProfileId): Promise<ProfileEntity | null>;

    save(user: ProfileEntity): Promise<ProfileEntity>;
}

export default ProfileRepository;
