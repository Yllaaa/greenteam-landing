import { groups } from "@/Utils/backendEndpoints/backend-endpoints";
import { getRequest } from "@/Utils/backendEndpoints/backend-requests";

// Creator interface
interface Creator {
  id: string;
  fullName: string;
}

// Note interface
export type Note =
  | {
      id: string;
      title: string;
      content: string;
      createdAt: string;
      creator: Creator;
      isCreator: boolean;
    }
  

// The provided JSON represents an array of Notes
export type Notes = Note[];

export function getNotes(id: string | string[] | undefined): Promise<Notes> {
  const data = getRequest(groups.notes(id),"en").then((res) => res.data);

  return data;
}
