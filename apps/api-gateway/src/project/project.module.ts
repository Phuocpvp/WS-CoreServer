import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { MessagingModule } from '@app/common';

@Module({
   imports: [MessagingModule],
   controllers: [ProjectController],
   providers: [ProjectService],
})
export class ProjectModule {}
