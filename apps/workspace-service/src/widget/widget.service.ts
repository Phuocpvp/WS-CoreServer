// widget.service.ts
import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Widget, WidgetDocument } from './schemas/widget.schema';
import {
   APIResponse,
   CreateWidgetDTO,
   QueryWidgetDTO,
   UpdateWidgetDTO,
} from '@app/types';

@Injectable()
export class WidgetService {
   constructor(
      @InjectModel(Widget.name)
      private widgetModel: Model<WidgetDocument>,
   ) {}

   async create(
      createWidgetDTO: CreateWidgetDTO,
   ): Promise<APIResponse<WidgetDocument>> {
      // Kiểm tra xem widget đã tồn tại chưa
      const existingWidget = await this.widgetModel
         .findOne({
            IDWorkSpace: new Types.ObjectId(createWidgetDTO.IDWorkSpace),
            IDNote: new Types.ObjectId(createWidgetDTO.IDNote),
            widgetType: createWidgetDTO.widgetType,
            isDeleted: false,
         })
         .exec();

      if (existingWidget) {
         throw new RpcException({
            message:
               'Widget with this type, workspace, and note already exists',
            statusCode: HttpStatus.CONFLICT,
         });
      }

      // Tạo mới widget
      const savedWidget = await new this.widgetModel({
         ...createWidgetDTO,
         IDWorkSpace: new Types.ObjectId(createWidgetDTO.IDWorkSpace),
         IDNote: new Types.ObjectId(createWidgetDTO.IDNote),
      }).save();

      if (!savedWidget) {
         throw new RpcException({
            message: 'Failed to create widget',
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
         });
      }

      return {
         message: 'Widget created successfully',
         data: savedWidget,
      };
   }

   async findAll(
      query: QueryWidgetDTO,
   ): Promise<APIResponse<WidgetDocument[]>> {
      const filter: any = { isDeleted: false };

      if (query.IDWorkSpace) {
         filter.IDWorkSpace = new Types.ObjectId(query.IDWorkSpace);
      }
      if (query.IDNote) {
         filter.IDNote = new Types.ObjectId(query.IDNote);
      }
      if (query.widgetType) {
         filter.widgetType = { $regex: query.widgetType, $options: 'i' };
      }

      const widgets = await this.widgetModel.find(filter).exec();

      if (!widgets || widgets.length === 0) {
         throw new RpcException({
            message: 'No widgets found',
            statusCode: HttpStatus.NOT_FOUND,
         });
      }

      return {
         message: 'Widgets retrieved successfully',
         data: widgets,
      };
   }

   async findOne(id: string): Promise<APIResponse<WidgetDocument>> {
      if (!Types.ObjectId.isValid(id)) {
         throw new RpcException({
            message: 'Invalid widget ID',
            statusCode: HttpStatus.BAD_REQUEST,
         });
      }

      const widget = await this.widgetModel
         .findById(id)
         .where({ isDeleted: false })
         .exec();

      if (!widget) {
         throw new RpcException({
            message: 'Widget not found',
            statusCode: HttpStatus.NOT_FOUND,
         });
      }

      return {
         message: 'Widget retrieved successfully',
         data: widget,
      };
   }

   async update(
      id: string,
      updateWidgetDTO: UpdateWidgetDTO,
   ): Promise<APIResponse<WidgetDocument>> {
      if (!Types.ObjectId.isValid(id)) {
         throw new RpcException({
            message: 'Invalid widget ID',
            statusCode: HttpStatus.BAD_REQUEST,
         });
      }

      const updatedWidget = await this.widgetModel
         .findByIdAndUpdate(
            id,
            { ...updateWidgetDTO, $inc: { __v: 1 } },
            { new: true },
         )
         .where({ isDeleted: false })
         .exec();

      if (!updatedWidget) {
         throw new RpcException({
            message: 'Widget not found',
            statusCode: HttpStatus.NOT_FOUND,
         });
      }

      return {
         message: 'Widget updated successfully',
         data: updatedWidget,
      };
   }

   async remove(id: string): Promise<APIResponse<null>> {
      if (!Types.ObjectId.isValid(id)) {
         throw new RpcException({
            message: 'Invalid widget ID',
            statusCode: HttpStatus.BAD_REQUEST,
         });
      }

      const result = await this.widgetModel
         .findOneAndUpdate(
            { _id: id, isDeleted: false },
            { isDeleted: true },
            { new: true },
         )
         .exec();

      if (!result) {
         throw new RpcException({
            message: 'Widget not found or already deleted',
            statusCode: HttpStatus.NOT_FOUND,
         });
      }

      return {
         message: 'Widget deleted successfully',
         data: null,
      };
   }
}
