export interface MessageConsumerHandlerInterface {
    (topic: string, partition: number, message: UserObject): Promise<void>;
}

export default MessageConsumerHandlerInterface;
