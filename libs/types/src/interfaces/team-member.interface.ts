import { Types } from "mongoose";
import { RoleTeamEnum } from "../enums/team/role-team.enum";

export interface TeamMember {
   IDMember: Types.ObjectId;
   roleInTeam: RoleTeamEnum;
   joinedAt: Date;
}