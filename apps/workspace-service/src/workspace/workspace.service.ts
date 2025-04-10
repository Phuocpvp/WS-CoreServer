import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Workspace, WorkspaceDocument } from './schemas/workspace.schema';
import {
   APIResponse,
   CreateWorkspaceDTO,
   QueryWorkspaceDTO,
   UpdateWorkspaceDTO,
   WorkspaceAccess,
   WorkspacePermission,
} from '@app/types';

@Injectable()
export class WorkspaceService {
   constructor(
      @InjectModel(Workspace.name)
      private workspaceModel: Model<WorkspaceDocument>,
   ) {}

   async create(
      createWorkspaceDTO: CreateWorkspaceDTO,
   ): Promise<APIResponse<WorkspaceDocument>> {
      const workspace = await this.workspaceModel.findOne({
         workspaceName: createWorkspaceDTO.workspaceName,
         isDeleted: false,
      });

      if (workspace && workspace.isDeleted === false) {
         throw new RpcException({
            message: 'Workspace with this name already exists',
            statusCode: HttpStatus.CONFLICT,
         });
      }

      const savedWorkspace = await new this.workspaceModel({
         ...createWorkspaceDTO,
      }).save();

      return {
         message: 'Workspace created successfully',
         data: savedWorkspace,
      };
   }

   async findAll(
      query: QueryWorkspaceDTO,
      IDUser: string,
   ): Promise<APIResponse<WorkspaceDocument[]>> {
      const filter: any = {
         isDeleted: false,
         access: {
            $elemMatch: {
               IDCollaborator: IDUser,
               isDeleted: false,
            },
         },
      };

      if (query.workspaceName) {
         filter.workspaceName = { $regex: query.workspaceName, $options: 'i' };
      }

      const workspaces = await this.workspaceModel.find(filter).exec();

      if (!workspaces || workspaces.length === 0) {
         throw new RpcException({
            message: 'No workspaces found',
            statusCode: HttpStatus.NOT_FOUND,
         });
      }

      return {
         message: 'Workspaces retrieved successfully',
         data: workspaces,
      };
   }

   async findOne(id: string): Promise<APIResponse<WorkspaceDocument>> {
      const workspace = await this.workspaceModel
         .findById(id)
         .where({ isDeleted: false })
         .exec();

      if (!workspace) {
         throw new RpcException({
            message: 'Workspace not found',
            statusCode: HttpStatus.NOT_FOUND,
         });
      }

      return {
         message: 'Workspace retrieved successfully',
         data: workspace,
      };
   }

   async update(
      id: string,
      updateWorkspaceDTO: UpdateWorkspaceDTO,
   ): Promise<APIResponse<WorkspaceDocument>> {
      const updatedWorkspace = await this.workspaceModel
         .findByIdAndUpdate(
            id,
            { ...updateWorkspaceDTO, $inc: { __v: 1 } },
            { new: true },
         )
         .where({ isDeleted: false })
         .exec();

      if (!updatedWorkspace) {
         throw new RpcException({
            message: 'Workspace not found',
            statusCode: HttpStatus.NOT_FOUND,
         });
      }

      return {
         message: 'Workspace updated successfully',
         data: updatedWorkspace,
      };
   }

   async remove(id: string): Promise<APIResponse<null>> {
      const result = await this.workspaceModel
         .findOneAndUpdate(
            { _id: id, isDeleted: false },
            { isDeleted: true },
            { new: true },
         )
         .exec();

      if (!result) {
         throw new RpcException({
            message: 'Workspace not found or already deleted',
            statusCode: HttpStatus.NOT_FOUND,
         });
      }

      return {
         message: 'Workspace deleted successfully',
         data: null,
      };
   }

   async addCollaborator(
      IDWorkspace: string,
      IDCollaborator: string,
   ): Promise<APIResponse<WorkspaceDocument>> {
      const workspace = await this.workspaceModel
         .findById(IDWorkspace)
         .where({ isDeleted: false });

      if (!workspace) {
         throw new RpcException({
            message: 'Workspace not found',
            statusCode: HttpStatus.NOT_FOUND,
         });
      }

      // Ensure access array exists
      if (!workspace.access) {
         workspace.access = [];
      }

      const collaboratorExists = workspace.access.some(
         (access) =>
            access && 
            'IDCollaborator' in access && 
            access.IDCollaborator?.toString() === IDCollaborator && 
            !access.isDeleted
      );

      if (collaboratorExists) {
         throw new RpcException({
            message: 'Collaborator already exists in workspace',
            statusCode: HttpStatus.CONFLICT,
         });
      }

      const updatedWorkspace = await this.workspaceModel.findByIdAndUpdate(
         IDWorkspace,
         {
            $push: { access: {
               IDCollaborator: new Types.ObjectId(IDCollaborator),
               permission: WorkspacePermission.READ,
               isDeleted: false,
            } },
         },
         { new: true },
      );

      if (!updatedWorkspace) {
         throw new RpcException({
            message: 'Failed to update workspace',
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
         });
      }

      return {
         message: 'Collaborator added to workspace successfully',
         data: updatedWorkspace,
      };
   }

   async removeCollaborator(
      IDWorkspace: string,
      IDCollaborator: string,
   ): Promise<APIResponse<WorkspaceDocument>> {
      const workspace = await this.workspaceModel
         .findById(IDWorkspace)
         .where({ isDeleted: false });

      if (!workspace) {
         throw new RpcException({
            message: 'Workspace not found',
            statusCode: HttpStatus.NOT_FOUND,
         });
      }
      console.log(IDCollaborator);

      const collaboratorExists = workspace.access.some(
         (access) => access.IDCollaborator.toString() === IDCollaborator && !access.isDeleted,
      );

      if (!collaboratorExists) {
         throw new RpcException({
            message: 'Collaborator not found in workspace',
            statusCode: HttpStatus.NOT_FOUND,
         });
      }

      const updatedWorkspace = await this.workspaceModel.findByIdAndUpdate(
         IDWorkspace,
         {
            $set: { 'access.$[elem].isDeleted': true },
         },
         { 
            new: true,
            arrayFilters: [{ 'elem.IDCollaborator': new Types.ObjectId(IDCollaborator), 'elem.isDeleted': false }]
         },
      );

      if (!updatedWorkspace) {
         throw new RpcException({
            message: 'Failed to update workspace',
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
         });
      }

      return {
         message: 'Collaborator removed from workspace successfully',
         data: updatedWorkspace,
      };
   }
}
