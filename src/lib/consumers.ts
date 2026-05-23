import {upsertProfile} from "../services/profile.service";
import logger from "@shared/logger";

export async function userCreated(topic: string, partition: number, message: UserOb): Promise<void> {
  try {
    await upsertProfile(message.id);
  } catch (error) {
    logger.error(`[Kafka] Failed to process message`, {
      rawValue: message.userId,
      error,
    });
  }
}
