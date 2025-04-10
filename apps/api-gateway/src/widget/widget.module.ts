import { Module } from '@nestjs/common';
import { WidgetService } from './widget.service';
import { WidgetController } from './widget.controller';
import { MessagingModule } from '@app/common';

@Module({
  imports: [MessagingModule],
  controllers: [WidgetController],
  providers: [WidgetService],
})
export class WidgetModule {}
