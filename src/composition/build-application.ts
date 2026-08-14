import HealthUseCase from "../application/use-cases/health/health";
import StatusUseCase from "../application/use-cases/health/status";
import LivezUseCase from "../application/use-cases/health/livez";
import ReadyzUseCase from "../application/use-cases/health/readyz";
import HealthHandler from "../infrastructure/grpc/handlers/health.handler";
import GrpcService from "../infrastructure/grpc/service";
import grpcConfig from "../infrastructure/grpc/config";
import jobConfig from "../infrastructure/job/config";
import authConfig from "../infrastructure/auth/config";
import Application from "../application/application";
import AuthService from "../infrastructure/auth/service";
import MessageService from "../infrastructure/message/service";
import JobService from "../infrastructure/job/service";
import DbService from "../infrastructure/db/service";
import PrismaProfileRepository from "../infrastructure/db/repositories/prisma-profile.repository";
import GetOrCreateUseCase from "../application/use-cases/profile/get-or-create";
import GetByUserUseCase from "../application/use-cases/profile/get-by-user";
import ProfileHandler from "../infrastructure/grpc/handlers/profile.handler";
import GetUseCase from "../application/use-cases/profile/get";
import UserCreatedConsumer from "../infrastructure/message/consumers/user-created";
import messageConfig from "../infrastructure/message/configs/message.config";
import messageProducersConfig from "../infrastructure/message/configs/producers.config";
import messageConsumersConfig from "../infrastructure/message/configs/consumers.config";

function buildApplication() {
    const authService = new AuthService(authConfig);

    const jobService = new JobService(jobConfig, messageConfig, messageProducersConfig)
    const dbService = new DbService();

    const profileRepository = new PrismaProfileRepository(dbService.client);

    const getOrCreateUseCase = new GetOrCreateUseCase(profileRepository, jobService, messageProducersConfig.profileCreated);


    const userCreatedConsumer = new UserCreatedConsumer(getOrCreateUseCase);

    const messageService = new MessageService(messageConfig);

    messageService.addConsumer(
        messageConsumersConfig.userCreated,
        userCreatedConsumer.execute.bind(userCreatedConsumer)
    )

    const getUseCase = new GetUseCase(profileRepository);
    const getByUserUseCase = new GetByUserUseCase(profileRepository);

    const healthUseCase = new HealthUseCase(dbService, messageService, jobService);
    const statusUseCase = new StatusUseCase;
    const livezUseCase = new LivezUseCase;
    const readyzUseCase = new ReadyzUseCase;

    const profileHandler = new ProfileHandler(authService, getOrCreateUseCase, getByUserUseCase, getUseCase);
    const healthHandler = new HealthHandler(healthUseCase, statusUseCase, livezUseCase, readyzUseCase);

    const grpcService = new GrpcService(grpcConfig.port, profileHandler, healthHandler);

    return new Application(grpcService, dbService, jobService, messageService);
}


export default buildApplication;
