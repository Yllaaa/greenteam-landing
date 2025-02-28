/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

export function getAccessToken() {
    const userInfo = localStorage.getItem("user");
    if (!userInfo)
        throw new Error('User not logged in');
    const user = JSON.parse(userInfo);
    return user.accessToken;
}

export async function getRequest(endpoint: string) {
    return await axios.get(endpoint, { headers: { Authorization: `Bearer ${getAccessToken()}` } });
}

export async function postRequest(endpoint: string, data: any) {
    return await axios.post(endpoint, data, { headers: { Authorization: `Bearer ${getAccessToken()}` } });
}

export async function putRequest(endpoint: string, data: any) {
    return await axios.put(endpoint, data, { headers: { Authorization: `Bearer ${getAccessToken()}` } });
}

export async function deleteRequest(endpoint: string) {
    return await axios.delete(endpoint, { headers: { Authorization: `Bearer ${getAccessToken()}` } });
}