import {prisma} from '../lib/prisma';
import {kafkaProducersConfig} from "../config/kafka.config";
import logger from "@shared/logger";
import {enqueueEvent} from "@shared/pg-boss/src/enqueueEvent";

export async function findProfile(ownerId: string) {
  return prisma.profile.findFirst({where: {ownerId}});
}

export async function upsertProfile(ownerId: string) {

  const existing = await prisma.profile.findUnique({where: {ownerId}});

  if (existing) {
    return existing;
  }

  const nickname = generateGuestNickname();

  const profile = await prisma.profile.upsert({
    where: {ownerId},
    create: {ownerId, nickname},
    update: {nickname},
  });

  enqueueEvent(kafkaProducersConfig.topicProfileCreated, {value: JSON.stringify({ownerId: profile.id})});

  return profile;
}

export async function getProfile(ownerId: string) {
  logger.log('getProfile ownerId ' + ownerId);
  return prisma.profile.findUnique({
    where: {ownerId: ownerId},
  });
}


function generateGuestNickname(): string {
  const randomDigits = Math.floor(10000000 + Math.random() * 90000000);

  return `Guest${randomDigits}`;
}
