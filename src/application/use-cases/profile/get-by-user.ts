import ProfileRepository from "../../../domain/repositories/profile.repository";
import ProfileEntity from "../../../domain/entities/profile.entity";
import AuthService from "../../../infrastructure/auth/auth-service";
import AccessToken from "../../../domain/value-objects/access-token.vo";

export class GetByUserUseCase {
    constructor(
        private readonly profileRepository: ProfileRepository,
    ) {
    }

    async execute(userId: Id, accessToken: AccessToken): Promise<ProfileEntity> {

        const user = await this.profileRepository.findByUserId(userId);

        if (!user) {
            throw new Error("Profile does not exist");
        }

        return user;
    }
}


export default GetByUserUseCase;

