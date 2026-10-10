export const messageConsumersConfig = {
    userCreated: process.env.MESSAGE_CONSUMER_TOPIC_USER_CREATED ?? 'user.created',
};

export default messageConsumersConfig;
