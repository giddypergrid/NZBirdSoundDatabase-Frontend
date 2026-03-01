import axios, { AxiosResponse } from "axios";
import {
  Bird,
  BirdSound,
  BirdListParams,
  BirdSoundFilterParams,
  PaginatedResponse,
} from "types/bird";
import { API_BASE_URL } from "settings";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ==================== Bird Endpoints ====================

export const birdApi = {

  list: (params?: BirdListParams): Promise<AxiosResponse<PaginatedResponse<Bird>|Bird[]>> =>
    apiClient.get("/birds/", { params }),


  getByEBird: (eBird: string): Promise<AxiosResponse<Bird>> =>
    apiClient.get(`/birds/${encodeURIComponent(eBird)}/`),
};

// ==================== Sound Endpoints ====================

export const soundApi = {

  getBirdAudio: (eBird: string, filename: string): Promise<AxiosResponse<Blob>> =>
    apiClient.get(`/audio/${encodeURIComponent(eBird)}/${encodeURIComponent(filename)}/`, {
      responseType: "blob",
    }),

  listByLabel: (
    primaryLabel: string,
    params?: BirdSoundFilterParams
  ): Promise<AxiosResponse<BirdSound[]>> =>
    apiClient.get(`/sounds/bird-label/${encodeURIComponent(primaryLabel)}/`, { params }),
};

// ==================== File Endpoints ====================

export const imageApi = {

  getBirdImage: (common_name: string, index: number): Promise<AxiosResponse<Blob>> =>
    apiClient.get(`/image/${encodeURIComponent(common_name)}/${index}/`, {
      responseType: "blob",
    }),
};

export default apiClient;
