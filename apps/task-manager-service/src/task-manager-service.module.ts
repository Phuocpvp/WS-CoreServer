import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TaskManagerServiceController } from './task-manager-service.controller';
import { TaskManagerServiceService } from './task-manager-service.service';
import { configuration, validationSchema } from '@app/common';
import { ClientsModule } from '@nestjs/microservices';
import { getKafkaConfig } from '@app/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TeamModule } from './team/team.module';
import { ProjectModule } from './project/project.module';

@Module({
   imports: [
      ConfigModule.forRoot({
         isGlobal: true,
         envFilePath: [
            `apps/task-manager-service/.env.${process.env.NODE_ENV || 'development'}`,
            'apps/task-manager-service/.env'
         ],
         load: [configuration],
         validationSchema,
         validationOptions: {
            abortEarly: false,
         },
      }),
      MongooseModule.forRootAsync({
         imports: [ConfigModule],
         useFactory: async (configService: ConfigService) => ({
            uri: configService.get<string>('database.uri'),
         }),
         inject: [ConfigService],
      }),
      ClientsModule.registerAsync([
         {
            name: 'TASK_MANAGER_SERVICE',
            useFactory: () => getKafkaConfig('task-manager-service-server'),
         },
      ]),
      TeamModule,
      ProjectModule,
   ],
   controllers: [TaskManagerServiceController],
   providers: [TaskManagerServiceService],
})
export class TaskManagerServiceModule {}
