import {
  CodePlayground,
  notes,
  stickyNotes,
  todos,
  whiteboards,
} from '@prisma/client';

export interface StickyNote {
  note: string;
  color: 'red' | 'blue' | 'green' | 'purple' | 'gray';
  id: Number;
}

export interface newNoteValues {
  noteHeading: string;
  noteDescription: string;
  tags: string;
}
export interface newBoardValues {
  boardName: string;
  boardDescription: string;
  tags: string;
}
export interface newTodolistValues {
  todolistName: string;
  todolistDescription: string;
}
export interface newPlaygroundValues {
  playgroundName: string;
  tags: string;
}
export interface TrashResponse {
  notes: notes[];
  boards: whiteboards[];
}

export interface WhiteboardData {
  boardName: string;
  boardDescription: string;
  tags: string;
}
export interface PlaygroundData {
  playgroundName: string;
  tags: string;
}

export interface DashboardData {
  notes: {
    id: string;
    noteHeading: string;
    emoji: string;
  }[];
  stickyNotes: stickyNotes[];
  boards: whiteboards[];
  impTodos: todos[];
  playgrounds: CodePlayground[];
}
