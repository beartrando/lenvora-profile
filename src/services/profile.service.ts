import {prisma} from '../lib/prisma';
import {kafkaProducersConfig} from "../config/kafka.config";
import pgBossManager from "@shared/pg-boss-manager";

export async function findProfile(userId: string) {
    return prisma.profile.findFirst({where: {userId}});
}

export async function upsert(userId: string) {

    const existing = await prisma.profile.findUnique({where: {userId}});

    if (existing) {
        return existing;
    }

    const nickname = generateGuestNickname();

    const profile = await prisma.profile.upsert({
        where: {userId},
        create: {userId, nickname},
        update: {nickname},
    });

    pgBossManager.queue.enqueue(kafkaProducersConfig.profileCreated, profile);

    return profile;
}

export async function getByUser(userId: string) {
    // logger.log('getProfile userId ' + userId);
    return prisma.profile.findUnique({
        where: {userId: userId},
    });
}

export async function get(profileId: string) {
    return prisma.profile.findUnique({
        where: {id: profileId},
    });
}


function generateGuestNickname(): string {
    const randomDigits = Math.floor(10000000 + Math.random() * 90000000);

    return `Guest${randomDigits}`;
}
