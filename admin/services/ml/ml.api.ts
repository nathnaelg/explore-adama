import { mlClient } from '../api/clients/ml.client';
import { coreClient } from '../api/clients/core.client';

export interface MLHealth {
  status: string;
  service: string;
}

export interface MLStatus {
  lightfm_loaded: boolean;
  similarity_ready: boolean;
}

export interface MLTrainResponse {
  status: string;
  message: string;
}

export interface MLDataSample {
  items_count: number;
  users_count: number;
  interactions_count: number;
  items_head: any[];
  users_head: any[];
  interactions_head: any[];
}

export const MlApi = {
  // ML Service Endpoints (Port 8000)
  checkHealth: async (): Promise<MLHealth> => {
    const response = await mlClient.get<MLHealth>('health/');
    return response.data;
  },

  getStatus: async (): Promise<MLStatus> => {
    const response = await mlClient.get<MLStatus>('debug/status');
    return response.data;
  },

  trainModel: async (): Promise<MLTrainResponse> => {
    const response = await mlClient.post<MLTrainResponse>('train/');
    return response.data;
  },

  // Core API ML Data Endpoints (Port 3005)
  getItems: async (): Promise<any> => {
    const response = await coreClient.get('ml/items');
    return response.data;
  },

  getInteractions: async (): Promise<any> => {
    const response = await coreClient.get('ml/interactions');
    return response.data;
  },

  getUsers: async (): Promise<any> => {
    const response = await coreClient.get('ml/users');
    return response.data;
  },

  // Combined Data Fetch for Overview
  getDataSample: async (): Promise<MLDataSample> => {
    const [items, interactions, users] = await Promise.all([
        coreClient.get('ml/items'),
        coreClient.get('ml/interactions'),
        coreClient.get('ml/users')
    ]);

    return {
        items_count: items.data.count || 0,
        users_count: users.data.count || 0,
        interactions_count: interactions.data.count || 0,
        items_head: items.data.items?.slice(0, 5) || [],
        users_head: users.data.users?.slice(0, 5) || [],
        interactions_head: interactions.data.interactions?.slice(0, 5) || []
    };
  }
};