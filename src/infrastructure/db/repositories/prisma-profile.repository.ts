import {PrismaClient} from "@prisma/client";

import ProfileRepository from "../../../domain/profile/profile.repository";
import ProfileEntity from "../../../domain/profile/profile.entity";

import ProfileId from "../../../domain/profile/value-objects/profile-id.vo";
import ProfileDbMapper from "../mappers/profile.db.mapper";
import UserId from "../../../domain/user/value-objects/user-id.vo";

export class PrismaProfileRepository implements ProfileRepository {

    constructor(
        private readonly prisma: PrismaClient,
    ) {
    }

    async findById(
        id: ProfileId,
    ): Promise<ProfileEntity | null> {
        const profile = await this.prisma.profile.findUnique({
            where: {
                id: id.value,
            },
        });

        if (!profile) {
            return null;
        }

        return ProfileDbMapper.toDomain(profile);
    }

    async save(
        profile: ProfileEntity,
    ): Promise<ProfileEntity> {

        const profileDb = ProfileDbMapper.toPersistence(profile);
        const {
            id,
            userId,
            // createdAt,
            // updatedAt,
            ...update
        } = profileDb;

        const result = await this.prisma.profile.upsert({
            where: {
                id: profileDb.id,
            },
            create: profileDb,
            update,
        });

        return ProfileDbMapper.toDomain(result);
    }

    async findByUserId(
        userId: UserId,
    ): Promise<ProfileEntity | null> {
        const profile = await this.prisma.profile.findUnique({
            where: {userId: userId.value},
        });


        if (!profile) {
            return null;
        }

        return ProfileDbMapper.toDomain(profile);
    }
}

export default PrismaProfileRepository;






