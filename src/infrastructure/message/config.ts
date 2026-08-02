export const config = {
    brokers: process.env.KAFKA_BROKERS?.split(',') ?? ['kafka:9092'],
    clientId: process.env.KAFKA_CLIENT_ID ?? 'profile-client',
    groupId: process.env.KAFKA_GROUP_ID ?? 'profile-service',
};

export const kafkaConsumersConfig = {
    userCreated: process.env.KAFKA_TOPIC_USER_CREATED ?? 'user.created',
};


export const kafkaProducersConfig = {
    profileCreated: process.env.KAFKA_TOPIC_PROFILE_CREATED ?? 'profile.created',
};


export default config;
