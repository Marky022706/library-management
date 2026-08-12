import type { LibraryRequest } from '@/types';
import { mockRequests } from '@/mock';
import { generateId } from '@/utils/id';
import { isoDate } from '@/utils/date';
import { wait } from '@/utils/wait';

let requests: LibraryRequest[] = [...mockRequests];

export async function getAll(): Promise<LibraryRequest[]> {
  await wait();
  return requests;
}

export type CreateRequestInput = Omit<LibraryRequest, 'id' | 'date' | 'status'>;

export async function create(input: CreateRequestInput): Promise<LibraryRequest> {
  await wait();
  const newRequest: LibraryRequest = {
    ...input,
    id: generateId('req'),
    date: isoDate(new Date()),
    status: 'pending',
  };
  requests = [newRequest, ...requests];
  return newRequest;
}

async function setStatus(id: string, status: LibraryRequest['status'], approverId: string): Promise<LibraryRequest> {
  await wait();
  let updated: LibraryRequest | undefined;
  requests = requests.map((request) => {
    if (request.id !== id) return request;
    updated = { ...request, status, approverId, resolvedDate: isoDate(new Date()) };
    return updated;
  });
  if (!updated) throw new Error('Request not found.');
  return updated;
}

export async function approve(id: string, approverId: string): Promise<LibraryRequest> {
  return setStatus(id, 'approved', approverId);
}

export async function reject(id: string, approverId: string): Promise<LibraryRequest> {
  return setStatus(id, 'rejected', approverId);
}
