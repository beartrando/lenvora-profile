import {UserObject} from "../../../contracts/proto/auth";
import Id from "../../../domain/value-objects/id.vo";
import GetOrCreateUseCase from "../../../application/use-cases/profile/get-or-create";
import logger from "@shared/logger";
import UseCaseInterface from "../interfaces/use-case.interface";

export class UserCreatedConsumer implements UseCaseInterface<UserObject> {
    constructor(
        private readonly getOrCreateUseCase: GetOrCreateUseCase,
    ) {
        // console.log('USER CREATED CONSUMER INSTANCE', this);
    }

    async execute(topic: string, partition: number, message: UserObject): Promise<void> {
        try {

            // logger.log(message);
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

