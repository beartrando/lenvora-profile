import ProfileRepository from "../../../domain/repositories/profile.repository";
import ProfileEntity from "../../../domain/entities/profile.entity";
import AccessToken from "../../../domain/value-objects/access-token.vo";
import JobService from "../../../infrastructure/job/job.service";
import jobService from "../../../infrastructure/job/job.service";

export class GetOrCreateUseCase {
    constructor(
        private readonly profileRepository: ProfileRepository,
        private readonly jobService: JobService,
        private readonly profileCreatedTopik: string,
    ) {
    }

    async execute(userId: Id, accessToken: AccessToken): Promise<ProfileEntity> {

        const existing = await this.profileRepository.findById(userId);

        if (existing) {
            return existing;
        }

        const profile = ProfileEntity.create({userId});

        await this.profileRepository.save(profile);


        jobService.enqueue(profileCreatedTopik, profile);

        return profile;
    }
}


export default GetOrCreateUseCase;

