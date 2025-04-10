import { Module } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { WorkspaceController } from './workspace.controller';
import { MessagingModule } from '@app/common';

@Module({
   imports: [MessagingModule],
   controllers: [WorkspaceController],
   providers: [WorkspaceService],
})
export class WorkspaceModule {}
