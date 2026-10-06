import ProfileRepository from "../../../domain/profile/profile.repository";
import ProfileEntity from "../../../domain/profile/profile.entity";
import UserId from "../../../domain/user/value-objects/user-id.vo";
import {NotFoundError} from "@shared/errors";

export class GetByUserUseCase {
    constructor(
        private readonly profileRepository: ProfileRepository,
    ) {
    }

    async execute(userId: UserId): Promise<ProfileEntity> {

        const profile = await this.profileRepository.findByUserId(userId);

        if (!profile) {
            throw new NotFoundError('Profile');
        }

        return profile;
    }
}


export default GetByUserUseCase;
