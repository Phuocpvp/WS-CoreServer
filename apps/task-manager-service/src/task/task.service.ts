import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task, TaskDocument } from './schemas/task.schema';
import {
   APIResponse,
   CreateTaskDTO,
   QueryTaskDTO,
   UpdateTaskDTO,
} from '@app/types';

@Injectable()
export class TaskService {
   constructor(
      @InjectModel(Task.name)
      private taskModel: Model<TaskDocument>,
   ) {}

   async create(createTaskDTO: CreateTaskDTO): Promise<APIResponse<TaskDocument>> {
      try {
         if (!Types.ObjectId.isValid(createTaskDTO.idProject)) {
            throw new RpcException({
               message: 'Invalid Project ID format',
               statusCode: HttpStatus.BAD_REQUEST,
            });
         }

         if (!Types.ObjectId.isValid(createTaskDTO.idAssignee)) {
            throw new RpcException({
               message: 'Invalid Assignee ID format',
               statusCode: HttpStatus.BAD_REQUEST,
            });
         }

         if (!Types.ObjectId.isValid(createTaskDTO.status)) {
            throw new RpcException({
               message: 'Invalid Status ID format',
               statusCode: HttpStatus.BAD_REQUEST,
            });
         }

         const taskData = {
            ...createTaskDTO,
            idProject: new Types.ObjectId(createTaskDTO.idProject),
            idAssignee: new Types.ObjectId(createTaskDTO.idAssignee),
            status: new Types.ObjectId(createTaskDTO.status),
         };

         const savedTask = await new this.taskModel(taskData).save();

         if (!savedTask) {
            throw new RpcException({
               message: 'Failed to create task',
               statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            });
         }

         return {
            message: 'Task created successfully',
            data: savedTask,
         };
      } catch (error) {
         if (error instanceof RpcException) {
            throw error;
         }
         throw new RpcException({
            message: error.message || 'Failed to create task',
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
         });
      }
   }

   async findAll(query: QueryTaskDTO): Promise<APIResponse<TaskDocument[]>> {
      const filter: any = { isDeleted: { $ne: true } };

      if (query.idProject) {
         filter.idProject = new Types.ObjectId(query.idProject);
      }
      if (query.idAssignee) {
         filter.idAssignee = new Types.ObjectId(query.idAssignee);
      }
      if (query.taskName) {
         filter.taskName = { $regex: query.taskName, $options: 'i' };
      }
      if (query.status) {
         filter.status = new Types.ObjectId(query.status);
      }

      const tasks = await this.taskModel.find(filter).exec();

      if (!tasks || tasks.length === 0) {
         throw new RpcException({
            message: 'No tasks found',
            statusCode: HttpStatus.NOT_FOUND,
         });
      }

      return {
         message: 'Tasks retrieved successfully',
         data: tasks,
      };
   }

   async findOne(id: string): Promise<APIResponse<TaskDocument>> {
      if (!Types.ObjectId.isValid(id)) {
         throw new RpcException({
            message: 'Invalid task ID',
            statusCode: HttpStatus.BAD_REQUEST,
         });
      }

      const task = await this.taskModel
         .findOne({
            _id: new Types.ObjectId(id),
            isDeleted: { $ne: true },
         })
         .exec();

      if (!task) {
         throw new RpcException({
            message: 'Task not found',
            statusCode: HttpStatus.NOT_FOUND,
         });
      }

      return {
         message: 'Task retrieved successfully',
         data: task,
      };
   }

   async update(
      id: string,
      updateTaskDTO: UpdateTaskDTO,
   ): Promise<APIResponse<TaskDocument>> {
      if (!Types.ObjectId.isValid(id)) {
         throw new RpcException({
            message: 'Invalid task ID',
            statusCode: HttpStatus.BAD_REQUEST,
         });
      }

      const updatedTask = await this.taskModel
         .findOneAndUpdate(
            {
               _id: new Types.ObjectId(id),
               isDeleted: { $ne: true },
            },
            { ...updateTaskDTO, $inc: { __v: 1 } },
            { new: true },
         )
         .exec();

      if (!updatedTask) {
         throw new RpcException({
            message: 'Task not found',
            statusCode: HttpStatus.NOT_FOUND,
         });
      }

      return {
         message: 'Task updated successfully',
         data: updatedTask,
      };
   }

   async remove(id: string): Promise<APIResponse<null>> {
      if (!Types.ObjectId.isValid(id)) {
         throw new RpcException({
            message: 'Invalid task ID',
            statusCode: HttpStatus.BAD_REQUEST,
         });
      }

      const result = await this.taskModel
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
            message: 'Task not found or already deleted',
            statusCode: HttpStatus.NOT_FOUND,
         });
      }

      return {
         message: 'Task deleted successfully',
         data: null,
      };
   }
}
