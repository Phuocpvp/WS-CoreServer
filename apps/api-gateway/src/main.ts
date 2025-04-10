import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { getKafkaConfig } from '@app/common';
declare const module: any;

async function bootstrap() {
   const APP = await NestFactory.create(ApiGatewayModule);
   const configService = APP.get(ConfigService);
   const PORT = configService.get<number>('app.port') || 3000;
   const HOST = configService.get<string>('app.host');
   const clientCORS = configService.get<string>('app.clientCors') || 'http://localhost:4321';
   const kafkaConfig = getKafkaConfig('api-gateway-consumer');

   APP.connectMicroservice(kafkaConfig);
   await APP.startAllMicroservices();
   APP.enableCors({
      origin: (origin: string, callback: any) => {
         if (!origin || origin.startsWith(`${clientCORS}`)) {
            callback(null, true);
         } else {
            callback(new Error('Not allowed by CORS'));
         }
      },
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
   });

   await APP.listen(PORT);
   Logger.log(`🚀 API-Gateway is running on port http://${HOST}:${PORT} 🚀`);

   if (module.hot) {
      module.hot.accept();
      module.hot.dispose(() => APP.close());
   }
}
bootstrap();
