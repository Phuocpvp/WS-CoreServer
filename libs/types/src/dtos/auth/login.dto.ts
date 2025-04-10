export class LoginDTO {
   username: string;
   password: string;
}

export interface LoginResponseDTO {
   message: string;
   data: {
      access_token: string;
      refresh_token: string;
   };
}
