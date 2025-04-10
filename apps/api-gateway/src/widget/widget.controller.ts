// widget.controller.ts
import { MessagingService } from '@app/common';
import { CreateWidgetDTO, QueryWidgetDTO, UpdateWidgetDTO } from '@app/types';
import {
   Body,
   Controller,
   Delete,
   Get,
   Param,
   Post,
   Put,
   Query,
   UseGuards,
   Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('widget')
@UseGuards(AuthGuard('jwt'))
export class WidgetController {
   constructor(private readonly messagingService: MessagingService) {}

   @Post()
   create(@Body() createWidgetDTO: CreateWidgetDTO) {
      return this.messagingService.send(
         'widget.create.widget',
         createWidgetDTO,
      );
   }

   @Get()
   findAll(@Query() query: QueryWidgetDTO, @Request() req) {
      return this.messagingService.send('widget.findAll.widgets', {
         query,
         IDUser: req.user.IDUser,
      });
   }

   @Get(':id')
   findOne(@Param('id') id: string) {
      return this.messagingService.send('widget.findOne.widget', id);
   }

   @Put(':id')
   update(@Param('id') id: string, @Body() updateWidgetDTO: UpdateWidgetDTO) {
      return this.messagingService.send('widget.update.widget', {
         id,
         updateWidgetDTO,
      });
   }

   @Delete(':id')
   remove(@Param('id') id: string) {
      return this.messagingService.send('widget.remove.widget', id);
   }
}
