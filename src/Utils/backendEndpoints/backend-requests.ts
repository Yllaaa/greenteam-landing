"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
// import { cookies } from "next/headers";
import { getToken } from "../userToken/LocalToken";

const token = getToken();
const accessToken = token ? token.accessToken : "";

export function getRequest(endpoint: string) {
  return axios.get(endpoint, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
  });
}

export async function postRequest(endpoint: string, data: any) {
  return await axios.post(endpoint, data, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export async function putRequest(endpoint: string, data: any) {
  return await axios.put(endpoint, data, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export async function deleteRequest(endpoint: string) {
  return await axios.delete(endpoint, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}
