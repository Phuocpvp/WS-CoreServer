import { Module } from '@nestjs/common';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configuration } from '@app/common';
import { validationSchema } from './config/validation.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { MessagingModule } from '@app/common';
import { AuthModule } from './auth/auth.module';
import { PricingModule } from './pricing/pricing.module';
import { TeamModule } from './team/team.module';
import { WorkspaceModule } from './workspace/workspace.module';
import { WidgetModule } from './widget/widget.module';
import { NoteModule } from './note/note.module';
import { ProjectModule } from './project/project.module';
import { TaskModule } from './task/task.module';
import { TaskAttachmentModule } from './task-attachment/task-attachment.module';

@Module({
   imports: [
      ConfigModule.forRoot({
         isGlobal: true,
         envFilePath: [
            `apps/api-gateway/.env.${process.env.NODE_ENV || 'development'}`,
            'apps/api-gateway/.env'
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
      MessagingModule,
      AuthModule,
      PricingModule,
      TeamModule,
      WorkspaceModule,
      WidgetModule,
      NoteModule,
      ProjectModule,
      TaskModule,
      TaskAttachmentModule,
   ],
   controllers: [ApiGatewayController],
   providers: [ApiGatewayService],
})
export class ApiGatewayModule {}
