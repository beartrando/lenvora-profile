export interface MessageConsumerHandlerInterface {
    (topic: string, partition: number, message: undefined): Promise<void>;
}

export default MessageConsumerHandlerInterface;
