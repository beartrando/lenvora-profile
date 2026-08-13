export const messageConfig = {
    brokers: process.env.KAFKA_BROKERS?.split(',') ?? ['kafka:9092'],
    clientId: process.env.KAFKA_CLIENT_ID ?? 'profile-client',
    groupId: process.env.KAFKA_GROUP_ID ?? 'profile-service',
};

export default messageConfig;
