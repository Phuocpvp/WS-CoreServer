import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Project, ProjectDocument } from './schemas/project.schema';
import {
   APIResponse,
   CreateProjectDTO,
   QueryProjectDTO,
   UpdateProjectDTO,
} from '@app/types';

@Injectable()
export class ProjectService {
   constructor(
      @InjectModel(Project.name)
      private projectModel: Model<ProjectDocument>,
   ) {}

   async create(
      createProjectDTO: CreateProjectDTO,
   ): Promise<APIResponse<ProjectDocument>> {
      try {
         // Validate idTeam is a valid ObjectId
         if (!Types.ObjectId.isValid(createProjectDTO.idTeam)) {
            throw new RpcException({
               message: 'Invalid Team ID format',
               statusCode: HttpStatus.BAD_REQUEST,
            });
         }

         const existingProject = await this.projectModel
            .findOne({
               projectName: createProjectDTO.projectName,
               idTeam: new Types.ObjectId(createProjectDTO.idTeam),
               isDeleted: false,
            })
            .exec();

         if (existingProject) {
            throw new RpcException({
               message: 'Project with this name and team already exists',
               statusCode: HttpStatus.CONFLICT,
            });
         }

         // Create a copy of the DTO to avoid modifying the original
         const projectData: any = {
            ...createProjectDTO,
            idTeam: new Types.ObjectId(createProjectDTO.idTeam),
         };

         // Process access array if it exists
         if (projectData.access && Array.isArray(projectData.access)) {
            // Validate each collaborator ID
            for (const item of projectData.access) {
               if (!Types.ObjectId.isValid(item.idCollaborator)) {
                  throw new RpcException({
                     message: `Invalid Collaborator ID format: ${item.idCollaborator}`,
                     statusCode: HttpStatus.BAD_REQUEST,
                  });
               }
            }
            
            // Convert IDs to ObjectIds
            projectData.access = projectData.access.map(item => ({
               ...item,
               idCollaborator: new Types.ObjectId(item.idCollaborator)
            }));
         }

         const savedProject = await new this.projectModel(projectData).save();

         if (!savedProject) {
            throw new RpcException({
               message: 'Failed to create project',
               statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            });
         }

         return {
            message: 'Project created successfully',
            data: savedProject,
         };
      } catch (error) {
         // Handle specific MongoDB errors
         if (error instanceof RpcException) {
            throw error;
         }
         
         // Handle other errors
         throw new RpcException({
            message: error.message || 'Failed to create project',
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
         });
      }
   }

   async findAll(
      query: QueryProjectDTO,
   ): Promise<APIResponse<ProjectDocument[]>> {
      const filter: any = { isDeleted: { $ne: true } };

      if (query.idTeam) {
         filter.idTeam = new Types.ObjectId(query.idTeam);
      }
      if (query.projectName) {
         filter.projectName = { $regex: query.projectName, $options: 'i' };
      }

      const projects = await this.projectModel.find(filter).exec();

      if (!projects || projects.length === 0) {
         throw new RpcException({
            message: 'No projects found',
            statusCode: HttpStatus.NOT_FOUND,
         });
      }

      return {
         message: 'Projects retrieved successfully',
         data: projects,
      };
   }

   async findOne(id: string): Promise<APIResponse<ProjectDocument>> {
      if (!Types.ObjectId.isValid(id)) {
         throw new RpcException({
            message: 'Invalid project ID',
            statusCode: HttpStatus.BAD_REQUEST,
         });
      }

      const project = await this.projectModel
         .findOne({
            _id: new Types.ObjectId(id),
            isDeleted: { $ne: true },
         })
         .exec();

      if (!project) {
         throw new RpcException({
            message: 'Project not found',
            statusCode: HttpStatus.NOT_FOUND,
         });
      }

      return {
         message: 'Project retrieved successfully',
         data: project,
      };
   }

   async update(
      id: string,
      updateProjectDTO: UpdateProjectDTO,
   ): Promise<APIResponse<ProjectDocument>> {
      if (!Types.ObjectId.isValid(id)) {
         throw new RpcException({
            message: 'Invalid project ID',
            statusCode: HttpStatus.BAD_REQUEST,
         });
      }

      const updatedProject = await this.projectModel
         .findOneAndUpdate(
            {
               _id: new Types.ObjectId(id),
               isDeleted: { $ne: true },
            },
            { ...updateProjectDTO, $inc: { __v: 1 } },
            { new: true },
         )
         .exec();

      if (!updatedProject) {
         throw new RpcException({
            message: 'Project not found',
            statusCode: HttpStatus.NOT_FOUND,
         });
      }

      return {
         message: 'Project updated successfully',
         data: updatedProject,
      };
   }

   async remove(id: string): Promise<APIResponse<null>> {
      if (!Types.ObjectId.isValid(id)) {
         throw new RpcException({
            message: 'Invalid project ID',
            statusCode: HttpStatus.BAD_REQUEST,
         });
      }

      const result = await this.projectModel
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
            message: 'Project not found or already deleted',
            statusCode: HttpStatus.NOT_FOUND,
         });
      }

      return {
         message: 'Project deleted successfully',
         data: null,
      };
   }
}
