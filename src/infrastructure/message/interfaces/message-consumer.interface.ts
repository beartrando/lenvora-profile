import MessageConsumerHandlerInterface from "./message-consumer-handler.interface";

export interface MessageConsumerInterface {
    topic: string;
    handler: MessageConsumerHandlerInterface;
}

export default MessageConsumerInterface;
