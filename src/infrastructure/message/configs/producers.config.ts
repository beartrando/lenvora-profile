export const messageProducersConfig: Record<string, string> = {
    profileCreated: process.env.MESSAGE_PRODUCER_TOPIC_PROFILE_CREATED ?? 'profile.created',
};
export default messageProducersConfig;
