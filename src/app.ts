import grpcServer from './grpc/server';
import * as grpc from '@grpc/grpc-js';
import logger from '@shared/logger';
import kafkaConfig, {createUserConsumerConfig} from "./config/kafka.config";
import {createConsumer} from '@shared/kafka';
import {userCreated} from "./lib/consumers";

const GRPC_PORT = process.env.GRPC_PORT ?? '50051';

async function startGrpc() {
  return new Promise<void>((resolve, reject) => {
    grpcServer.bindAsync(
      `0.0.0.0:${GRPC_PORT}`,
      grpc.ServerCredentials.createInsecure(),
      (err, port) => {
        if (err) {
          logger.error('❌ Ошибка запуска gRPC:', err);
          return reject(err);
        }
        logger.info(`🟢 gRPC сервер запущен на порту ${port}`);
        resolve();
      }
    );
  });
}

async function bootstrap() {
  try {
    await Promise.all([startGrpc()]);
    logger.info('🚀 Profile успешно запущен: gRPC');
  } catch (err) {
    logger.error('💥 Ошибка запуска Profile:', err);
    process.exit(1);
  }

  process.on('SIGINT', () => {
    logger.info('🛑 Завершение работы...');
    grpcServer.forceShutdown();
    process.exit(0);
  });

  createConsumer(kafkaConfig, {
    ...createUserConsumerConfig,
    handler: userCreated,
  });

}

bootstrap();
