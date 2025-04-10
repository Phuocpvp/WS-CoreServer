export class UpdateProjectDTO {
   projectName?: string;
   projectDescription?: string;
   tag?: Array<{
      idTag?: string;
      tagName: string;
      isDeleted?: boolean;
   }>;
   status?: Array<{
      idStatus?: string;
      statusName: string;
      order: number;
      isDeleted?: boolean;
   }>;
   access?: Array<{
      idCollaborator: string;
      permission: string;
      isDeleted?: boolean;
   }>;
}