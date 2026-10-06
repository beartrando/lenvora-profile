import ProfileRepository from "../../../domain/profile/profile.repository";
import ProfileEntity from "../../../domain/profile/profile.entity";
import ProfileId from "../../../domain/profile/value-objects/profile-id.vo";

export class GetUseCase {
    constructor(
        private readonly profileRepository: ProfileRepository,
    ) {
    }

    async execute(id: ProfileId): Promise<ProfileEntity> {
        const profile = await this.profileRepository.findById(id);

        if (!profile) {
            throw new Error("Profile does not exist");
        }

        return profile;
    }
}


export default GetUseCase;
