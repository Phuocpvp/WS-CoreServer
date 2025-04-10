import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
   TaskAttachment,
   TaskAttachmentDocument,
} from './schemas/task-attachment.schema';
import {
   APIResponse,
   CreateTaskAttachmentDTO,
   QueryTaskAttachmentDTO,
   UpdateTaskAttachmentDTO,
} from '@app/types';

@Injectable()
export class TaskAttachmentService {
   constructor(
      @InjectModel(TaskAttachment.name)
      private taskAttachmentModel: Model<TaskAttachmentDocument>,
   ) {}

   async create(
      createTaskAttachmentDTO: CreateTaskAttachmentDTO,
   ): Promise<APIResponse<TaskAttachmentDocument>> {
      try {
         if (!Types.ObjectId.isValid(createTaskAttachmentDTO.idTask)) {
            throw new RpcException({
               message: 'Invalid Task ID format',
               statusCode: HttpStatus.BAD_REQUEST,
            });
         }

         if (!Types.ObjectId.isValid(createTaskAttachmentDTO.uploadedBy)) {
            throw new RpcException({
               message: 'Invalid User ID format',
               statusCode: HttpStatus.BAD_REQUEST,
            });
         }

         const attachmentData = {
            ...createTaskAttachmentDTO,
            idTask: new Types.ObjectId(createTaskAttachmentDTO.idTask),
            uploadedBy: new Types.ObjectId(createTaskAttachmentDTO.uploadedBy),
         };

         const savedAttachment = await new this.taskAttachmentModel(
            attachmentData,
         ).save();

         if (!savedAttachment) {
            throw new RpcException({
               message: 'Failed to create task attachment',
               statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            });
         }

         return {
            message: 'Task attachment created successfully',
            data: savedAttachment,
         };
      } catch (error) {
         if (error instanceof RpcException) {
            throw error;
         }
         throw new RpcException({
            message: error.message || 'Failed to create task attachment',
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
         });
      }
   }

   async findAll(
      query: QueryTaskAttachmentDTO,
   ): Promise<APIResponse<TaskAttachmentDocument[]>> {
      const filter: any = { isDeleted: { $ne: true } };

      if (query.idTask) {
         filter.idTask = new Types.ObjectId(query.idTask);
      }
      if (query.uploadedBy) {
         filter.uploadedBy = new Types.ObjectId(query.uploadedBy);
      }
      if (query.fileName) {
         filter.fileName = { $regex: query.fileName, $options: 'i' };
      }
      if (query.fileType) {
         filter.fileType = query.fileType;
      }
      if (query.isFinalFile !== undefined) {
         filter.isFinalFile = query.isFinalFile;
      }

      const attachments = await this.taskAttachmentModel.find(filter).exec();

      if (!attachments || attachments.length === 0) {
         throw new RpcException({
            message: 'No task attachments found',
            statusCode: HttpStatus.NOT_FOUND,
         });
      }

      return {
         message: 'Task attachments retrieved successfully',
         data: attachments,
      };
   }

   async findOne(id: string): Promise<APIResponse<TaskAttachmentDocument>> {
      if (!Types.ObjectId.isValid(id)) {
         throw new RpcException({
            message: 'Invalid attachment ID',
            statusCode: HttpStatus.BAD_REQUEST,
         });
      }

      const attachment = await this.taskAttachmentModel
         .findOne({
            _id: new Types.ObjectId(id),
            isDeleted: { $ne: true },
         })
         .exec();

      if (!attachment) {
         throw new RpcException({
            message: 'Task attachment not found',
            statusCode: HttpStatus.NOT_FOUND,
         });
      }

      return {
         message: 'Task attachment retrieved successfully',
         data: attachment,
      };
   }

   async update(
      id: string,
      updateTaskAttachmentDTO: UpdateTaskAttachmentDTO,
   ): Promise<APIResponse<TaskAttachmentDocument>> {
      if (!Types.ObjectId.isValid(id)) {
         throw new RpcException({
            message: 'Invalid attachment ID',
            statusCode: HttpStatus.BAD_REQUEST,
         });
      }

      const updatedAttachment = await this.taskAttachmentModel
         .findOneAndUpdate(
            {
               _id: new Types.ObjectId(id),
               isDeleted: { $ne: true },
            },
            { ...updateTaskAttachmentDTO, $inc: { __v: 1 } },
            { new: true },
         )
         .exec();

      if (!updatedAttachment) {
         throw new RpcException({
            message: 'Task attachment not found',
            statusCode: HttpStatus.NOT_FOUND,
         });
      }

      return {
         message: 'Task attachment updated successfully',
         data: updatedAttachment,
      };
   }

   async remove(id: string): Promise<APIResponse<null>> {
      if (!Types.ObjectId.isValid(id)) {
         throw new RpcException({
            message: 'Invalid attachment ID',
            statusCode: HttpStatus.BAD_REQUEST,
         });
      }

      const result = await this.taskAttachmentModel
         .findOneAndUpdate(
            {
               _id: new Types.ObjectId(id),
               isDeleted: { $ne: true },
            },
            { isDeleted: true },
            { new: true },
         )
         .exec();

      if (!result) {
         throw new RpcException({
            message: 'Task attachment not found or already deleted',
            statusCode: HttpStatus.NOT_FOUND,
         });
      }

      return {
         message: 'Task attachment deleted successfully',
         data: null,
      };
   }
}
