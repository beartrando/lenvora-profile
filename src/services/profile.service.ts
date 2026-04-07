import {prisma} from '../lib/prisma';
import {createProducer} from '@shared/kafka';
import kafkaConfig, {createProfileProducerConfig} from "../config/kafka.config";

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

  const producer = await createProducer(kafkaConfig);
  producer.send(createProfileProducerConfig, [{value: JSON.stringify({ownerId: profile.id})}]);

  return profile;
}

export async function getProfile(ownerId: string) {
  return prisma.profile.findUnique({
    where: {ownerId: ownerId},
  });
}


function generateGuestNickname(): string {
  const randomDigits = Math.floor(10000000 + Math.random() * 90000000);

  return `Guest${randomDigits}`;
}
