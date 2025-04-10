import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Team, TeamDocument } from './schemas/team.schema';
import {
   APIResponse,
   CreateTeamDTO,
   QueryTeamDTO,
   RoleTeamEnum,
   UpdateTeamDTO,
} from '@app/types';

@Injectable()
export class TeamService {
   constructor(
      @InjectModel(Team.name) private teamModel: Model<TeamDocument>,
   ) {}

   async create(
      createTeamDTO: CreateTeamDTO,
   ): Promise<APIResponse<TeamDocument>> {
      const team = await this.teamModel.findOne({
         $or: [{ teamName: createTeamDTO.teamName }],
      });

      if (team && team.isDeleted === false) {
         throw new RpcException({
            message: 'Team with this name already exists',
            statusCode: HttpStatus.CONFLICT,
         });
      }

      const savedTeam = await new this.teamModel({
         ...createTeamDTO,
         teamSize: createTeamDTO.teamSize + 1,
      }).save();

      return {
         message: 'Team created successfully',
         data: savedTeam,
      };
   }

   async findAll(
      query: QueryTeamDTO,
      IDUser: string,
   ): Promise<APIResponse<TeamDocument[]>> {
      const filter: any = {
         isDeleted: { $ne: true },
         'members.IDMember': IDUser,
      };

      if (query.id) filter._id = query.id;
      if (query.teamName)
         filter.teamName = { $regex: query.teamName, $options: 'i' };
      if (query.manager) filter.manager = query.manager;

      const teams = await this.teamModel.find(filter).exec();

      if (!teams || teams.length === 0) {
         throw new RpcException({
            message: 'No teams found',
            statusCode: HttpStatus.NOT_FOUND,
         });
      }

      return {
         message: 'Teams retrieved successfully',
         data: teams,
      };
   }

   async findOne(id: string): Promise<APIResponse<TeamDocument>> {
      const team = await this.teamModel
         .findById(id)
         .where({ isDeleted: { $ne: true } })
         .exec();
      if (!team) {
         throw new RpcException({
            message: 'No team found',
            statusCode: HttpStatus.NOT_FOUND,
         });
      }
      return {
         message: 'Team retrieved successfully',
         data: team,
      };
   }

   async update(
      id: string,
      updateTeamDTO: UpdateTeamDTO,
   ): Promise<APIResponse<TeamDocument>> {
      const updatedTeam = await this.teamModel
         .findByIdAndUpdate(
            id,
            { ...updateTeamDTO, $inc: { __v: 1 } },
            { new: true },
         )
         .where({ isDeleted: { $ne: true } })
         .exec();
      if (!updatedTeam) {
         throw new RpcException({
            message: 'Team not found',
            statusCode: HttpStatus.NOT_FOUND,
         });
      }
      return {
         message: 'Team updated successfully',
         data: updatedTeam,
      };
   }

   async remove(id: string): Promise<APIResponse<null>> {
      const result = await this.teamModel
         .findOneAndUpdate(
            { _id: id, isDeleted: { $ne: true } },
            { isDeleted: true },
            { new: true },
         )
         .exec();
      if (!result) {
         throw new RpcException({
            message: 'Team not found or already deleted',
            statusCode: HttpStatus.NOT_FOUND,
         });
      }
      return {
         message: 'Team deleted successfully',
         data: null,
      };
   }

   async addMember(
      IDTeam: string,
      IDMember: string,
   ): Promise<APIResponse<TeamDocument>> {
      // Tìm team
      const team = await this.teamModel
         .findById(IDTeam)
         .where({ isDeleted: { $ne: true } });
   
      if (!team) {
         throw new RpcException({
            message: 'Team not found',
            statusCode: HttpStatus.NOT_FOUND,
         });
      }
   
      // Kiểm tra xem member đã tồn tại chưa
      const memberExists = team.members.some(
         (member) => member.IDMember.toString() === IDMember,
      );
   
      if (memberExists) {
         throw new RpcException({
            message: 'Member already exists in team',
            statusCode: HttpStatus.CONFLICT,
         });
      }
   
      // Dùng findByIdAndUpdate với $push để thêm member mới
      const updatedTeam = await this.teamModel.findByIdAndUpdate(
         IDTeam,
         {
            $push: {
               members: {
                  IDMember: new Types.ObjectId(IDMember),
                  roleInTeam: RoleTeamEnum.MEMBER,
                  joinedAt: new Date(),
               },
            },
            $set: { teamSize: team.members.length + 1 }, // Cập nhật teamSize
         },
         { new: true }, // Trả về document sau khi cập nhật
      );
   
      if (!updatedTeam) {
         throw new RpcException({
            message: 'Failed to update team',
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
         });
      }
   
      return {
         message: 'Member added to team successfully',
         data: updatedTeam,
      };
   }

   async removeMember(
      IDTeam: string,
      IDMember: string,
   ): Promise<APIResponse<TeamDocument>> {
      // Tìm team
      const team = await this.teamModel
         .findById(IDTeam)
         .where({ isDeleted: { $ne: true } });
   
      if (!team) {
         throw new RpcException({
            message: 'Team not found',
            statusCode: HttpStatus.NOT_FOUND,
         });
      }
   
      // Kiểm tra xem member có tồn tại trong team không
      const memberIndex = team.members.findIndex(
         (member) => member.IDMember.toString() === IDMember,
      );
   
      if (memberIndex === -1) {
         throw new RpcException({
            message: 'Member not found in team',
            statusCode: HttpStatus.NOT_FOUND,
         });
      }
   
      // Dùng findByIdAndUpdate với $pull để xóa member
      const updatedTeam = await this.teamModel.findByIdAndUpdate(
         IDTeam,
         {
            $pull: {
               members: { IDMember: new Types.ObjectId(IDMember) }, // Xóa member dựa trên IDMember
            },
            $set: { teamSize: team.members.length - 1 }, // Cập nhật teamSize
         },
         { new: true }, // Trả về document sau khi cập nhật
      );
   
      if (!updatedTeam) {
         throw new RpcException({
            message: 'Failed to update team',
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
         });
      }
   
      console.log('team.members after removal', updatedTeam.members);
   
      return {
         message: 'Member removed from team successfully',
         data: updatedTeam,
      };
   }
}
