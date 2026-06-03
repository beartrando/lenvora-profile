import {prisma} from '../lib/prisma';
import {kafkaProducersConfig} from "../config/kafka.config";
import logger from "@shared/logger";
import {enqueueEvent} from "@shared/pg-boss/src/enqueueEvent";

export async function findProfile(userId: string) {
  return prisma.profile.findFirst({where: {userId}});
}

export async function upsertProfile(userId: string) {

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

  enqueueEvent(kafkaProducersConfig.topicProfileCreated, {value: JSON.stringify({userId: profile.id})});

  return profile;
}

export async function getProfile(userId: string) {
  logger.log('getProfile userId ' + userId);
  return prisma.profile.findUnique({
    where: {userId: userId},
  });
}


function generateGuestNickname(): string {
  const randomDigits = Math.floor(10000000 + Math.random() * 90000000);

  return `Guest${randomDigits}`;
}
