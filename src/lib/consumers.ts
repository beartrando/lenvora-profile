import {upsertProfile} from "../services/profile.service";
import logger from "@shared/logger";
import {UserObject} from "../grpc/generated/auth";

export async function userCreated(topic: string, partition: number, message: UserObject): Promise<void> {
  try {
    await upsertProfile(message.id);
  } catch (error) {
    logger.error(`[Kafka] Failed to process message`, {
      rawValue: message.id,
      error,
    });
  }
}
