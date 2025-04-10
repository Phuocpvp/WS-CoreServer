import { Types } from "mongoose";

export class TeamMemberDTO {
   IDMember: Types.ObjectId;
   roleInTeam: string;
   joinedAt: Date;
}