import { Types } from "mongoose";
import { WorkspacePermission } from "../enums/workspace/workspace-permission.enum";

export interface WorkspaceAccess {
   IDCollaborator: Types.ObjectId;
   permission: WorkspacePermission
   isDeleted: boolean;
}
