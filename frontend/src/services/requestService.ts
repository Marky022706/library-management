import { request, type ApiResponse } from './api';
import { type BookRequestData } from './bookRequestService';

export interface RequestSummaryData {
  borrowing: number;
  archive: number;
  acquisition: number;
  total_pending: number;
}

export interface UnifiedRequestsResponse {
  summary: RequestSummaryData;
  data: BookRequestData[];
}

export const requestService = {
  async getUnified(): Promise<ApiResponse<UnifiedRequestsResponse>> {
    return request<UnifiedRequestsResponse>('/api/requests.php');
  },
};
