import { fileType } from "@app/types/enums/file-type.enum";

// Interface for the attachment object (to match the Note schema)
interface attachmentDTO {
   fileName: string;
   fileType: fileType;
   fileURL: string;
}

// CreateNoteDTO: Used for creating a new note
export class CreateNoteDTO {
   IDWidget: string; // Required: Reference to the Widget
   IDAuthor: string; // Required: Reference to the Author (User)
   title: string; // Required: Title of the note
   content: string; // Required: Content of the note
   attachment?: attachmentDTO[]; // Optional: Array of attachments
}

// QueryNoteDTO: Used for querying notes
export class QueryNoteDTO {
   IDWidget?: string; // Optional: Filter by Widget ID
   IDAuthor?: string; // Optional: Filter by Author ID
   title?: string; // Optional: Filter by title (partial match)
}

// UpdateNoteDTO: Used for updating an existing note
export class UpdateNoteDTO {
   title?: string; // Optional: Update the title
   content?: string; // Optional: Update the content
   attachment?: attachmentDTO[]; // Optional: Update the attachments
}
