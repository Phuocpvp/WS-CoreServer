import { WorkspacePermission } from "@app/types/enums/workspace/workspace-permission.enum";
import { Types } from "mongoose";

export class UpdateWorkspaceAccessDTO {
   IDCollaborator: Types.ObjectId;
   permission: WorkspacePermission
   isDeleted: boolean;
}
