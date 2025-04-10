export class CreateProjectDTO {
   projectName: string;
   projectDescription: string;
   idTeam: string;
   tag?: Array<{
      tagName: string;
   }>;
   status?: Array<{
      statusName: string;
      order: number;
   }>;
   access?: Array<{
      idCollaborator: string;
      permission: string;
   }>;
}