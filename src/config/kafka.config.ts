export const kafkaConfig = {
  brokers: process.env.KAFKA_BROKERS || 'kafka:9092',
  clientId: process.env.KAFKA_CLIENT_ID || 'profile-client',
};

export const createUserConsumerConfig = {
  topic: process.env.KAFKA_TOPIC_USER_CREATED || 'user.created',
  groupId: process.env.KAFKA_GROUP_ID || 'profile-service',
  handler: (message: any) => Promise<void>
}

export const createProfileProducerConfig = {
  topic: process.env.KAFKA_TOPIC_PROFILE_CREATED || 'profile.created',
}

export default kafkaConfig;