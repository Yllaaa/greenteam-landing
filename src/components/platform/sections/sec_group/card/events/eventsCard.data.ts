import { groups } from "@/Utils/backendEndpoints/backend-endpoints";
import { getRequest } from "@/Utils/backendEndpoints/backend-requests";

// Group interface for the nested group data
interface Group {
  id: string;
  name: string;
}

// Event interface
interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  category: string;
  posterUrl: string | null;
  group: Group;
  hostedBy: string | null;
  isJoined: boolean;
  hostName: string;
}

// The provided JSON represents an array of Events
export type Events = Event[];

export function getEvents(id: string | string[] | undefined): Promise<Events> {
  const data = getRequest(groups.events(id), "en").then((res) => res.data);

  return data;
}
