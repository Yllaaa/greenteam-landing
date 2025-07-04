import { getToken } from "@/Utils/userToken/LocalToken";
import axios from "axios";

export type UserData = {
  id: string;
  fullName: string;
  username: string;
  avatar: string | null;
  cover: string | null;
  bio: string | null;
  joinedAt: string;
  isFollowing: boolean;
  isFollower: boolean;
  isBlocked: boolean;
  location: {
    city: {
      id: number;
      nameEn: string;
    };
    country: {
      id: number;
      name: string;
    };
  };
};

export type ProfileResponse = {
  userData: UserData;
  isMyProfile: boolean;
  userScore: number;
  
};
const token = getToken();
const accessToken = token ? token.accessToken : null;
export function getProfileData(username: string): Promise<ProfileResponse> {
  return axios
    .get(
      `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/users/${username}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    )
    .then((response) => response.data);
}
