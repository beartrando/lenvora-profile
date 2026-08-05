import {UserObject} from "../../../contracts/proto/auth";
import Id from "../../../domain/value-objects/id.vo";
import GetOrCreateUseCase from "../../../application/use-cases/profile/get-or-create";
import logger from "@shared/logger";

export class UserCreatedConsumer {
    constructor(
        private readonly getOrCreateUseCase: GetOrCreateUseCase,
    ) {
    }

    async execute(topic: string, partition: number, message: UserObject): Promise<void> {
        try {

            const userId = new Id(message.id);

            await this.getOrCreateUseCase.execute(userId);
        } catch (error) {
            logger.error(`[Kafka] Failed to process message`, {
                rawValue: message.id,
                error,
            });
        }
    }
}

export default UserCreatedConsumer;

