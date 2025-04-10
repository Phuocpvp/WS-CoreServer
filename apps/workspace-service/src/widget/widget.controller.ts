// widget.controller.ts
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { WidgetService } from './widget.service';
import { CreateWidgetDTO, QueryWidgetDTO, UpdateWidgetDTO } from '@app/types';

@Controller()
export class WidgetController {
  constructor(private readonly widgetService: WidgetService) {}

  @MessagePattern('widget.create.widget')
  create(@Payload() createWidgetDTO: CreateWidgetDTO) {
    return this.widgetService.create(createWidgetDTO);
  }

  @MessagePattern('widget.findAll.widgets')
  findAll(@Payload() query: QueryWidgetDTO) {
    return this.widgetService.findAll(query);
  }

  @MessagePattern('widget.findOne.widget')
  findOne(@Payload() id: string) {
    return this.widgetService.findOne(id);
  }

  @MessagePattern('widget.update.widget')
  update(@Payload() payload: { id: string; updateWidgetDTO: UpdateWidgetDTO }) {
    return this.widgetService.update(payload.id, payload.updateWidgetDTO);
  }

  @MessagePattern('widget.remove.widget')
  remove(@Payload() id: string) {
    return this.widgetService.remove(id);
  }
}