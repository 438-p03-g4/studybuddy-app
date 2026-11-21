import { API_BASE_URL } from '@/api/config';
import type { StudyGroup } from '@/types/studyGroup';

type StudyGroupResponse = {
  id: number | string;
  name: string;
  course: string;
  iconUrl?: string | null;
  description?: string | null;
};

export type CreateStudyGroupInput = {
  name: string;
  course: string;
  iconUrl?: string;
  description?: string;
};

export async function fetchStudyGroups(
  query: string,
  signal?: AbortSignal,
): Promise<StudyGroup[]> {
  const params = new URLSearchParams();
  const trimmedQuery = query.trim();
  if (trimmedQuery) params.set('query', trimmedQuery);

  const queryString = params.toString();
  const response = await fetch(`${API_BASE_URL}/groups${queryString ? `?${queryString}` : ''}`, {
    credentials: 'include',
    headers: { Accept: 'application/json' },
    signal,
  });

  if (!response.ok) {
    throw new Error(`Unable to load study groups (${response.status})`);
  }

  const data: unknown = await response.json();
  if (!Array.isArray(data)) throw new Error('The study groups response was invalid.');

  return data.filter(isStudyGroupResponse).map((group) => ({
    id: String(group.id),
    name: group.name,
    course: group.course,
    iconUrl: group.iconUrl ?? undefined,
    description: group.description ?? undefined,
  }));
}

export async function createStudyGroup(input: CreateStudyGroupInput): Promise<StudyGroup> {
  const response = await fetch(`${API_BASE_URL}/groups`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(`Unable to create study group (${response.status})`);
  }

  const data: unknown = await response.json();
  if (!isStudyGroupResponse(data)) throw new Error('The created study group response was invalid.');

  return {
    id: String(data.id),
    name: data.name,
    course: data.course,
    iconUrl: data.iconUrl ?? undefined,
    description: data.description ?? undefined,
  };
}

function isStudyGroupResponse(value: unknown): value is StudyGroupResponse {
  if (!value || typeof value !== 'object') return false;
  const group = value as Record<string, unknown>;
  return (
    (typeof group.id === 'number' || typeof group.id === 'string') &&
    typeof group.name === 'string' &&
    typeof group.course === 'string' &&
    (group.iconUrl === undefined || group.iconUrl === null || typeof group.iconUrl === 'string') &&
    (group.description === undefined || group.description === null || typeof group.description === 'string')
  );
}
