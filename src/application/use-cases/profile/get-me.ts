import ProfileRepository from "../../../domain/repositories/profile.repository";
import ProfileEntity from "../../../domain/entities/profile.entity";
import AuthService from "../../../infrastructure/auth/auth-service";
import AccessToken from "../../../domain/value-objects/access-token.vo";

export class GetMeUseCase {
    constructor(
        private readonly profileRepository: ProfileRepository,
        private readonly authService: AuthService,
    ) {
    }

    async execute(accessToken: AccessToken): Promise<ProfileEntity> {

        const userId = this.authService.verifyAccessToken(accessToken)

        const profile = await this.profileRepository.findByUserId(userId);

        if (!profile) {
            throw new Error("Profile does not exist");
        }

        return profile;
    }
}


export default GetMeUseCase;

