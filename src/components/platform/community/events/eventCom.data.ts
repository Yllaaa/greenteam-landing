import axios from 'axios';

// Event Category Types
export type EventCategory = 'volunteering&work' | 'talks&workshops' | string; // Including string for potential future categories

// Event Mode Type
export type EventMode = 'local' | 'online' | undefined;

// Event Interface
export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  category: EventCategory;
  eventMode?: EventMode; // Added event mode field
  posterUrl: string | null;
  hostedBy: string | null;
  isJoined: boolean;
  hostName: string | null;
}

// Event Response Interface (if you need a wrapper for API responses)
export interface EventsResponse {
  events: Event[];
  // You could add pagination properties if needed
  // total?: number;
  // page?: number;
  // limit?: number;
}

// Event Request Parameters (for fetching events)
export interface EventsRequestParams {
  category?: EventCategory;
  eventMode?: EventMode; // Added event mode parameter
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  limit?: number;
  joined?: boolean;
  hosted?: boolean;
  city: number | string;
  country: number | string;
}

// Event Creation/Update Data
export interface EventFormData {
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  category: EventCategory;
  eventMode?: EventMode; // Added event mode field
  poster?: File | null;
}

// Event Join/Leave Response
export interface EventJoinResponse {
  success: boolean;
  message: string;
  eventId: string;
  isJoined: boolean;
}

export const fetchEvents = async ({
  page,
  limit,
  accessToken,
  category,
  city,
  country,
  eventMode,
  verified,
}: {
  page?: number;
  limit?: number;
  accessToken?: string | null;
  category: EventCategory;
  city: number | string;
  country: number | string;
  eventMode?: EventMode;
  verified?: string;
}): Promise<Event[]> => {
  try {
    const categoryParam = category !== 'all' ? `&category=${category}` : '';
    const countryParam =
      country !== '' && country ? `&countryId=${country}` : '';
    const cityParam = city !== '' && city ? `&cityId=${city}` : '';
    // Add event mode param for local/online filtering
    const eventModeParam = eventMode ? `&eventMode=${eventMode}` : '';
    // Add verified param if needed
    const verifiedParam = verified !=="all" ? `&verified=true` : '';

    const url = `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/events?page=${page}&limit=${limit}${cityParam}${countryParam}${categoryParam}${eventModeParam}${verifiedParam}`;

    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: accessToken ? `Bearer ${accessToken}` : '',
        'Access-Control-Allow-Origin': '*',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};
