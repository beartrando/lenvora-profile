import {upsertProfile} from "../services/profile.service";
import logger from "@shared/logger";

export async function userCreated(message: any): Promise<void> {
  try {
    await upsertProfile(message.userId);
  } catch (error) {
    logger.error(`[Kafka] Failed to process message`, {
      rawValue: message.userId,
      error,
    });
  }
}
