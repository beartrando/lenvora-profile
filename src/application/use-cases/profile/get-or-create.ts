import ProfileRepository from "../../../domain/profile/profile.repository";
import ProfileEntity from "../../../domain/profile/profile.entity";
import JobService from "../../../infrastructure/job/service";
import Id from "../../../domain/common/value-objects/id.vo";
import logger from "@shared/logger";
import ProfileMapper from "../../../infrastructure/db/mappers/profile.mapper";
import ProfileProtoMapper from "../../../infrastructure/grpc/mappers/profile.proto.mapper";

export class GetOrCreateUseCase {
    constructor(
        private readonly profileRepository: ProfileRepository,
        private readonly jobService: JobService,
        private readonly profileCreatedTopik: string,
    ) {
    }

    async execute(userId: Id): Promise<ProfileEntity> {

        const existing = await this.profileRepository.findByUserId(userId);

        if (existing) {
            return existing;
        }

        const profile = ProfileEntity.create({userId});

        await this.profileRepository.save(profile);

        const profileObject = ProfileProtoMapper.toProto(profile);

        this.jobService.enqueue(this.profileCreatedTopik, profileObject);

        return profile;
    }
}


export default GetOrCreateUseCase;

