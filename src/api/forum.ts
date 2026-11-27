import { API_BASE_URL } from '@/api/config';
import type { StudyGroup } from '@/types/studyGroup';
import type { ForumMessage, StudyGroupForum } from '@/types/forum';

export async function fetchMyStudyGroups(signal?: AbortSignal): Promise<StudyGroup[]> {
  const response = await fetch(`${API_BASE_URL}/groups/mine`, {
    credentials: 'include',
    headers: { Accept: 'application/json' },
    signal,
  });
  if (!response.ok) throw new Error(`Unable to load your study groups (${response.status})`);
  const data: unknown = await response.json();
  if (!Array.isArray(data)) throw new Error('The study groups response was invalid.');
  return data.filter(isStudyGroup).map(toStudyGroup);
}

export async function fetchStudyGroupForum(groupId: string, signal?: AbortSignal): Promise<StudyGroupForum> {
  const response = await fetch(`${API_BASE_URL}/groups/${encodeURIComponent(groupId)}/forum`, {
    credentials: 'include',
    headers: { Accept: 'application/json' },
    signal,
  });
  if (!response.ok) throw new Error(`Unable to load this study group (${response.status})`);
  const data = (await response.json()) as StudyGroupForum;
  if (!data?.group || !Array.isArray(data.members) || !Array.isArray(data.messages)) {
    throw new Error('The study group forum response was invalid.');
  }
  return data;
}

export async function createForumMessage(groupId: string, content: string): Promise<ForumMessage> {
  const response = await fetch(`${API_BASE_URL}/groups/${encodeURIComponent(groupId)}/messages`, {
    method: 'POST',
    credentials: 'include',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });
  if (!response.ok) throw new Error(`Unable to post message (${response.status})`);
  return (await response.json()) as ForumMessage;
}

function isStudyGroup(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== 'object') return false;
  const group = value as Record<string, unknown>;
  return typeof group.id === 'number' && typeof group.name === 'string' && typeof group.course === 'string';
}

function toStudyGroup(group: Record<string, unknown>): StudyGroup {
  return {
    id: String(group.id),
    name: String(group.name),
    course: String(group.course),
    iconUrl: typeof group.iconUrl === 'string' ? group.iconUrl : undefined,
    description: typeof group.description === 'string' ? group.description : undefined,
  };
}
