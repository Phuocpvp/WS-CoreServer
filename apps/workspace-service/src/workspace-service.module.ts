import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WorkspaceServiceController } from './workspace-service.controller';
import { WorkspaceServiceService } from './workspace-service.service';
import { configuration, validationSchema } from '@app/common';
import { ClientsModule } from '@nestjs/microservices';
import { getKafkaConfig } from '@app/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkspaceModule } from './workspace/workspace.module';
import { WidgetModule } from './widget/widget.module';
import { NoteModule } from './note/note.module';

@Module({
   imports: [
      ConfigModule.forRoot({
         isGlobal: true,
         envFilePath: [
            `apps/workspace-service/.env.${process.env.NODE_ENV || 'development'}`,
            'apps/workspace-service/.env'
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
            name: 'WORKSPACE_SERVICE',
            useFactory: () => getKafkaConfig('workspace-service-server'),
         },
      ]),
      WorkspaceModule,
      WidgetModule,
      NoteModule,
   ],
   controllers: [WorkspaceServiceController],
   providers: [WorkspaceServiceService],
})
export class WorkspaceServiceModule {}
