import {Prisma} from '@prisma/client';
import prisma from './prisma';
import logger from "@shared/logger";

export async function enqueueEventTx(
  topic: string,
  data: object,
  tx: Prisma.TransactionClient = prisma
): Promise<string | undefined> {
  const jobName = `event.${topic}`;


  // logger.log(jobName);
  const result = await tx.$queryRaw<{ send: string }[]>`
      insert into pgboss.job (name, data)
      values (${jobName}, ${JSON.stringify(data)}::jsonb)
      returning id
  `;

  logger.log(result[0]?.send);
  return result[0]?.send;
}

