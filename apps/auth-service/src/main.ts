import { NestFactory } from '@nestjs/core';
import { AuthServiceModule } from './auth-service.module';
import { Logger } from '@nestjs/common';
import { getKafkaConfig } from '@app/common';
declare const module: any;

async function bootstrap() {
   const app = await NestFactory.create(AuthServiceModule);
   const kafkaConfig = getKafkaConfig('auth-service');

   app.connectMicroservice(kafkaConfig);
   await app.startAllMicroservices();
   Logger.log(`🚀 Auth Service is running 🚀`);

   if (module.hot) {
      module.hot.accept();
      module.hot.dispose(() => app.close());
   }
}

bootstrap();
