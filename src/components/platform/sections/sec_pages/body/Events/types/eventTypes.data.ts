export type EventCategory =
  | "social"
  | "volunteering%26work"
  | "talks%26workshops"
  | "all";

export interface Event {
  // Core identifiers
  id: string;
  creatorId: string;
  creatorType: "user" | "page" | "group";
  groupId: string | null;

  // Event details
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  category: EventCategory;

  // Display and organization
  hostedBy: string;
  hostName: string;
  posterUrl: string | null;
  priority: number;

  // User-specific data
  isJoined: boolean;

  // Metadata
  createdAt: string;
}
