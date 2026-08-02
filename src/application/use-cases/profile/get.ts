import ProfileRepository from "../../../domain/repositories/profile.repository";
import ProfileEntity from "../../../domain/entities/profile.entity";
import Id from "../../../domain/value-objects/id.vo";
import AccessToken from "../../../domain/value-objects/access-token.vo";

export class GetUseCase {
    constructor(
        private readonly profileRepository: ProfileRepository,
    ) {
    }

    async execute(Id: Id, accessToken: AccessToken): Promise<ProfileEntity> {
        const profile = await this.profileRepository.findById(Id);

        if (!profile) {
            throw new Error("Profile does not exist");
        }

        return profile;
    }
}


export default GetUseCase;

