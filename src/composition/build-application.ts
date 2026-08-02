import HealthUseCase from "../application/use-cases/health/health";
import StatusUseCase from "../application/use-cases/health/status";
import LivezUseCase from "../application/use-cases/health/livez";
import ReadyzUseCase from "../application/use-cases/health/readyz";
import HealthHandler from "../infrastructure/grpc/handlers/health.handler";
import GrpcService from "../infrastructure/grpc/grpc.service";
import {config as grpcConfig} from "../infrastructure/grpc/config";
import Application from "../application/application";
import {config as messageConfig, messageConsumersConfig, messageProducersConfig} from "../infrastructure/message/config";
import AuthService from "../infrastructure/auth/auth-service";
import MessageService from "../infrastructure/message/message.service";
import JobService from "../infrastructure/job/job.service";
import DbService from "../infrastructure/db/db.service";
import PrismaProfileRepository from "../infrastructure/db/repositories/prisma-profile.repository";
import GetOrCreateUseCase from "../application/use-cases/profile/get-or-create";
import GetByUserUseCase from "../application/use-cases/profile/get-by-user";
import ProfileHandler from "../infrastructure/grpc/handlers/profile.handler";
import GetUseCase from "../application/use-cases/profile/get";
import GetMeUseCase from "../application/use-cases/profile/get-me";
import UserCreatedConsumer from "../infrastructure/message/consumers/user-created";


function buildApplication() {



    const jobService = new JobService(messageConfig, messageProducersConfig)
    const dbService = new DbService();

    const authService = new AuthService();

    const profileRepository = new PrismaProfileRepository(dbService.client);

    const getOrCreateUseCase = new GetOrCreateUseCase(profileRepository, jobService, messageProducersConfig.profileCreated);


    const userCreatedConsumer = new UserCreatedConsumer(getOrCreateUseCase);

    const messageService = new MessageService(messageConfig, messageConsumersConfig, userCreatedConsumer);

    const getUseCase = new GetUseCase(profileRepository);
    const getByUserUseCase = new GetByUserUseCase(profileRepository);
    const getMeUseCase = new GetMeUseCase(profileRepository);

    const healthUseCase = new HealthUseCase(dbService, messageService, jobService);
    const statusUseCase = new StatusUseCase;
    const livezUseCase = new LivezUseCase;
    const readyzUseCase = new ReadyzUseCase;

    const profileHandler = new ProfileHandler(authService, getOrCreateUseCase, getByUserUseCase, getMeUseCase, getUseCase);
    const healthHandler = new HealthHandler(healthUseCase, statusUseCase, livezUseCase, readyzUseCase);

    const grpcService = new GrpcService(grpcConfig.port, profileHandler, healthHandler);

    return new Application(grpcService, dbService, jobService, messageService);
}


export default buildApplication;
