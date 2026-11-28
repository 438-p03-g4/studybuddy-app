export type ForumMember = {
  id: number;
  displayName: string;
};

export type ForumMessage = {
  id: number;
  content: string;
  authorId: number;
  authorName: string;
  createdAt: string;
};

export type StudyGroupForum = {
  group: {
    id: number;
    name: string;
    course: string;
    description?: string;
  };
  members: ForumMember[];
  messages: ForumMessage[];
};
